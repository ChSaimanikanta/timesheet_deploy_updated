import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddLeaveRequest.css";
import { schemaLeave } from "./LeaveSchema";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import { leaveSubmitON } from "../../features/empLeaveSubmit";
import { useSelector, useDispatch } from "react-redux";
import { serverUrl } from "../../APIs/Base_UrL";

export function AdminAddLeaveRequest() {
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue.adminId;

  const [leaveSuccessModal, setLeaveSuccessModal] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [approvedLeaveCount, setApprovedLeaveCount] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(18);
  const [pendingLeaves, setPendingLeaves] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ------------------------------------------------------------
  // 🚫 2026 Hyderabad Holiday List (Skip these in leave calculation)
  const holidays2026 = [
    "2026-01-14","2026-01-26","2026-03-19","2026-03-20","2026-03-27",
    "2026-05-01","2026-05-27","2026-06-02","2026-08-10","2026-08-15",
    "2026-09-14","2026-10-02","2026-10-20","2026-12-25"
  ];
  // ------------------------------------------------------------

  const calculatePendingLeaves = () => {
    const count = totalLeaves - approvedLeaveCount;
    setPendingLeaves(count);
  };

  const calculateApprovedLeave = async () => {
    try {
      const response = await axios.get(`${serverUrl}/admin/leave-requests`);
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
    calculatePendingLeaves();
  }, [approvedLeaveCount, totalLeaves]);

  const formik = useFormik({
    initialValues: {
      adminId,
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

        if (requestedDays > pendingLeaves) {
          alert(
            `❌ You cannot request ${requestedDays} days. Only ${pendingLeaves} days are available.`
          );
          return;
        }

        if (requestedDays === 0) {
          alert("❌ Leave cannot be applied only on holidays or Sundays.");
          return;
        }

        const leaveData = await axios.post(
          `${serverUrl}/admin/leave-requests`,
          values
        );

        if (leaveData.data) {
          setLeaveSuccessModal(true);
          setTotalLeaves((prev) => prev - requestedDays);
          localStorage.setItem(`leaveObjectId${adminId}`, leaveData.data.id);
          dispatch(leaveSubmitON(true));
          formik.resetForm();
        }
      } catch (error) {
        console.error("Error submitting leave request:", error);
      }
    },
  });

  // ⭐ EXCLUDE Sundays + Holidays in count
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const start = new Date(formik.values.startDate);
      const end = new Date(formik.values.endDate);

      let days = 0;
      let current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];

        if (current.getDay() !== 0 && !holidays2026.includes(dateStr)) {
          days++;
        }

        current.setDate(current.getDate() + 1);
      }

      setNumberOfDays(days);
      formik.setFieldValue("noOfDays", days);
    }
  }, [formik.values.startDate, formik.values.endDate]);

  return (
    <>
      <div className="ti-background-clr">
        <h5 className="text-center pt-4" style={{ color: "white" }}>
          ADMIN ADD LEAVE REQUEST
        </h5>

        <div className="ti-leave-management-container">
          <h5 style={{ color: "white" }}>
            AVAILABLE LEAVES: {pendingLeaves}
          </h5>

          <div className="bg-white p-4">
            <form onSubmit={formik.handleSubmit}>
              {/* Admin ID */}
              <div className="my-3 leave-row">
                <label>Admin ID<span style={{ color: "red" }}>*</span>:</label>
                <input type="text" value={adminId} readOnly className="form-input" />
              </div>

              {/* Start Date */}
              <div className="my-3 leave-row">
                <label>Start Date<span style={{ color: "red" }}>*</span>:</label>
                <DatePicker
                  selected={formik.values.startDate ? new Date(formik.values.startDate) : null}
                  onChange={(date) => formik.setFieldValue("startDate", date ? date.toISOString().slice(0, 10) : "")}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="w-100"
                />
              </div>

              {/* End Date */}
              <div className="my-3 leave-row">
                <label>End Date<span style={{ color: "red" }}>*</span>:</label>
                <DatePicker
                  selected={formik.values.endDate ? new Date(formik.values.endDate) : null}
                  onChange={(date) => formik.setFieldValue("endDate", date ? date.toISOString().slice(0, 10) : "")}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="w-100"
                />
              </div>

              {/* Days */}
              <div className="my-3 leave-row">
                <label>No Of Days:</label>
                <input type="text" readOnly className="w-25" value={formik.values.noOfDays} />
              </div>

              {/* Reason */}
              <div className="my-3 leave-row">
                <label>Reason*</label>
                <select name="reason" onChange={formik.handleChange} value={formik.values.reason}>
                  <option value="">Select</option>
                  <option value="sick-leave">Sick Leave</option>
                  <option value="earned-leave">Earned Leave</option>
                  <option value="casual-leave">Casual Leave</option>
                  <option value="others-leave">Others</option>
                </select>
              </div>

              {/* Comments */}
              <div className="my-3 leave-row">
                <label>Comments*</label>
                <textarea name="comments" onChange={formik.handleChange} value={formik.values.comments} />
              </div>

              {/* Buttons */}
              <div className="my-5 text-end">
                <button type="submit" className="btn btn-success mx-2"
                    disabled={!pendingLeaves || !formik.values.startDate || !formik.values.endDate}>
                  Submit
                </button>
                <button type="button" className="btn btn-secondary mx-2" onClick={() => navigate("/admin")}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* SUCCESS MODAL */}
          <Modal show={leaveSuccessModal} centered>
            <div className="p-4 text-center">
              <img src={successCheck} alt="" className="w-25 mb-4"/>
              <p>Your Leave Request Submitted Successfully</p>
              <button className="btn btn-success w-100"
                onClick={() => { setLeaveSuccessModal(false); navigate("/admin"); }}>
                Close
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}
