import {useCallback, useState} from "react";

const useToggle = (initial: boolean) => {
  const [open, setOpen] = useState(initial);

  return [open, useCallback(() => setOpen(status => !status), [])];
};

export default useToggle;