import { OrbitControls, Stage } from "@react-three/drei";
import { Table } from "./Table";

const ConfiguratorCanvas = () => {
  return (
    <>
      <Stage
        intensity={1.5}
        environment="city" 
        shadows={{
          type: "accumulative",
          color: "#85ffbd",
          colorBlend: 2,
          opacity: 0.2,
        }}
        adjustCamera={2} // 🔥 FIX: Stops the Stage from flattening your view!
      >
        <Table />
      </Stage>

      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0.5, 0]} // Focuses slightly above the floor
      />
    </>
  );
};

export default ConfiguratorCanvas;