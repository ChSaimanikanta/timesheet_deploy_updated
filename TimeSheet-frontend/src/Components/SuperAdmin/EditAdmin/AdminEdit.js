import { Container, Navbar } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import chiselonLogo from "../../Image/logochiselon.png";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { basicSchema } from "../CreateAdmin/ValidationSchema";
import "./AdminEdit.css";
import url from "../../Api/data";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { adminDetailsEdit } from "../../features/adminDetails";
import { editSuccessModal } from "../../features/modal";
import { admins_Url, serverUrl } from "../../APIs/Base_UrL";

function AdminEdit() {
  // editable id from searchadmin page
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // setting error message if user email already exit
  const [userAlreadyExit, setUserAlreadyExit] = useState("");

  const [adminIdError,setAdminIdError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [aadharError, setAadharError] = useState("");
  const [panError, setPanError] = useState("");
  // admin list exclude current edit admin
  const [adminDatas, setAdminDatas] = useState([]);
  // for edit confirmation modal
  const [confirmationForEdit, setConfirmationForEdit] = useState(false);
  // edit admin datas
  const [editAdminData, setEditAdminData] = useState("");
  // date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);

  // fetch the edit admin data once come from the search page
  useEffect(() => {
    async function getDataFromApi() {
      try {
        const response = await axios.get(`${serverUrl}/admins/${id}`); // backend url fetch the admin
        setEditAdminData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getDataFromApi();
  }, [id]);

  // filtering data from api, exclude current admin data for form validation
  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/admins/getadmins`
        ); //backend url
        // Handle the response here if needed
        const datas = response.data;
        const filterData = datas.filter((data) => data.adminId !== id);
        setAdminDatas(filterData);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromApi();

    // Update the currentDateTime state every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formattedDateTime = currentDateTime.toLocaleDateString(
    undefined,
    options
  );
  // to get form input by formik
  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    errors,
    handleSubmit,
    touched,
    resetForm,
    setValues,
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
  console.log(errors);

   useEffect(() => {
    if (values.adminId && touched.adminId) {
      setAdminIdError(""); // Clear custom phone error when input changes
    }
  }, [values.adminId]);


  useEffect(() => {
    if (values.mobileNumber && touched.mobileNumber) {
      setPhoneError(""); // Clear custom phone error when input changes
    }
  }, [values.mobileNumber]);

  useEffect(() => {
    if (values.panNumber && touched.panNumber) {
      setPanError(""); // Clear custom phone error when input changes
    }
  }, [values.panNumber]);

  useEffect(() => {
    if (values.aadharNumber && touched.aadharNumber) {
      setAadharError(""); // Clear custom phone error when input changes
    }
  }, [values.aadharNumber]);

  useEffect(() => {
    if (values.emailId && touched.emailId) {
      setUserAlreadyExit(""); // Clear custom phone error when input changes
    }
  }, [values.emailId]);

  // set the value into edit form field
  // Assuming that editAdminData contains the data retrieved from the backend
  useEffect(() => {
    if (editAdminData) {
      // Set the parsed objects as initial values
      setValues({
        ...editAdminData,
      });
    }
  }, [editAdminData, setValues]);

  // trigger the confirmation popup
  function onSubmit() {
    setConfirmationForEdit(true);
  }

  // cancel the edit changes
  function editCancelConfirmation() {
    setConfirmationForEdit(false);
  }

  // save the edit changes
  async function editSaveConfirmation() {
    setConfirmationForEdit(false);

    let formHasErrors = false;

 // Checking if the admin ID is already in use
    const adminIdExists = adminDatas.some(
      (admin) => admin.adminId === values.adminId
    );
    if (adminIdExists) {
      setAdminIdError("Admin ID already in use");
      formHasErrors = true;
    }

    // Checking if the email is already in use
    const emailExists = adminDatas.some(
      (admin) => admin.emailId === values.emailId
    );
    if (emailExists) {
      setUserAlreadyExit("Email already in use");
      formHasErrors = true;
    }

    // Checking if the phone number is already in use
    const phoneExists = adminDatas.some(
      (admin) => admin.mobileNumber === values.mobileNumber
    );
    if (phoneExists) {
      // Assuming you have a state setter for phone error
      setPhoneError("Phone number already in use");
      formHasErrors = true;
    }

    // Checking if the Aadhar number is already in use
    const aadharExists = adminDatas.some(
      (admin) => admin.aadharNumber === values.aadharNumber
    );
    if (aadharExists) {
      // Assuming you have a state setter for Aadhar error
      setAadharError("Aadhar number already in use");
      formHasErrors = true;
    }

    // Checking if the PAN number is already in use
    const panExists = adminDatas.some(
      (admin) => admin.panNumber === values.panNumber
    );
    if (panExists) {
      // Assuming you have a state setter for PAN error
      setPanError("PAN number already in use");
      formHasErrors = true;
    }

    if (formHasErrors) {
      return; // Stop the form submission if there are errors
    }

    // // Convert boolean values to string for API compatibility
    // values.employeeAccess = JSON.stringify(values.employeeAccess);
    // values.projectAccess = JSON.stringify(values.projectAccess);

    try {
      await axios.put(`${serverUrl}/admins/${id}`, values); //update admin backend url

      dispatch(adminDetailsEdit(true));
      dispatch(editSuccessModal(true));
      navigate(`/superadmin/searchAdmin/adminDetailsView/${values.adminId}`);
    } catch (error) {
      console.log("while submitting edit form", error);
    }
  }

  // reset the form
  const handleCancel = () => {
    resetForm();
    navigate(`/superadmin/searchAdmin/adminDetailsView/${values.adminId}`);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <section>
        <div className="ti-background-clr">
          <div className="ti-data-field-container">
            <div className="sprAdmin-editAdmin-title pt-3">
              <p className="sprAdmin-createAdmin-title" style={{ color: 'white' }}>Edit Admin Profile</p>
            </div>
            <div className="sprAdmin-editAdmin-body">
              {/* edit form */}
              <form onSubmit={handleSubmit}>
                <div className=" bg-white border border-1 border-dark rounded p-4">
                  <div className="row sprAdmin-editAdmin-form ">
                    {/* col-5 under the row */}
                    <div className="col-md-5">
                      <div className="mb-3">
                        <label htmlFor="adminId" className="form-label">
                          Admin Id<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="adminId"
                          id="adminId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.adminId}
                        ></input>
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
                          maxLength={50}
                          className={`form-control  ${errors.firstName && touched.firstName
                            ? "sprAdmin-createAdmin-input-br-error"
                            : ""
                            }`}
                          name="firstName"
                          id="firstName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                        ></input>
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
                          maxLength={50}
                          className={`form-control  ${errors.lastName && touched.lastName
                            ? "sprAdmin-createAdmin-input-br-error"
                            : ""
                            }`}
                          name="lastName"
                          id="lastName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                        ></input>
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
                        <label htmlFor="email" className="form-label">
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
                          id="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.emailId}
                        ></input>
                        {errors.emailId && touched.emailId && (
                          <p className="error-message small mt-1">
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
                        <label htmlFor="phone" className="form-label">
                          Phone Number<span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          className={`form-control  ${errors.mobileNumber && touched.mobileNumber
                            ? "sprAdmin-createAdmin-input-br-error"
                            : ""
                            }`}
                          name="mobileNumber"
                          id="phone"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.mobileNumber}
                        ></input>
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
                          maxLength={12}
                          className={`form-control  ${errors.aadharNumber && touched.aadharNumber
                            ? "sprAdmin-createAdmin-input-br-error"
                            : ""
                            }`}
                          name="aadharNumber"
                          id="aadharNumber"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.aadharNumber}
                        ></input>
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
                          className={`form-control  ${errors.panNumber && touched.panNumber
                            ? "sprAdmin-createAdmin-input-br-error"
                            : ""
                            }`}
                          name="panNumber"
                          id="panNumber"
                          onChange={(e) => {
                            const upperCaseValue = e.target.value.toUpperCase(); // Convert to uppercase
                            handleChange({
                              target: {
                                name: "panNumber",
                                value: upperCaseValue, // Pass the uppercase value to formik
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
                        <div className="checkbox-container">
                          <label htmlFor="checkBoxGroupTitle d-block">
                            Access Permission for Employee details{" "}
                          </label>
                          <div className="form-check">
                            <input
                              className=" sprAdmin-createAdmin-checkbox-create form-check-input "
                              name="canCreateEmployee"
                              type="checkbox"
                              id="empcreate"
                              checked={values.canCreateEmployee}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            ></input>
                            <label
                              className="form-check-label"
                              htmlFor="empcreate"
                            >
                              Create
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input sprAdmin-createAdmin-checkbox-edit"
                              name="canEditEmployee"
                              type="checkbox"
                              id="empedit"
                              checked={values.canEditEmployee}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            ></input>
                            <label
                              className="form-check-label"
                              htmlFor="empedit"
                            >
                              Edit
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input sprAdmin-createAdmin-checkbox-delete"
                              name="canDeleteEmployee"
                              type="checkbox"
                              id="empdelete"
                              checked={values.canDeleteEmployee}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            ></input>
                            <label
                              className="form-check-label"
                              htmlFor="empdelete"
                            >
                              Delete
                            </label>
                          </div>
                        </div>
                        <div className="checkbox-container">
                          <label htmlFor="checkBoxGroupTitle d-block">
                            Access Permission for Project details{" "}
                          </label>
                          <div className="form-check ">
                            <input
                              className=" sprAdmin-createAdmin-checkbox-create form-check-input"
                              name="canCreateProject"
                              type="checkbox"
                              id="pjcreate"
                              checked={values.canCreateProject}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            ></input>
                            <label
                              className="form-check-label"
                              htmlFor="pjcreate"
                            >
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
                            <label
                              className="form-check-label"
                              htmlFor="pjedit"
                            >
                              Edit
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input sprAdmin-createAdmin-checkbox-delete"
                              name="canDeleteProject"
                              type="checkbox"
                              id="pjdelete"
                              checked={values.canDeleteProject}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            ></input>
                            <label
                              className="form-check-label"
                              htmlFor="pjdelete"
                            >
                              Delete
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ti-common-buttons d-flex flex-wrap justify-content-end my-2 mx-5">
                    <button type="submit" className="btn btn-success ">
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
          </div>
        </div>
        {/* Modal for Edit confirming save or cancel */}
        <Modal
          show={confirmationForEdit}
          onHide={() => setConfirmationForEdit(false)}
        >
          <Modal.Body>Do you want to save the changes?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={editCancelConfirmation}>
              Cancel
            </Button>
            <Button variant="primary" onClick={editSaveConfirmation}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
}

export default AdminEdit;
