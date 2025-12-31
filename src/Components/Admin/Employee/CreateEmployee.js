import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { checkEmployeeDuplicates } from "../Employee/EmployeeService";
import { useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons
import "./CreateEmployee.css";
const AddEmployeeData = () => {
  const [formValues, setFormValues] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    aadharNumber: "",
    panNumber: "",
    mobileNumber: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [touched, setTouched] = useState({});
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue.adminId;
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state && location.state.employee) {
      setFormValues(location.state.employee);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`*** HandleChange Called ***`);
    console.log(`Name: ${name}, Value: ${value}`); // Debugging log

    setFormValues((prevData) => ({
      ...prevData,
      [name]: name === "panNumber" ? value.toUpperCase() : value,
    }));

    // Avoid trimming user input while typing
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear specific field errors on change
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    // Clear duplicate errors for the field being edited
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    // Call validate function
    validate(name, value);
  };

  const validate = (name = null, value = null) => {
    console.log(`### Validate Function Called ###`);

    let errors = {};
    let isValid = true;

    // Validate all fields on save or specific field on change
    const fieldsToValidate = name ? { [name]: value } : formValues;

    for (const field in formValues) {
      const val = formValues[field];

      // If a field is empty and touched, mark it as an error
      if (!val.trim()) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`; // Dynamically generate error messages
        isValid = false;
      }
    }


    // Apply existing validation logic for non-empty fields
    for (const field in fieldsToValidate) {
      const val = fieldsToValidate[field];

      if (field === "firstName" && !/^[A-Za-z\s]+$/.test(val)) {
        errors.firstName = "First name must contain only alphabets";
        isValid = false;
      }

      if (field === "emailId") {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
          errors.emailId = "Enter a valid email";
          isValid = false;
        }
      }


      if (field === "mobileNumber" && !/^\d{10}$/.test(val)) {
        errors.mobileNumber = "Mobile number must be 10 digits";
        isValid = false;
      }

      if (field === "password") {
        if (!val.trim()) {
          errors.password = "Password is required";  // ✅ Prevents empty password submission
          isValid = false;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val)) {
          errors.password = "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol";
          isValid = false;
        } else if (!/^[^%&=/<>?]+$/.test(val)) {
          errors.password = "Password must not contain reserved characters (% & = / < > ?)";
          isValid = false;
        }
      }
      if (field === "panNumber") {
        if (!val) {
          errors.panNumber = "PAN Number is required";
          isValid = false;
        } else if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(val)) {
          errors.panNumber = "PAN card number must be of format: BEJPC8665H";
          isValid = false;
        }
      }


    }

    setFormErrors(errors);
    return isValid;
  };


  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    validate(name, value);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    console.log("handle save");

    // Trim inputs only on save
    const trimmedValues = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [key, value.trim()])
    );

    // Mark all fields as touched so errors show up if they're empty
    setTouched(Object.keys(formValues).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    const isFormValid = validate(null, trimmedValues);

    if (!isFormValid) {
      console.log("Validation failed, form cannot be submitted.");
      return;
    }

    try {
      const duplicates = await checkEmployeeDuplicates(trimmedValues);

      const newValidationErrors = {};
      if (duplicates.employeeId) newValidationErrors.employeeId = "EmployeeId already exists"
      if (duplicates.emailId) newValidationErrors.emailId = "Email ID already exists";
      if (duplicates.panNumber) newValidationErrors.panNumber = "PAN Number already exists";
      if (duplicates.mobileNumber) newValidationErrors.mobileNumber = "Mobile Number already exists";
      if (duplicates.aadharNumber) newValidationErrors.aadharNumber = "Aadhar Number already exists";

      if (Object.keys(newValidationErrors).length > 0) {
        setValidationErrors(newValidationErrors);
        return;
      }

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error checking duplicates:", error);
    }
  };


  const handleSubmit = () => {
    navigate("/admin/employeeprofile", { state: { employee: formValues } });
    setIsSuccessModalOpen(false);
  };

  const handleClose = () => {
    setIsSuccessModalOpen(false);
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <div className="ti-background-clr">
        <div className="sprAdmin-createAdmin mt-4">
          <form>
            <div className="sprAdmin-createAdmin-body border border-1 border-dark rounded p-4">
              {/* create admin user form */}
              <p className="sprAdmin-createAdmin-title">Create Employee</p>

              <div className="row sprAdmin-createAdmin-form">
                {/* col-5 under the row */}
                <div className="col-md-5">

                  <div className="mb-3">
                    <label htmlFor="employeeId" className="form-label">
                      Employee Id<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={50} // Restrict input length to 50 characters
                      name="employeeId"
                      className={`form-control ${formErrors.employeeId || validationErrors.employeeId ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      value={formValues.employeeId}
                      onChange={(e) => {
                        const trimmedValue = e.target.value.trim(); // Prevent leading whitespace
                        handleChange({
                          target: {
                            name: "employeeId",
                            value: trimmedValue,
                          },
                        });
                      }}
                      onBlur={handleBlur} // ✅ Added handleBlur
                    />

                    {(formErrors.employeeId || validationErrors.employeeId) && (
                      <div className="invalid-feedback">
                        {formErrors.employeeId || validationErrors.employeeId}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={50} // Restrict input length to 50 characters
                      name="firstName"
                      className={`form-control ${formErrors.firstName || validationErrors.firstName ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      value={formValues.firstName}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // Allow only letters and spaces
                        handleChange({ target: { name: "firstName", value } }); // Update state
                      }}
                      onBlur={handleBlur} // ✅ Added handleBlur
                    />

                    {(formErrors.firstName || validationErrors.firstName) && (
                      <div className="invalid-feedback">
                        {formErrors.firstName || validationErrors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={50} // Restricts input length to 50 characters
                      name="lastName"
                      className={`form-control ${formErrors.lastName || validationErrors.lastName ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      value={formValues.lastName}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // Allow only letters and spaces
                        handleChange({ target: { name: "lastName", value } }); // Update state
                      }}
                      onBlur={handleBlur}
                    />

                    {(formErrors.lastName || validationErrors.lastName) && (
                      <div className="invalid-feedback">
                        {formErrors.lastName || validationErrors.lastName}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <textarea
                      name="address"
                      // maxLength={100}
                      className={`form-control ${formErrors.address ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      value={formValues.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {formErrors.address && (
                      <div className="invalid-feedback">{formErrors.address}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailId" className="form-label">
                      Email Id<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="email"
                      maxLength={100}
                      name="emailId"
                      className={`form-control ${formErrors.emailId || validationErrors.emailId
                        ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      value={formValues.emailId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {(formErrors.emailId || validationErrors.emailId) && (
                      <div className="invalid-feedback">
                        {formErrors.emailId || validationErrors.emailId}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mobileNumber" className="form-label">
                      Mobile Number<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      name="mobileNumber"
                      className={`form-control ${formErrors.mobileNumber || validationErrors.mobileNumber
                        ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      value={formValues.mobileNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (value.length <= 10) {
                          handleChange({ target: { name: "mobileNumber", value } }); // Update state only if length <= 10
                        }
                      }}
                      maxLength={10} // Prevents more than 10 characters from being typed
                      onBlur={handleBlur}
                    />

                    {(formErrors.mobileNumber ||
                      validationErrors.mobileNumber) && (
                        <div className="invalid-feedback">
                          {formErrors.mobileNumber || validationErrors.mobileNumber}
                        </div>
                      )}
                  </div>
                </div>
                {/* Skip the next 1 columns */}
                <div className="col-1 offset-1">
                  {/* This column is offset by 1 columns  */}
                </div>
                {/* col-5 under the row */}
                <div className="col-md-5">
                  <div className="mb-3">
                    <label htmlFor="aadharNumber" className="form-label">
                      Aadhar Number<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={12} // Restricts the maximum length to 12 characters
                      name="aadharNumber"
                      className={`form-control ${formErrors.aadharNumber || validationErrors.aadharNumber ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      value={formValues.aadharNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (value.length <= 12) {
                          handleChange({ target: { name: "aadharNumber", value } }); // Update state only if length <= 12
                        }
                      }}
                      onBlur={handleBlur}
                    />

                    {(formErrors.aadharNumber ||
                      validationErrors.aadharNumber) && (
                        <div className="invalid-feedback">
                          {formErrors.aadharNumber || validationErrors.aadharNumber}
                        </div>
                      )}
                  </div>
                  {/* // JSX component (e.g. inside your render or return statement) */}
                  <div className="mb-3">
                    <label htmlFor="panNumber" className="form-label">
                      Pan Number<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      className={`form-control ${formErrors.panNumber || validationErrors.panNumber ? "sprAdmin-createAdmin-input-br-error" : ""}`}
                      name="panNumber"
                      id="panNumber"
                      onChange={(e) => {
                        const upperCaseValue = e.target.value.toUpperCase();
                        handleChange({
                          target: {
                            name: "panNumber",
                            value: upperCaseValue,
                          },
                        });
                      }}
                      onBlur={handleBlur}
                      value={formValues.panNumber}
                    />
                    {(formErrors.panNumber || validationErrors.panNumber) && (
                      <div className="invalid-feedback">
                        {formErrors.panNumber || validationErrors.panNumber}
                      </div>
                    )}
                  </div>


                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        minLength={8}
                        className={`form-control ${formErrors.password || validationErrors.password ? "sprAdmin-createAdmin-input-br-error" : ""}`}
                        name="password"
                        id="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={formValues.password}
                        style={{ paddingRight: "2rem" }}
                      />

                      <i
                        className={`bi ${!showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} text-primary`}
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
                    {(formErrors.password || validationErrors.password) && (
                      <div className="invalid-feedback">
                        {formErrors.password || validationErrors.password}
                      </div>
                    )}

                  </div>
                </div>
              </div>
              {/* buttons for save & reset form */}
              <div className="ti-common-buttons d-flex flex-wrap justify-content-end my-3 mx-5">
                <button
                  type="submit"
                  onClick={handleSave}
                  className="btn btn-success "
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* modal for form submission failed */}
        <Modal show={isSuccessModalOpen} onHide={handleClose}>
          <Modal.Body>Do you want to save?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default AddEmployeeData;
