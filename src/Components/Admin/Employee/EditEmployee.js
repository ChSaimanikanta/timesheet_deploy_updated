import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getEmployeeDetails, updateEmployeeData } from './EmployeeService'; // API service
import "./CreateEmployee.css";
import successCheck from '../../Image/checked.png';
import { checkEmployeeDuplicates } from "../Employee/EmployeeService";
export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const adminValue = useSelector(state => state.adminLogin.value);
  const adminId = adminValue.adminId;

  // State for form values, errors, and success modal
  const [formValues, setFormValues] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    address: '',
    mobileNumber: '',
    emailId: '',
    projectId: '',
    aadharNumber: '',
    panNumber: '',
    password: '',
    projects: []
  });

  const [initialFormValues, setInitialFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [successConfirmation, setSuccessConfirmation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await getEmployeeDetails(id);
        setFormValues(data);
        setInitialFormValues(data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        alert("Failed to fetch employee details.");
      }
    };
    fetchEmployeeData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === "panNumber" ? value.toUpperCase() : value,
    }));
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validate input fields
  const validate = (values) => {
    const errors = {};
    if (!values.employeeId) errors.employeeId = "EmployeeId is required!"
    if (!values.firstName) errors.firstName = "Firstname is required!";
    if (!values.lastName) errors.lastName = "Lastname is required!";
    if (!values.address) errors.address = "Address is required!";
    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile Number is required!";
    } else if (!/^\d{10}$/.test(values.mobileNumber)) {
      errors.mobileNumber = "Mobile Number must be 10 digits!";
    }
    if (!values.emailId) {
      errors.emailId = "Email Id is required!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailId)) {
      errors.emailId = "Invalid Email Id!";
    }
    if (!values.aadharNumber) {
      errors.aadharNumber = "Aadhar Number is required!";
    } else if (!/^\d{12}$/.test(values.aadharNumber)) {
      errors.aadharNumber = "Aadhar Number must be 12 digits!";
    }
    if (!values.panNumber) {
      errors.panNumber = "PAN Number is required!";
    } else if (!/[A-Z]{5}\d{4}[A-Z]{1}/.test(values.panNumber)) {
      errors.panNumber = "PAN card number must be of format: BEJPC8665H";
    }
    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters long!";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate(formValues);
    if (Object.keys(validationError).length > 0) {
      setFormErrors(validationError);
      return;
    }

    // Check for duplicate entries (excluding the currently editing record)
    try {
      const duplicates = await checkEmployeeDuplicates(formValues);

      if (duplicates) {
        const duplicateErrors = {};

        // Helper to detect if the change is actually new or editing same field
        const isUnchanged = (key) =>
          (formValues[key]?.toString().toLowerCase() === initialFormValues[key]?.toString().toLowerCase());

        if (duplicates.employeeId && !isUnchanged("employeeId")) {
          duplicateErrors.employeeId = "Employee ID already exists!";
        }
        if (duplicates.emailId && !isUnchanged("emailId")) {
          duplicateErrors.emailId = "Email ID already exists!";
        }
        if (duplicates.panNumber && !isUnchanged("panNumber")) {
          duplicateErrors.panNumber = "PAN Number already exists!";
        }
        if (duplicates.mobileNumber && !isUnchanged("mobileNumber")) {
          duplicateErrors.mobileNumber = "Mobile Number already exists!";
        }
        if (duplicates.aadharNumber && !isUnchanged("aadharNumber")) {
          duplicateErrors.aadharNumber = "Aadhar Number already exists!";
        }

        if (Object.keys(duplicateErrors).length > 0) {
          setFormErrors(duplicateErrors);
          return;
        }
      }

      const updatedData = {
        ...formValues,
        projects: formValues.projectId ? [formValues.projectId] : [],
      };

      await updateEmployeeData(id, adminId, updatedData);
      setSuccessConfirmation(true);
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Handle cancel button
  const handleCancelSuccess = () => {
    navigate('/admin/searchemployee');
  };

  // Handle confirmation modal close
  const handleSubmitClick = () => {
    setSuccessConfirmation(false);
    navigate('/admin/searchemployee');
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="ti-background-clr">
      <div className="sprAdmin-createAdmin mt-4">
        <form onSubmit={handleSubmit}>
          <div className="sprAdmin-createAdmin-body border border-1 border-dark rounded p-4">
            <p className="sprAdmin-createAdmin-title">Edit Employee Details</p>

            <div className="row sprAdmin-createAdmin-form">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">EmployeeId<span className="text-danger">*</span></label>
                  <input type="text" name="employeeId" className="form-control" value={formValues.employeeId} onChange={handleChange} />
                  <p className="text-danger">{formErrors.employeeId}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label">First Name<span className="text-danger">*</span></label>
                  <input type="text" name="firstName" className="form-control" value={formValues.firstName} onChange={handleChange} />
                  <p className="text-danger">{formErrors.firstName}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label">Last Name<span className="text-danger">*</span></label>
                  <input type="text" name="lastName" className="form-control" value={formValues.lastName} onChange={handleChange} />
                  <p className="text-danger">{formErrors.lastName}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Id<span className="text-danger">*</span></label>
                  <input type="email" name="emailId" className="form-control" value={formValues.emailId} onChange={handleChange} />
                  <p className="text-danger">{formErrors.emailId}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address<span className="text-danger">*</span></label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    value={formValues.address}
                    onChange={handleChange}
                  />
                  <p className="text-danger">{formErrors.address}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label">Pan Number:</label>
                  <input
                    type="text"
                    name="panNumber"
                    className="form-control"
                    value={formValues.panNumber}
                    onChange={(e) => {
                      const upperCaseValue = e.target.value.toUpperCase();
                      handleChange({
                        target: {
                          name: "panNumber",
                          value: upperCaseValue,
                        },
                      });
                    }}
                  />
                  <p className="text-danger">{formErrors.panNumber}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Mobile Number:</label>
                  <input type="text" name="mobileNumber" className="form-control" value={formValues.mobileNumber} onChange={handleChange} />
                  <p className="text-danger">{formErrors.mobileNumber}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Aadhar Number:</label>
                  <input type="text" name="aadharNumber" className="form-control" maxLength={12} value={formValues.aadharNumber} onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (value.length <= 12) {
                      handleChange({ target: { name: "aadharNumber", value } }); // Update state only if length <= 12
                    }
                  }} />
                  <p className="text-danger">{formErrors.aadharNumber}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password<span className="text-danger">*</span></label>
                  <div className="position-relative">
                    <input type={showPassword ? "text" : "password"} name="password" className="form-control"
                      value={formValues.password}
                      onChange={handleChange} />
                    <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} text-primary`}
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                      }}
                      onClick={togglePasswordVisibility}
                    ></i>
                  </div>
                  <p className="text-danger">{formErrors.password}</p>
                </div>
              </div>
            </div>

            <div className="buttons text-center mt-3">
              <button type="submit" className="btn btn-success mx-2">Submit</button>
              <button type="button" className="btn btn-secondary mx-2" onClick={handleCancelSuccess}>Cancel</button>
            </div>
          </div>
        </form>
      </div>

      <Modal centered show={successConfirmation} onHide={handleSubmitClick}>
        <Modal.Body className="text-center">
          <img src={successCheck} alt="Success" className="mb-3" width="50" />
          <h5>Employee Updated Successfully!</h5>
          <Button variant="primary" onClick={handleSubmitClick}>OK</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
