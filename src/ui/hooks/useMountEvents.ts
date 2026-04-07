import {useEffect} from "react";

interface IProps {
  onMounted?: () => unknown,
  onUnmounted?: () => unknown,
  watchItems?: any[],
  onChange?: () => unknown,
}

const useMountEvents = ({ onMounted, onUnmounted, watchItems, onChange }: IProps) => {

  useEffect(() => {
    if (onMounted) {
      onMounted();
    }
    return () => {
      if (onUnmounted) {
        onUnmounted();
      }
    }
  }, []);

  if (onChange) {
    useEffect(() => {
      onChange();
    }, watchItems);
  }

  return;
};

export default useMountEvents;
