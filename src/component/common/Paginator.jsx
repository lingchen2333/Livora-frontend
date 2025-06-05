import React from "react";
import { Pagination } from "react-bootstrap";
import { setCurrentPage } from "../../store/features/paginationSlice";
import { useDispatch, useSelector } from "react-redux";

const Paginator = () => {
  const dispatch = useDispatch();

  const { itemsPerPage, totalItems, currentPage } = useSelector(
    (state) => state.pagination
  );

  const paginate = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
  };

  let active = currentPage;
  let items = [];

  for (
    let pageNumber = 1;
    pageNumber <= Math.ceil(totalItems / itemsPerPage);
    pageNumber++
  ) {
    items.push(
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === active}
        onClick={() => paginate(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>
    );
  }

  return (
    <div className="d-flex justify-content-center me-5">
      <Pagination>{items}</Pagination>
    </div>
  );
};

export default Paginator;
