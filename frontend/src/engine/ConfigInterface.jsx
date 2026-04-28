import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useConfigurator } from "../pages/store/ConfiguratorContext"; 

export const ConfigInterface = () => {
  const { tableWidth, setTableWidth, legs, setLegs, legsColor, setLegsColor } = useConfigurator();
  
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: "5%", // 🔥 FIX: Creates a clean, responsive gap from the right edge
        display: "flex",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {/* Slightly increased width to comfortably fit the new padding */}
      <Stack spacing={4} sx={{ width: "340px" }}> 
        
        {/* 🔥 FIX: Centered the main title and made it slightly bolder */}
        <Typography variant="h6" sx={{ color: "#333", fontWeight: 600, textAlign: "center", mb: -1 }}>
          Table Configurator
        </Typography>

        {/* --- Table Width --- */}
        {/* 🔥 FIX: px: 4 adds extra padding on the left and right, pushing text inside */}
        <Box className="glass" sx={{ px: 4, py: 3 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "#555", fontWeight: 600, mb: 1.5 }}>Table width</FormLabel>
            <Slider
              sx={{ color: "#1976d2" }}
              min={50}
              max={200}
              value={tableWidth}
              onChange={(e) => setTableWidth(e.target.value)}
              valueLabelDisplay="auto"
            />
          </FormControl>
        </Box>

        {/* --- Legs Layout --- */}
        <Box className="glass" sx={{ px: 4, py: 3 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "#555", fontWeight: 600, mb: 1.5 }}>Legs Layout</FormLabel>
            <RadioGroup
              value={legs}
              onChange={(e) => setLegs(parseInt(e.target.value))}
            >
              <FormControlLabel value={0} control={<Radio />} label={<Typography sx={{color: "#333", fontWeight: 500}}>Standard</Typography>} />
              <FormControlLabel value={1} control={<Radio />} label={<Typography sx={{color: "#333", fontWeight: 500}}>Solid</Typography>} />
              <FormControlLabel value={2} control={<Radio />} label={<Typography sx={{color: "#333", fontWeight: 500}}>Design</Typography>} />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* --- Legs Color --- */}
        <Box className="glass" sx={{ px: 4, py: 3 }}>
          <FormControl fullWidth>
            <FormLabel sx={{ color: "#555", fontWeight: 600, mb: 1.5 }}>Legs Color</FormLabel>
            <RadioGroup
              value={legsColor}
              onChange={(e) => setLegsColor(e.target.value)}
            >
              <FormControlLabel value={"#777777"} control={<Radio />} label={<Typography sx={{color: "#333", fontWeight: 500}}>Black</Typography>} />
              <FormControlLabel value={"#ECECEC"} control={<Radio />} label={<Typography sx={{color: "#333", fontWeight: 500}}>Chrome</Typography>} />
              <FormControlLabel value={"#C9BD71"} control={<Radio />} label={<Typography sx={{color: "#333", fontWeight: 500}}>Gold</Typography>} />
              <FormControlLabel value={"#C9A3B9"} control={<Radio />} label={<Typography sx={{color: "#333", fontWeight: 500}}>Pink Gold</Typography>} />
            </RadioGroup>
          </FormControl>
        </Box>

      </Stack>
    </Box>
  );
};

export default ConfigInterface;