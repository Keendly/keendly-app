import React from "react";
import PropTypes from "prop-types";
import LeftIcon from "material-ui/svg-icons/navigation/chevron-left";
import RightIcon from "material-ui/svg-icons/navigation/chevron-right";

import "./Pagination.css";

class Pagination extends React.Component {
  render() {
    const currentPage = this.props.currentPage;
    const left = (
      <li
        className="Pagination__arrow Pagination__arrow--active"
        onClick={() => {
          this.props.handlePageChange(currentPage - 1);
        }}
      >
        <LeftIcon />
      </li>
    );

    const numbers = [0, 1, 2, 3].map(i => {
      switch (currentPage) {
        case 1:
          return i === 0
            ? <PageNumber
                handleClick={this.props.handlePageChange}
                active
                number={currentPage}
                key={i}
              />
            : <PageNumber
                handleClick={this.props.handlePageChange}
                active={false}
                number={i + currentPage}
                key={i}
              />;
        case 2:
          return i === 1
            ? <PageNumber
                handleClick={this.props.handlePageChange}
                active
                number={currentPage}
                key={i}
              />
            : <PageNumber
                handleClick={this.props.handlePageChange}
                active={false}
                number={i + currentPage - 1}
                key={i}
              />;
        default:
          return i === 2
            ? <PageNumber
                handleClick={this.props.handlePageChange}
                active
                number={currentPage}
                key={i}
              />
            : <PageNumber
                handleClick={this.props.handlePageChange}
                active={false}
                number={i + currentPage - 2}
                key={i}
              />;
      }
    });

    const right = (
      <li
        className="Pagination__arrow Pagination__arrow--active"
        onClick={() => {
          this.props.handlePageChange(currentPage + 1);
        }}
      >
        <RightIcon />
      </li>
    );
    return (
      <div className="Pagination__wrapper">
        <div className="Pagination__page">
          {(this.props.currentPage - 1) * this.props.pageSize + 1} -{" "}
          {(this.props.currentPage - 1) * this.props.pageSize +
            this.props.pageSize}
        </div>
        <ul className="Pagination__pages">
          {currentPage !== 1 && left}
          {numbers}
          {right}
        </ul>
      </div>
    );
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired
};

const PageNumber = ({ number, active, handleClick }) => {
  return active
    ? <li
        onClick={() => {
          handleClick(number);
        }}
        className="Pagination__number Pagination__number--active"
      >
        {number}
      </li>
    : <li
        onClick={() => {
          handleClick(number);
        }}
        className="Pagination__number"
      >
        {number}
      </li>;
};

PageNumber.propTypes = {
  number: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default Pagination;
