import {useEffect} from "react";

interface IProps {
  values?: any[],
  onChange?: () => unknown
}

const useOnChange = ({ values, onChange }: IProps) => {

  if (onChange) {
    useEffect(() => {
      onChange();
    }, values);
  }

  return;
};

export default useOnChange;