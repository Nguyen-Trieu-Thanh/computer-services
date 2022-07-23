import React from "react";
import { Pagination } from "react-bootstrap";

//CSS
import "./CustomPagination.css";

const CustomPagination = ({ count, handlePaginationClick, page }) => {
  let items = [];
  for (let number = 1; number <= count; number++) {
    items.push(
      <Pagination.Item
        onClick={() => {
          handlePaginationClick(number);
        }}
        key={number}
        active={number === page}
        activeLabel=""
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className="pagination-container">
      <Pagination.First onClick={() => handlePaginationClick(1)} />

      {page < 3 ? null : <Pagination.Ellipsis disabled />}

      {items.length > 3
        ? page < 3
          ? items.slice(0, 4)
          : items.length < page + 2
          ? items.slice(items.length - 4)
          : items.slice(page - 2, page + 1)
        : items}

      {items.length < page + 2 ? null : <Pagination.Ellipsis disabled />}

      <Pagination.Last onClick={() => handlePaginationClick(items.length)} />
    </Pagination>
  );
};

export default CustomPagination;
