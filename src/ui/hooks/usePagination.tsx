import React, {useState} from "react";

const usePagination = (data: any[] | undefined,
                       itemsPerPage: number | undefined) => {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPageOptions, setPerPageOptions] = useState([
    { 'label': '10', 'value': 10 },
    { 'label': '25', 'value': 25 },
    { 'label': '50', 'value': 50 },
    { 'label': '100', 'value': 100 },
    { 'label': 'All', 'value': data?.length },
  ]);

  const maxPage = data
    ? (itemsPerPage ? Math.ceil(data.length / itemsPerPage) : data.length)
    : 0;

  const currentData = () => {
    if (showAll) {
      return data ? data : [];
    }
    const begin = (currentPage - 1) * (itemsPerPage ? itemsPerPage : maxPage);
    const end = begin + (itemsPerPage ? itemsPerPage : maxPage);
    return data ? data.slice(begin, end) : [];
  }

  const hasData = () => {
    return data && data.length > 0;
  }

  const next = () => {
    setCurrentPage(Math.min(currentPage + 1, maxPage));
  }

  const prev = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  }

  const jump = (page: number) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  }

  const pageIndex = () => {
    return currentPage;
  }

  const count = () => {
    return data ? Math.ceil(data.length / (itemsPerPage ? itemsPerPage : maxPage)) : 0;
  }

  const toggleShowAll = () => {
    setShowAll(!showAll);
  }

  return {
    next,
    prev,
    jump,
    pageIndex,
    count,
    currentData,
    hasData,
    toggleShowAll,
    showAll,
    perPageOptions
  };
}

export default usePagination;
