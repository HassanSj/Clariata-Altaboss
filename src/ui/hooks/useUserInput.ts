import {useCallback, useState} from "react";

const useUserInput = (defaultValue: any) => {
  const [value, setValue] = useState(defaultValue);
  const onChange = useCallback((e) => setValue(e.target.value), []);

  return {value, setValue, onChange,};
};

export default useUserInput;