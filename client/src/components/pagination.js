import React from 'react';
import '../styles/pagination.css';

function Pagination({ numPages, currentPage, setCurrentPage }) {

    const pageNumbers = [];

    for (let i = 1; i <= numPages; i++) {
        pageNumbers.push(i);
    };

    const nextPage = () => {
        if (currentPage !== numPages) {
            setCurrentPage(currentPage + 1);
        };
    };

    const prevPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        };
    };

    return (
        <div className="pagination-container">
            <br />
            {currentPage !== 1 && <button onClick={prevPage} className="pagination-button">prev</button>}

            {pageNumbers.map((number) => {
                if (number < currentPage + 5 && number > currentPage - 1) {
                    return (
                        <button
                            onClick={() => setCurrentPage(number)}
                            className={`pagination-button ${number === currentPage ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    );
                }
                return null;
            })}

            {currentPage !== numPages && (
                <button onClick={nextPage} className="pagination-button">
                    next
                </button>
            )}
        </div>
    );
}

export default Pagination;