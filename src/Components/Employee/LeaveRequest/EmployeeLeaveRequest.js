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
import { serverUrl } from "../../APIs/Base_UrL";

export function EmployeeLeaveRequest() {
  const employeeValue = useSelector((state) => state.employeeLogin.value);
  const employeeId = employeeValue.employeeId;

  const [leaveSuccessModal, setLeaveSuccessModal] = useState(false);
  const [approvedLeaveCount, setApprovedLeaveCount] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(18);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🚫 2026 Hyderabad Holidays (not counted in leave)
  const holidays2026 = [
    "2026-01-14","2026-01-26","2026-03-19","2026-03-20","2026-03-27",
    "2026-05-01","2026-05-27","2026-06-02","2026-08-10","2026-08-15",
    "2026-09-14","2026-10-02","2026-10-20","2026-11-08","2026-12-25"
  ];

  // Function to calculate remaining leaves
  const calculatePendingLeaves = () => {
    const count = totalLeaves - approvedLeaveCount;
    setPendingLeaves(count);
  };

  // Fetch approved leaves for this employee for current year
  const calculateApprovedLeave = async () => {
    try {
      const response = await axios.get(`${serverUrl}/leaverequests/employee/${employeeId}`);
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

  useEffect(() => { calculateApprovedLeave(); }, []);
  useEffect(() => { calculatePendingLeaves(); }, [approvedLeaveCount, totalLeaves]);

  // FORM HANDLING
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
        const requestedDays = values.noOfDays;

        if (requestedDays === 0) {
          setErrorMessage("❌ You cannot apply leave only on holidays or Sundays.");
          setShowErrorModal(true);
          return;
        }

        if (requestedDays > pendingLeaves) {
          setErrorMessage(`❌ You requested ${requestedDays} days, but only ${pendingLeaves} are available.`);
          setShowErrorModal(true);
          return;
        }

        const response = await axios.post(`${serverUrl}/leaverequests`, values);

        if (response.data?.error) {
          setErrorMessage(response.data.error);
          setShowErrorModal(true);
          return;
        }

        setLeaveSuccessModal(true);
        setTotalLeaves((prev) => prev - requestedDays);
        localStorage.setItem(`leaveObjectId${employeeId}`, response.data.id);
        dispatch(leaveSubmitON(true));
        formik.resetForm();

      } catch (error) {
        const serverMessage = error.response?.data?.error || "Something went wrong. Please try again.";
        setErrorMessage(serverMessage);
        setShowErrorModal(true);
      }
    },
  });

  // 📅 Calculate number of leave days (skip Sundays + holidays)
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const start = new Date(formik.values.startDate);
      const end = new Date(formik.values.endDate);
      let days = 0;
      let current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().substring(0, 10);

        // Skip Sundays & Holidays
        if (current.getDay() !== 0 && !holidays2026.includes(dateStr)) {
          days++;
        }

        current.setDate(current.getDate() + 1);
      }

      formik.setFieldValue("noOfDays", days);
    }
  }, [formik.values.startDate, formik.values.endDate]);

  return (
    <>
      <div className="ti-background-clr">
        <h5 className="text-center pt-4" style={{ color: "white" }}>LEAVE REQUEST</h5>

        <div className="ti-leave-management-container">
          <h5 style={{ color: "white" }}>YOUR AVAILABLE LEAVES: {pendingLeaves}</h5>

          <div className="bg-white p-4">
            <form onSubmit={formik.handleSubmit}>
              
              {/* Start Date */}
              <div className="my-3 leave-row">
                <label>Start Date<span style={{ color: "red" }}>*</span>:</label>
                <DatePicker
                  selected={formik.values.startDate ? new Date(formik.values.startDate) : null}
                  onChange={(date) => formik.setFieldValue("startDate", date ? date.toISOString().substring(0, 10) : "")}
                  minDate={new Date()}
                  placeholderText="dd/mm/yyyy"
                  dateFormat="dd/MM/yyyy"
                  className="w-100"
                />
              </div>

              {/* End Date */}
              <div className="my-3 leave-row">
                <label>End Date<span style={{ color: "red" }}>*</span>:</label>
                <DatePicker
                  selected={formik.values.endDate ? new Date(formik.values.endDate) : null}
                  onChange={(date) => formik.setFieldValue("endDate", date ? date.toISOString().substring(0, 10) : "")}
                  minDate={formik.values.startDate ? new Date(formik.values.startDate) : new Date()}
                  placeholderText="dd/mm/yyyy"
                  dateFormat="dd/MM/yyyy"
                  className="w-100"
                />
              </div>

              {/* Number of Days */}
              <div className="my-3 leave-row">
                <label>No Of Days:</label>
                <input type="text" readOnly className="w-25" value={formik.values.noOfDays} />
              </div>

              {/* Reason */}
              <div className="my-3 leave-row">
                <label>Reason<span style={{ color: "red" }}>*</span>:</label>
                <select name="reason" value={formik.values.reason} onChange={formik.handleChange} required>
                  <option value="">Select</option>
                  <option value="sick-leave">Sick Leave</option>
                  <option value="earned-leave">Earned Leave</option>
                  <option value="casual-leave">Casual Leave</option>
                  <option value="others-leave">Others</option>
                </select>
              </div>

              {/* Comments */}
              <div className="my-3 leave-row">
                <label>Comments<span style={{ color: "red" }}>*</span>:</label>
                <textarea name="comments" value={formik.values.comments} onChange={formik.handleChange} required />
              </div>

              {/* Buttons */}
              <div className="my-5 text-end">
                <button type="submit" className="btn btn-success mx-2"
                  disabled={!pendingLeaves || !formik.values.startDate || !formik.values.endDate}>
                  Submit
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/employee")}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* MODALS */}
          <Modal show={leaveSuccessModal || showErrorModal} centered>
            <div className="p-4 text-center">
              {leaveSuccessModal && (
                <>
                  <img src={successCheck} alt="success" className="w-25 mb-4" />
                  <h6>Your Leave Request Submitted Successfully</h6>
                </>
              )}

              {showErrorModal && <h6 className="text-danger fw-bold">{errorMessage}</h6>}

              <button
                className="btn w-100 mt-3"
                style={{ backgroundColor: leaveSuccessModal ? "#5EAC24" : "#dc3545", color: "white" }}
                onClick={() => {
                  setLeaveSuccessModal(false);
                  setShowErrorModal(false);
                  if (leaveSuccessModal) navigate("/employee");
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
