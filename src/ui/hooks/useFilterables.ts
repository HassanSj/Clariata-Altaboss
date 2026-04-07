import {useCallback, useState} from "react";

const useFilterables = (defaultValue: string = "") => {
  const [value, setValue] = useState(defaultValue);
  const onChange = useCallback((e) => setValue(e.target.value), []);

  return {value, onChange};
};

export default useFilterables;