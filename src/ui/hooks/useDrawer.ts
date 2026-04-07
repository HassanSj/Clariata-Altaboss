import {useCallback, useState} from "react";

const useDrawer = (initial: boolean, onClose: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(initial);

  const toggleDrawer = (open: any) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsDrawerOpen(!open);
    if (!open && onClose) {
      onClose();
    }
  };
  const handleToggleDrawer = useCallback((open) => toggleDrawer(open), []);

  return {isDrawerOpen, setIsDrawerOpen, toggleDrawer};
};

export default useDrawer;