import { createContext, useContext, useState } from "react";

const ConfiguratorContext = createContext();

export const ConfiguratorProvider = ({ children }) => {
  const [legs, setLegs] = useState(0);
  const [legsColor, setLegsColor] = useState("#777777");
  const [tableWidth, setTableWidth] = useState(100);

  return (
    <ConfiguratorContext.Provider
      value={{
        legs,
        setLegs,
        legsColor,
        setLegsColor,
        tableWidth,
        setTableWidth,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext);
  
  // Safety check to ensure hook is used within the Provider
  if (context === undefined) {
    throw new Error("useConfigurator must be used within a ConfiguratorProvider");
  }
  
  return context;
};