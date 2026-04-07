import {useState} from "react";
import {IDataTableHeader, IDataTableView} from "~/types/data";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {SortDirection} from "~/ui/constants/data";


const useDataViews = (views: IDataTableView[], defaultViewId: string, defaultSortByField: string) => {
  const [selectedView, setSelectedView] = useState<IDataTableView | undefined>(views ? views[0] : undefined);
  const [currentHeaders, setCurrentHeaders] = useState<IDataTableHeader[] | undefined>(views ? views[0]?.headers : undefined);

  const [selectedHeader, setSelectedHeader] = useState<IDataTableHeader | undefined>();

  const selectView = (view: IDataTableView | undefined) => {
    if (view) {
      setCurrentHeaders(view.headers);
    }
    setSelectedView(view);
  }

  const selectViewById = (viewId: string) => {
    selectView(findView(viewId));
  }

  const findView = (viewId: string) => {
    return views?.find(v => v.id === viewId);
  }

  const checkIsCurrentView = (viewId: string) => {
    return viewId === selectedView?.id;
  }

  const selectHeader = (header: IDataTableHeader | undefined) => {
    setSelectedHeader(header);
  }

  const selectHeaderById = (headerId: string) => {
    setSelectedHeader(findHeader(headerId));
  }

  const findHeader = (headerId: string) => {
    return currentHeaders?.find(v => v.id === headerId);
  }

  const getSelectedView = () => {
    return selectedView;
  }

  const getCurrentHeaders = () => {
    return currentHeaders;
  }

  useMountEvents({
    onMounted: async () => {
      selectViewById(defaultViewId);
    }
  });

  return {
    selectedView,
    getSelectedView,
    selectView,
    selectViewById,
    checkIsCurrentView,
    selectHeader,
    selectHeaderById,
    getCurrentHeaders
  };
};

export default useDataViews;
