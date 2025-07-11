import React, { useState, useRef } from "react";
import "../../css/style.css";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import NavPages from "../NavPages";
import successCheck from "../../Image/checked.png";
import axios from "axios";
import {  serverUrl } from "../../APIs/Base_UrL";

export default function UploadEmployees() {
  // State variables
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successConfirmation, setSuccessConfirmation] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef(null);

  // Function to upload file to the backend
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("files", file); // Ensure the key matches your backend expectation

      const response = await axios.post(
        `${serverUrl}/employee/import-excel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data; // Assuming the response is meaningful for further processing
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Allow handling in the component
    }
  };

  // Handle file selection
  const handleFile = (e) => {
    const file = e.target.files[0];
    const maxSize = 20 * 1024; // 20KB in bytes

    setTypeError(null);

    const allowedFileTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedFileTypes.includes(file.type)) {
      setTypeError("Invalid file type. Please upload an Excel file.");
      setExcelFile(null);
      return;
    }

    if (file.size > maxSize) {
      setTypeError("File size exceeds the limit (20KB)");
      setExcelFile(null);
      return;
    }

    setExcelFile(file);
  };

  // Prepare for upload
  const handleUpload = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!excelFile) {
      setTypeError("Please select a file to upload.");
      return;
    }
    if (typeError) {
      setTypeError(typeError);
      return;
    }
    setSuccessModalOpen(true);
  };

  // Close modals
  const handleClose = () => {
    setSuccessModalOpen(false);
  };

  const handleSuccessClick = async () => {
    try {
      if (excelFile) {
        await uploadFile(excelFile);
        setSuccessConfirmation(true);
      }
    } catch (error) {
      setTypeError(
        "An error occurred while uploading the file. Please try again."
      );
    } finally {
      setSuccessModalOpen(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  const confirmClose = () => {
    setSuccessConfirmation(false);
    setExcelFile(null);
    navigate("/admin"); // Navigate to the '/admin' route
  };

  return (
    <div className="background-clr">
      <NavPages />
      <div className="container employee-form">
        <h3>Upload Employees File</h3>
        <form ref={formRef}>
          <div className="row">
            <div className="col-md-8 form-group">
              <input
                type="file"
                name="fileupload"
                className="form-control"
                required
                onChange={handleFile}
                // key={excelFile ? excelFile.name : 'default'}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-success mx-2"
                onClick={handleUpload}
                style={{ width: "100px" }}
                type="button"
              >
                Upload
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={handleCancel}
                style={{ width: "100px" }}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
          {typeError && <p className="text-danger">{typeError}</p>}
        </form>

        <Modal show={isSuccessModalOpen} onHide={handleClose}>
          <Modal.Body>Do you want to upload?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSuccessClick}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          centered
          size="sm"
          show={successConfirmation}
          onHide={confirmClose}
        >
          <Modal.Body>
            <div className="d-flex flex-column modal-success p-4 align-items-center">
              <img
                src={successCheck}
                className="img-fluid mb-4"
                alt="Success"
              />
              <p className="mb-4 text-center">
                Employee Profile Uploaded Successfully
              </p>
              <button
                className="btn w-100 text-white"
                onClick={confirmClose}
                style={{ backgroundColor: "#5EAC24" }}
              >
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
