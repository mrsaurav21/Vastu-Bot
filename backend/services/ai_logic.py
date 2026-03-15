"""import cv2
import numpy as np
import base64

def detect_walls_from_image(image_base64: str):
    try:
        # 1. Decode & Clean
        encoded_data = image_base64.split(',')[1] if ',' in image_base64 else image_base64
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None: return []

        scale = 1200 / max(img.shape[:2])
        img = cv2.resize(img, (int(img.shape[1] * scale), int(img.shape[0] * scale)))
        center_x, center_y = img.shape[1] / 2, img.shape[0] / 2

        # 2. Find the Absolute Boundary (Hull)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Blur to merge wall segments and ignore the door arc details
        blurred = cv2.GaussianBlur(gray, (7, 7), 0)
        thresh = cv2.threshold(blurred, 220, 255, cv2.THRESH_BINARY_INV)[1]

        # RETR_EXTERNAL ignores all the "fingers" and "spikes" inside the room
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours: return []
        
        # Select the main room silhouette
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Draw a clean, 10px thick spine of ONLY that outer shell
        mask = np.zeros_like(gray)
        cv2.drawContours(mask, [largest_contour], -1, 255, 10)

        # 3. Line Detection with Strict Straightness
        lines = cv2.HoughLinesP(
            mask, 1, np.pi/180, 
            threshold=50, 
            minLineLength=100, # Ignores the small splinter on the left
            maxLineGap=120     # Bridges the gap where the door arc was
        )

        if lines is None: return []

        processed_walls = []
        SNAP_DIST = 90 # High magnet power to lock corners perfectly
        DIVISOR = 50.0

        for line in lines:
            x1, y1, x2, y2 = map(float, line[0])
            
            # --- THE ARC KILLER ---
            # If a line moves more than 40px in both X and Y, it's a diagonal splinter
            dx, dy = abs(x1 - x2), abs(y1 - y2)
            if dx > 40 and dy > 40: continue 

            # Force perfect straightness (No more tilted walls)
            if dx > dy: y2 = y1 
            else: x2 = x1      

            # --- CORNER LOCKING ---
            for other in processed_walls:
                pts_other = [(other['_raw']['x1'], other['_raw']['y1']), 
                             (other['_raw']['x2'], other['_raw']['y2'])]
                for ox, oy in pts_other:
                    if np.sqrt((x1-ox)**2 + (y1-oy)**2) < SNAP_DIST:
                        x1, y1 = ox, oy
                    if np.sqrt((x2-ox)**2 + (y2-oy)**2) < SNAP_DIST:
                        x2, y2 = ox, oy

            # Anti-Overlap Check
            mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
            is_duplicate = False
            for p_wall in processed_walls:
                if abs(mid_x - p_wall['_mid'][0]) < 30 and abs(mid_y - p_wall['_mid'][1]) < 30:
                    is_duplicate = True
                    break

            if not is_duplicate and np.sqrt((x1-x2)**2 + (y1-y2)**2) > 20:
                processed_walls.append({
                    "start": {"x": (x1 - center_x) / DIVISOR, "y": (y1 - center_y) / DIVISOR},
                    "end": {"x": (x2 - center_x) / DIVISOR, "y": (y2 - center_y) / DIVISOR},
                    "_raw": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "_mid": (mid_x, mid_y)
                })

        return processed_walls
    except Exception as e:
        print(f"Final Fix Error: {e}")
        return []"""
import cv2
import numpy as np
import base64

def detect_walls_from_image(image_base64: str):
    """
    Service: Processes base64 image string to extract structural wall coordinates.
    Optimized for single-wall output and corner snapping.
    """
    try:
        # 1. Decode & Clean
        # Handle cases where the base64 string might include the data header
        encoded_data = image_base64.split(',')[1] if ',' in image_base64 else image_base64
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return []

        # Resize for consistent coordinate calculation across different image sizes
        scale = 1200 / max(img.shape[:2])
        img = cv2.resize(img, (int(img.shape[1] * scale), int(img.shape[0] * scale)))
        center_x, center_y = img.shape[1] / 2, img.shape[0] / 2

        # 2. Extract Absolute Boundary (Hull)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (7, 7), 0)
        thresh = cv2.threshold(blurred, 220, 255, cv2.THRESH_BINARY_INV)[1]

        # Find external contours only (ignores interior noise/furniture)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return []
        
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Create a clean mask of the outer shell
        mask = np.zeros_like(gray)
        cv2.drawContours(mask, [largest_contour], -1, 255, 10)

        # --- SKELETONIZATION (Ensures Single Wall Output) ---
        # Collapses the 10px contour into a 1px spine to prevent "double walls"
        if hasattr(cv2, 'ximgproc'):
            mask = cv2.ximgproc.thinning(mask)
        else:
            kernel = np.ones((3,3), np.uint8)
            mask = cv2.erode(mask, kernel, iterations=2)

        # 3. Probabilistic Line Detection
        lines = cv2.HoughLinesP(
            mask, 1, np.pi/180, 
            threshold=50, 
            minLineLength=100, 
            maxLineGap=120
        )

        if lines is None:
            return []

        processed_walls = []
        SNAP_DIST = 90  # Distance threshold to force corners to connect
        DIVISOR = 50.0 # Scaling factor for 3D world units

        for line in lines:
            x1, y1, x2, y2 = map(float, line[0])
            
            # --- Orthogonal Constraint ---
            # Rejects diagonals (door arcs) and forces perfect 90-degree angles
            dx, dy = abs(x1 - x2), abs(y1 - y2)
            if dx > 40 and dy > 40:
                continue 

            if dx > dy:
                y2 = y1 
            else:
                x2 = x1      

            # --- CORNER SNAPPING ---
            for other in processed_walls:
                pts_other = [(other['_raw']['x1'], other['_raw']['y1']), 
                             (other['_raw']['x2'], other['_raw']['y2'])]
                for ox, oy in pts_other:
                    if np.sqrt((x1-ox)**2 + (y1-oy)**2) < SNAP_DIST:
                        x1, y1 = ox, oy
                    if np.sqrt((x2-ox)**2 + (y2-oy)**2) < SNAP_DIST:
                        x2, y2 = ox, oy

            # --- DEDUPLICATION ---
            # Prevents multiple 3D walls from stacking in the same spot
            mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
            is_duplicate = False
            for p_wall in processed_walls:
                if abs(mid_x - p_wall['_mid'][0]) < 35 and abs(mid_y - p_wall['_mid'][1]) < 35:
                    is_duplicate = True
                    break

            if not is_duplicate and np.sqrt((x1-x2)**2 + (y1-y2)**2) > 30:
                processed_walls.append({
                    "start": {"x": (x1 - center_x) / DIVISOR, "z": (y1 - center_y) / DIVISOR},
                    "end": {"x": (x2 - center_x) / DIVISOR, "z": (y2 - center_y) / DIVISOR},
                    "_raw": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "_mid": (mid_x, mid_y)
                })

        return processed_walls
        
    except Exception as e:
        print(f"AI Service Error: {e}")
        return []