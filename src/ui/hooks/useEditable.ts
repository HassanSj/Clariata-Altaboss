import {useState} from "react";

const useEditable = (initialTypes?: { [key: string]: boolean }) => {
  const [editableTypes, setEditableTypes] = useState(initialTypes);
  const [selectedItem, setSelectedItem] = useState<any | undefined>();

  const setTypes = (types?: { [key: string]: boolean }) => {
    setEditableTypes(types);
  }

  const getSelected = () => {
    return selectedItem;
  }

  const setSelected = (item: any) => {
    setSelectedItem(item);
  }

  const toggleType = (type: string) => {
    if (!editableTypes){
      return;
    }
    if (editableTypes[type]){
      setType(type, false);
    } else {
      setType(type, true);
    }
  }

  const setType = (type: string, show: boolean) => {
    if (!editableTypes){
      return;
    }
    const result = Object.assign({}, editableTypes);
    result[type] = show;
    setEditableTypes(result);
  }

  const showType = (type: string) => {
    setType(type, true);
  }

  const hideType = (type: string) => {
    setType(type, false);
  }

  const isTypeOpen = (type: string) => {
    if (!editableTypes){
      return false;
    }
    return Boolean(editableTypes[type]);
  }

  const setSelectedAndShow = (type: string, item: any | undefined) => {
    setSelected(item);
    showType(type);
  }

  return {
    getSelected,
    setTypes,
    setSelected,
    toggleType,
    showType,
    hideType,
    setSelectedAndShow,
    isTypeOpen
  };
};

export default useEditable;
