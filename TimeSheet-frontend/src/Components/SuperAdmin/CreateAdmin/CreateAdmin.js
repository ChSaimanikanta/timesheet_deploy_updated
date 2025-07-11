import { useFormik } from "formik";
import "./CreateAdmin.css";
import { basicSchema } from "./ValidationSchema";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import url from "../../Api/data";
import { useSelector } from "react-redux";
import {
  successModal,
  failureModal,
  deleteSuccessModal,
} from "../../features/modal";
import { useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import failedCheck from "../../Image/failed.png";
import successCheck from "../../Image/checked.png";
import SuperAdminNav from "../Navbar/SuperAdminNav";
import { admins_Url, serverUrl } from "../../APIs/Base_UrL";
function CreateAdmin() {
  // for navigation
  let navigate = useNavigate();
  const [adminDatas, setAdminDatas] = useState([]);
  const [userAlreadyExit, setUserAlreadyExit] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [panError, setPanError] = useState("");
  const [adminIdError, setAdminIdError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [createAdminError, setCreateAdminError] = useState("");
  // redux state
  const modal = useSelector((state) => state.modal.value);
  const showFailureModal = modal.failureModal;

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await axios.get(`${serverUrl}/admins/getadmins`);
        // Handle the response here if needed
        setAdminDatas(response.data);
        console.log(response.data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromApi();
  }, []);
  // formik for form value

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    errors,
    handleSubmit,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      adminId: "",
      firstName: "",
      lastName: "",
      address: "",
      mobileNumber: "",
      emailId: "",
      aadharNumber: "",
      panNumber: "",
      password: "",
      canCreateEmployee: false,
      canEditEmployee: false,
      canDeleteEmployee: false,
      canCreateProject: false,
      canEditProject: false,
      canDeleteProject: false,
    },
    validationSchema: basicSchema,
    onSubmit,
  });

  // Function for api call after form submission
  async function onSubmit(values, actions) {
    let formHasErrors = false;


    // Checking if the admin ID is already in use
    const adminIdExists = adminDatas.some(
      (admin) => admin.adminId === values.adminId
    );
    if (adminIdExists) {
      actions.setFieldError("adminId", "Admin ID already in use");
      formHasErrors = true;
    }


    // Checking if the email is already in use
    const emailExists = adminDatas.some(
      (admin) => admin.emailId === values.emailId
    );
    if (emailExists) {
      actions.setFieldError("emailId", "Email already in use"); // Set custom error using Formik's setFieldError
      formHasErrors = true;
    }

    // Checking if the phone number is already in use
    const phoneExists = adminDatas.some(
      (admin) => admin.mobileNumber == values.mobileNumber
    );
    if (phoneExists) {
      actions.setFieldError("mobileNumber", "Mobile number already in use"); // Set custom error using Formik's setFieldError
      formHasErrors = true;
    }

    // Checking if the Aadhar number is already in use
    const aadharExists = adminDatas.some(
      (admin) => admin.aadharNumber == values.aadharNumber
    );
    if (aadharExists) {
      actions.setFieldError("aadharNumber", "Aadhar number already in use"); // Set custom error using Formik's setFieldError
      formHasErrors = true;
    }

    // Checking if the PAN number is already in use
    const panExists = adminDatas.some(
      (admin) => admin.panNumber === values.panNumber
    );
    if (panExists) {
      actions.setFieldError("panNumber", "PAN number already in use"); // Set custom error using Formik's setFieldError
      formHasErrors = true;
    }

    if (formHasErrors) {
      return; // Stop the form submission if there are errors
    }

    try {
      const response = await axios.post(
        `${serverUrl}/admins/saveadmin`,
        values
      );
      if (response.data) {
        dispatch(successModal(true));
        actions.resetForm();
        navigate("/superadmin/searchadmin");
        console.log(response.data);
      }
    } catch (error) {
      setCreateAdminError(error.message);
      dispatch(failureModal(true));
    }
  }

  // Reset function for form fields
  const handleCancel = () => {
    navigate("/superadmin");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <div className="ti-background-clr">
        <div className="sprAdmin-createAdmin mt-4">
          <form onSubmit={handleSubmit}>
            <div className="sprAdmin-createAdmin-body border border-1 border-dark rounded p-4">
              {/* create admin user form */}
              <p className="sprAdmin-createAdmin-title">Create Admin</p>

              <div className="row sprAdmin-createAdmin-form">
                {/* col-5 under the row */}
                <div className="col-md-5">
                  <div className="mb-3">
                    <label htmlFor="adminId" className="form-label">
                      Admin ID<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={50} // Limit to 50 characters
                      className={`form-control ${errors.adminId && touched.adminId
                        ? "sprAdmin-createAdmin-input-br-error"
                        : ""
                        }`}
                      name="adminId"
                      id="adminId"
                      onChange={(e) => {
                        const trimmedValue = e.target.value.trim(); // Prevent leading whitespace
                        handleChange({
                          target: {
                            name: "adminId",
                            value: trimmedValue,
                          },
                        });
                      }}
                      onBlur={handleBlur}
                      value={values.adminId}
                    />

                    {errors.adminId && touched.adminId && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.adminId}
                      </p>
                    )}
                    {adminIdError && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {adminIdError}
                      </p>
                    )}
                  </div>


                  <div className="mb-3">

                    <label htmlFor="firstName" className="form-label">
                      First Name<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={50} // Restrict input to 50 characters
                      className={`form-control ${errors.firstName && touched.firstName ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      name="firstName"
                      id="firstName"
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // Allow only letters and spaces
                        handleChange({ target: { name: "firstName", value } }); // Update state
                      }}
                      onBlur={handleBlur}
                      value={values.firstName}
                    />

                    {errors.firstName && touched.firstName && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={50} // Restrict input to 50 characters
                      className={`form-control ${errors.lastName && touched.lastName ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      name="lastName"
                      id="lastName"
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // Allow only letters and spaces
                        handleChange({ target: { name: "lastName", value } }); // Update state
                      }}
                      onBlur={handleBlur}
                      value={values.lastName}
                    />

                    {errors.lastName && touched.lastName && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <textarea

                      className={`form-control sprAdmin-createAdmin-address  ${errors.address && touched.address
                        ? "sprAdmin-createAdmin-input-br-error"
                        : ""
                        }`}
                      name="address"
                      id="address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address}
                    ></textarea>
                    {errors.address && touched.address && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailId" className="form-label">
                      Email Id<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="email"
                      maxLength={100}
                      className={`form-control  ${errors.emailId && touched.emailId
                        ? "sprAdmin-createAdmin-input-br-error"
                        : ""
                        }`}
                      name="emailId"
                      id="emailId"
                      onChange={(e) => {
                        const trimmedEmail = e.target.value.trim(); // Remove leading and trailing whitespace
                        handleChange({
                          target: {
                            name: "emailId",
                            value: trimmedEmail,
                          },
                        });
                      }}

                      onBlur={handleBlur}
                      value={values.emailId}
                    ></input>
                    {errors.emailId && touched.emailId && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.emailId}
                      </p>
                    )}
                    {userAlreadyExit && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {userAlreadyExit}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mobileNumber" className="form-label">
                      Mobile Number<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      name="mobileNumber"
                      className={`form-control ${errors.mobileNumber && touched.mobileNumber ? "sprAdmin-createAdmin-input-br-error" : "sprAdmin-createAdmin-input-br-valid"
                        }`}
                      value={values.mobileNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        value = value.slice(0, 10); // Ensure max 10 digits
                        handleChange({ target: { name: "mobileNumber", value } }); // Update state
                      }}
                      maxLength={10} // Restrict input to 10 characters
                      onBlur={handleBlur}
                    />
                    {errors.mobileNumber && touched.mobileNumber && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.mobileNumber}
                      </p>
                    )}
                    {phoneError && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {phoneError}
                      </p>
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
                      maxLength={12} // Restrict input length to 12 characters
                      className={`form-control ${errors.aadharNumber && touched.aadharNumber ? "sprAdmin-createAdmin-input-br-error" : ""
                        }`}
                      name="aadharNumber"
                      id="aadharNumber"
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove all non-numeric characters
                        value = value.slice(0, 12); // Ensure the input doesn't exceed 12 digits
                        handleChange({ target: { name: "aadharNumber", value } }); // Update the state
                      }}
                      onBlur={handleBlur}
                      value={values.aadharNumber}
                    />

                    {errors.aadharNumber && touched.aadharNumber && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.aadharNumber}
                      </p>
                    )}
                    {aadharError && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {aadharError}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="panNumber" className="form-label">
                      Pan Number<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      className={`form-control ${errors.panNumber && touched.panNumber
                        ? "sprAdmin-createAdmin-input-br-error"
                        : ""
                        }`}
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
                      value={values.panNumber}
                    ></input>
                    {errors.panNumber && touched.panNumber && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.panNumber}
                      </p>
                    )}
                    {panError && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {panError}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <div className=
                      "position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        minLength={8}
                        className={`form-control ${errors.password && touched.password
                          ? "sprAdmin-createAdmin-input-br-error"
                          : ""
                          }`}
                        name="password"
                        id="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        style={{ paddingRight: "2rem" }}
                      />
                      <i
                        className={`bi ${!showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          } text-primary`}
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
                    {errors.password && touched.password && (
                      <p className="sprAdmin-createAdmin-error-message small mt-1">
                        {errors.password}
                      </p>
                    )}

                  </div>

                  {/* checkboxes */}
                  <div className="form-group">
                    {/* checkbox for employee access */}
                    <div>
                      <label htmlFor="checkBoxGroupTitle d-block">
                        Access Permission for Employee details{" "}
                      </label>
                      <div className="form-check ">
                        <input
                          className="form-check-input sprAdmin-createAdmin-checkbox-create"
                          name="canCreateEmployee"
                          type="checkbox"
                          id="empcreate"
                          checked={values.canCreateEmployee}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></input>
                        <label className="form-check-label" htmlFor="empcreate">
                          Create
                        </label>
                      </div>
                      <div className="form-check ">
                        <input
                          className="form-check-input sprAdmin-createAdmin-checkbox-edit"
                          name="canEditEmployee"
                          type="checkbox"
                          id="empedit"
                          checked={values.canEditEmployee}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></input>
                        <label className="form-check-label" htmlFor="empedit">
                          Edit
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input sprAdmin-createAdmin-checkbox-delete"
                          name="canDeleteEmployee"
                          type="checkbox"
                          id="empdelete"
                          checked={values.canDeleteEmployee}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></input>
                        <label className="form-check-label" htmlFor="empdelete">
                          Delete
                        </label>
                      </div>
                    </div>
                    {/* checkbox for project access */}
                    <div className="mt-4">
                      <label htmlFor="checkBoxGroupTitle d-block">
                        Access Permission for Project details{" "}
                      </label>
                      <div className="form-check ">
                        <input
                          className="form-check-input sprAdmin-createAdmin-checkbox-create"
                          name="canCreateProject"
                          type="checkbox"
                          id="pjcreate"
                          checked={values.canCreateProject}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></input>
                        <label className="form-check-label" htmlFor="pjcreate">
                          Create
                        </label>
                      </div>
                      <div className="form-check ">
                        <input
                          className="form-check-input sprAdmin-createAdmin-checkbox-edit"
                          name="canEditProject"
                          type="checkbox"
                          id="pjedit"
                          checked={values.canEditProject}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></input>
                        <label className="form-check-label" htmlFor="pjedit">
                          Edit
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input sprAdmin-createAdmin-checkbox-delete"
                          name="canDeleteProject"
                          type="checkbox"
                          id="pjdelete"
                          checked={values.canDeleteProject}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        ></input>
                        <label className="form-check-label" htmlFor="pjdelete">
                          Delete
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* buttons for save & reset form */}
              <div className="ti-common-buttons d-flex flex-wrap justify-content-end my-3 mx-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
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
        <Modal
          className="custom-modal"
          style={{ left: "50%", transform: "translateX(-50%)" }}
          dialogClassName="modal-dialog-centered"
          show={showFailureModal}
        >
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img
              src={failedCheck}
              className="img-fluid mb-4"
              alt="failedCheck"
            />
            <p className="mb-4 text-center">{createAdminError}</p>
            <button
              className="btn  w-100 text-white"
              onClick={() => {
                dispatch(failureModal(false));
              }}
              style={{ backgroundColor: "#F44336" }}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default CreateAdmin;
