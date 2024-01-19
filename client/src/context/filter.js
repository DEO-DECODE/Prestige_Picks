import { useState, useContext, createContext } from "react";

const FilterContext = createContext();
const FilterProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    radio: [],
    checked: [],
  });

  return (
    <FilterContext.Provider value={[auth, setAuth]}>
      {children}
    </FilterContext.Provider>
  );
};

// custom hook
const useFilter = () => useContext(FilterContext);

export { useFilter, FilterProvider };
