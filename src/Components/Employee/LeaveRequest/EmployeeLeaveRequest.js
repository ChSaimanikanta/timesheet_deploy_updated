import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import { schemaLeave } from "./EmployeeLeaveSchema";
import { leaveSubmitON } from "../../features/empLeaveSubmit";
import "./EmployeeLeaveRequest.css";
import { leaveRequest_Url, serverUrl } from "../../APIs/Base_UrL";
import { getValidLeaveDays } from "../../../Utils/holidays";

export function EmployeeLeaveRequest() {
   const employeeValue = useSelector((state) => state.employeeLogin.value);
  const employeeId = employeeValue.employeeId;

  const [leaveSuccessModal, setLeaveSuccessModal] = useState(false);
  const [approvedLeaveCount, setApprovedLeaveCount] = useState(0);
  const [totalLeaves] = useState(18);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ---------------- FETCH APPROVED LEAVES ---------------- */
  const calculateApprovedLeave = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/leaverequests/employee/${employeeId}`
      );

      const currentYear = new Date().getFullYear();

      const approvedDays = response.data
        .filter(
          (leave) =>
            leave.status === "APPROVED" &&
            new Date(leave.startDate).getFullYear() === currentYear
        )
        .reduce((sum, leave) => sum + leave.noOfDays, 0);

      setApprovedLeaveCount(approvedDays);
    } catch (error) {
      console.error("Error fetching approved leaves:", error);
    }
  };

  useEffect(() => {
    calculateApprovedLeave();
  }, []);

  useEffect(() => {
    setPendingLeaves(totalLeaves - approvedLeaveCount);
  }, [approvedLeaveCount, totalLeaves]);

  /* ---------------- FORM ---------------- */
  const formik = useFormik({
    initialValues: {
      employeeId,
      startDate: "",
      endDate: "",
      noOfDays: 0,
      reason: "",
      comments: "",
    },
    validationSchema: schemaLeave,
    onSubmit: async (values) => {
      try {
        if (values.noOfDays === 0) {
          setErrorMessage(
            "❌ You cannot apply leave only on holidays or Sundays."
          );
          setShowErrorModal(true);
          return;
        }

        if (values.noOfDays > pendingLeaves) {
          setErrorMessage(
            `❌ You requested ${values.noOfDays} days, but only ${pendingLeaves} are available.`
          );
          setShowErrorModal(true);
          return;
        }

        await axios.post(`${serverUrl}/leaverequests`, values);

        setLeaveSuccessModal(true);
        dispatch(leaveSubmitON(true));
        formik.resetForm();
      } catch (error) {
        setErrorMessage(
          error.response?.data?.error ||
            "Something went wrong. Please try again."
        );
        setShowErrorModal(true);
      }
    },
  });

  /* ---------------- AUTO CALCULATE LEAVE DAYS ---------------- */
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const days = getValidLeaveDays(
        formik.values.startDate,
        formik.values.endDate
      );
      formik.setFieldValue("noOfDays", days);
    }
  }, [formik.values.startDate, formik.values.endDate]);
  
  return (
    <>
      <div className="ti-background-clr">
        <h5 className="text-center pt-4" style={{color:"white"}}>LEAVE REQUEST</h5>
        <div className="ti-leave-management-container">
          <h5 style={{color:"white"}}>YOUR AVAILABLE LEAVES: {pendingLeaves}</h5>
          <div className="bg-white">
            <div className="row">
              <div className="col">
                <div className="p-5 center-align">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="my-3 leave-row">
                      <label>
                        Start Date<span style={{ color: "red" }}>*</span> :
                      </label>
                      <div style={{ flex: 2 }}>
                        <DatePicker
                          selected={
                            formik.values.startDate
                              ? new Date(formik.values.startDate)
                              : null
                          }
                          onChange={(date) =>
                            formik.setFieldValue(
                              "startDate",
                              date
                                ? date.toLocaleDateString("en-CA")
                                : "" // Only update when a valid date is selected
                            )
                          }
                          minDate={new Date()}
                          placeholderText="dd/mm/yyyy"
                          dateFormat="dd/MM/yyyy"
                          className="w-100"
                        />
                        {formik.errors.startDate && (
                          <div className="error-message">
                            {formik.errors.startDate}
                          </div>
                        )}
                      </div>
                    </div>
  
                    <div className="my-3 leave-row">
                      <label>
                        End Date<span style={{ color: "red" }}>*</span> :
                      </label>
                      <div style={{ flex: 2 }}>
                        <DatePicker
                          selected={
                            formik.values.endDate
                              ? new Date(formik.values.endDate)
                              : null
                          }
                          onChange={(date) =>
                            formik.setFieldValue(
                              "endDate",
                              date
                                ? date.toLocaleDateString("en-CA")
                                : "" // Only update when a valid date is selected
                            )
                          }
                          minDate={new Date()}
                          placeholderText="dd/mm/yyyy"
                          dateFormat="dd/MM/yyyy"
                          className="w-100"
                        />
                        {formik.errors.endDate && (
                          <div className="error-message">
                            {formik.errors.endDate}
                          </div>
                        )}
                      </div>
                    </div>
  
                    <div className="my-3 leave-row">
                      <label>No Of Days:</label>
                      <input
                        type="text"
                        readOnly
                        className="w-25"
                        value={formik.values.noOfDays}
                      />
                    </div>
  
                    <div className="my-3 leave-row">
                      <label>
                        Reason<span style={{ color: "red" }}>*</span> :
                      </label>
                      <div style={{ flex: 2 }}>
                        <select
                          name="reason"
                          onChange={formik.handleChange}
                          value={formik.values.reason}
                          required
                        >
                          <option value="">Select</option>
                          <option value="sick-leave">Sick Leave</option>
                          <option value="earned-leave">Earned Leave</option>
                          <option value="casual-leave">Casual Leave</option>
                          {/* <option value="maternity-leave">Maternity Leave</option> */}
                          <option value="others-leave">Others</option>
                        </select>
                        {formik.errors.reason && (
                          <div className="error-message">
                            {formik.errors.reason}
                          </div>
                        )}
                      </div>
                    </div>
  
                    <div className="my-3 leave-row">
                      <label>
                       Comments  <span style={{ color: "red" }}>*</span>:
                      </label>
                      <div style={{ flex: 2 }}>
                        <textarea
                          name="comments"
                          onChange={formik.handleChange}
                          value={formik.values.comments}
                          required
                        />
                        {formik.errors.comments && (
                          <div className="error-message">
                            {formik.errors.comments}
                          </div>
                        )}
                      </div>
                    </div>
  
                    <div className="my-5 text-end">
                      <button
                        type="submit"
                        disabled={
                          !pendingLeaves ||
                          !formik.values.startDate ||
                          !formik.values.endDate
                        }
                        className="btn btn-success mx-2"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary mx-2"
                        onClick={() => navigate("/employee")}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
         <Modal
  className="custom-modal"
  style={{ left: "50%", transform: "translateX(-50%)" }}
  dialogClassName="modal-dialog-centered"
  show={leaveSuccessModal || showErrorModal}
  onHide={() => {
    setLeaveSuccessModal(false);
    setShowErrorModal(false);
  }}
>
  <div
    className={`d-flex flex-column p-4 align-items-center ${
      leaveSuccessModal ? "modal-success" : "modal-error"
    }`}
  >
    {leaveSuccessModal && (
      <>
        <img
          src={successCheck}
          className="img-fluid mb-4"
          alt="successCheck"
        />
        <p className="mb-4 text-center">
          Your Leave Request Submitted Successfully
        </p>
      </>
    )}

    {showErrorModal && (
      <p className="mb-4 text-center text-danger fw-bold">{errorMessage}</p>
    )}

    <button
      className="btn w-100 text-white"
      onClick={() => {
        setLeaveSuccessModal(false);
        setShowErrorModal(false);
        if (leaveSuccessModal) navigate("/employee");
      }}
      style={{
        backgroundColor: leaveSuccessModal ? "#5EAC24" : "#dc3545",
      }}
    >
      Close
    </button>
  </div>
</Modal>



        </div>
      </div>
    </>
  );
  
}