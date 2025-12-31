import React, { useEffect, useState, useCallback } from "react";
import { getEmployeeData } from "./EmployeeService";
import { useNavigate } from "react-router-dom";
import NavPages from "../NavPages";
import "./SearchEmployee.css";

export default function SearchEmployee() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 items per page

  const navigate = useNavigate();

  // Fetch and filter employee data
  const handleFilter = useCallback(async () => {
    try {
      if (searchText.trim() === "") {
        setItems([]);
        setResult(false);
        return;
      }

      const allEmployees = await getEmployeeData();
      console.log("All Employees:", allEmployees);
      console.log("Search Text:", searchText);

      const filteredEmployees = allEmployees.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          employee.employeeId.toLowerCase().includes(searchText.toLowerCase())
      );

      if (filteredEmployees.length > 0) {
        setItems(filteredEmployees);
        setResult(false);
        setCurrentPage(1); // Reset to first page when new search happens
      } else {
        setItems([]);
        setResult(true);
      }
    } catch (error) {
      console.error("Error filtering employee data:", error);
      setResult(true);
    }
  }, [searchText]);

  // Automatically filter data when searchText changes
  useEffect(() => {
    handleFilter();
  }, [searchText, handleFilter]);

  const handleRowClick = (employeeId) => {
    console.log("Navigating to employee details:", employeeId);
    navigate(`/admin/employeedetails/${employeeId}`);
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  // Handle Next and Previous buttons
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="ti-background-clr">
      <NavPages />
      <div className="container employee-form">
        <p className="sprAdmin-createAdmin-title">Search Employee</p>
        <div className="d-flex justify-content-end py-2">
          <div>
            <form className="no-focus-outline">
              <input
                className="w-75 search-control"
                type="search"
                value={searchText}
                placeholder="Search employee"
                onChange={handleSearchChange}
              />
              <button className="border-0 bg-white" type="button" onClick={handleFilter}>
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 search-employee">
            <div className="employee-list">
              {result ? (
                <p className="no-record-found">No record found</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover small-table"> {/* Add class to reduce size */}
                    <thead className="table-header">
                      <tr className="text-center text-white">
                        <th scope="col">SI.No</th>
                        <th scope="col">EMPLOYEE ID</th>
                        <th scope="col">FIRST NAME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((employee, index) => (
                        <tr
                          key={employee.employeeId}
                          onClick={() => handleRowClick(employee.employeeId)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="text-center">{startIndex + index + 1}</td>
                          <td className="text-center">{employee.employeeId}</td>
                          <td className="text-center">{employee.firstName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {items.length > itemsPerPage && (
          <div className="pagination-buttons">
            <button
              className="btn btn-primary mx-2"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-primary mx-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        <div className="buttons">
          <button type="button" className="btn btn-secondary w-auto" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
