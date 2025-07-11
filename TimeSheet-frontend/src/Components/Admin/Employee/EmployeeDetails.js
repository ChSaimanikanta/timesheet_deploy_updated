import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getEmployeeDetails, deleteEmployeeData } from "./EmployeeService";
import successCheck from "../../Image/checked.png";
import { useSelector } from "react-redux";
import './EmployeeDetails.css';

export default function EmployeeDetails() {
  const { id } = useParams(); // Get the employee ID from route parameters
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successConfirmation, setSuccessConfirmation] = useState(false);
  
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue?.adminId;

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await getEmployeeDetails(id);
        setUserData(response);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    fetchEmployeeData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/editemployee/${id}`);
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteSuccess = async () => {
    try {
      await deleteEmployeeData(id, adminId);
      setSuccessConfirmation(true);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleCloseConfirmation = () => {
    setSuccessConfirmation(false);
    navigate("/admin/searchemployee");
  };

  const handleSuccess = () => {
    setSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    // setSuccessModalOpen(false);
    navigate("/admin/searchemployee")
  };

  return (
    <div className="ti-background-clr">
      <div className="container employee-form">
        <p className="sprAdmin-createAdmin-title mb-4">Employee Details</p>
        {userData ? (
          <>
            <div className="row">
              {/** Employee ID */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Employee Id:</label>
                  <span className="col-md-8">{userData.employeeId}</span>
                </div>
              </div>

              {/** First Name */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Firstname:</label>
                  <span className="col-md-8">{userData.firstName}</span>
                </div>
              </div>

              {/** Last Name */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Lastname:</label>
                  <span className="col-md-8">{userData.lastName}</span>
                </div>
              </div>

              {/** Address */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Address:</label>
                  <span className="col-md-8">{userData.address}</span>
                </div>
              </div>

              {/** Mobile Number */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Mobile Number:</label>
                  <span className="col-md-8">{userData.mobileNumber}</span>
                </div>
              </div>

              {/** Email ID */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Email Id:</label>
                  <span className="col-md-8">{userData.emailId}</span>
                </div>
              </div>

              {/** Projects */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Project Id(s):</label>
                  <span className="col-md-8">
                    {userData.projects && userData.projects.length > 0 ? (
                      userData.projects.map((project, index) => (
                        <span key={index}>
                          {project}
                          {index < userData.projects.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      "No projects assigned"
                    )}
                  </span>
                </div>
              </div>

              {/** Aadhar Card */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Aadhar Card:</label>
                  <span className="col-md-8">{userData.aadharNumber}</span>
                </div>
              </div>
              {/* <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Password:</label>
                  <span className="col-md-8">{userData.password}</span>
                </div>
              </div> */}

              {/** Pan Card */}
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <label className="col-md-4 fw-bold">Pan Card:</label>
                  <span className="col-md-8">{userData.panNumber}</span>
                </div>
              </div>
            </div>

            {/** Buttons */}
            <div className="buttons mt-4">
              <button type="button" className="btn btn-primary mx-2" onClick={handleSuccess}>
                Edit
              </button>
              <button type="button" className="btn btn-danger mx-2" onClick={handleDeleteConfirm}>
                Delete
              </button>
              <button type="button" className="btn btn-secondary mx-2" onClick={handleCloseSuccessModal}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}

        {/** Edit Confirmation Modal */}
        <Modal show={isSuccessModalOpen} onHide={handleCloseSuccessModal}>
          <Modal.Body>Do you want to Edit?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSuccessModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        {/** Delete Confirmation Modal */}
        <Modal show={isDeleteModalOpen} onHide={handleDeleteClose}>
          <Modal.Body>Do you want to Delete?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSuccess}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/** Success Confirmation Modal */}
        <Modal centered size="sm" show={successConfirmation} onHide={handleCloseConfirmation}>
          <Modal.Body>
            <div className="d-flex flex-column modal-success p-4 align-items-center">
              <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
              <p className="mb-4 text-center">Employee Profile Deleted Successfully</p>
              <button className="btn w-100 text-white" onClick={handleCloseConfirmation} style={{ backgroundColor: "#5EAC24" }}>
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
