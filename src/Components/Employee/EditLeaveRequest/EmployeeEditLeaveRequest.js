import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { schemaLeave } from "./LeaveSchema";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl } from "../../APIs/Base_UrL";
import "./EmployeeEditLeaveRequest.css";

function EmployeeEditLeaveRequest() {
  const [lastLeaveRequestData, setLastLeaveRequestData] = useState({});
  const [editId, setEditId] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const employeeValue = useSelector((state) => state.employeeLogin.value);
  const employeeId = employeeValue.employeeId;

  // 🚫 2026 Hyderabad Holidays (not counted)
  const holidays2026 = [
    "2026-01-14","2026-01-26","2026-03-19","2026-03-20","2026-03-27",
    "2026-05-01","2026-05-27","2026-06-02","2026-08-10","2026-08-15",
    "2026-09-14","2026-10-02","2026-10-20","2026-11-08","2026-12-25"
  ];

  const formik = useFormik({
    initialValues: {
      employeeId: "",
      startDate: new Date(),
      endDate: new Date(),
      noOfDays: "",
      reason: "",
      status: "",
      comments: "",
    },
    validationSchema: schemaLeave,
    onSubmit: editLeaveRequest,
  });

  async function fetchLeaveData() {
    try {
      const response = await axios.get(`${serverUrl}/leaverequests/employee/${employeeId}`);
      const pendingItems = response.data.filter(item => item.status === "PENDING");

      if (pendingItems.length > 0) {
        const lastRequest = pendingItems[pendingItems.length - 1];

        setLastLeaveRequestData(lastRequest);
        setEditId(lastRequest.id);

        formik.setValues({
          employeeId: lastRequest.employeeId,
          startDate: new Date(lastRequest.startDate),
          endDate: new Date(lastRequest.endDate),
          noOfDays: lastRequest.noOfDays,
          reason: lastRequest.reason,
          status: lastRequest.status,
          comments: lastRequest.comments,
        });
      }
    } catch (error) {
      console.error("Error fetching leave request:", error);
    }
  }

  useEffect(() => { fetchLeaveData(); }, []);

  // 🎯 Exclude Sundays + Holidays
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const start = new Date(formik.values.startDate);
      const end = new Date(formik.values.endDate);
      let days = 0;
      let current = new Date(start);

      while (current <= end) {
        const dateStr = current.toISOString().substring(0, 10);

        if (current.getDay() !== 0 && !holidays2026.includes(dateStr)) {
          days++;
        }
        current.setDate(current.getDate() + 1);
      }

      // ❌ Block if only holidays selected
      if (days === 0) {
        setErrorMessage("❌ You cannot apply leave only on holidays or Sundays.");
        setErrorModal(true);
        formik.setFieldValue("noOfDays", 0);
        return;
      }

      formik.setFieldValue("noOfDays", days);
    }
  }, [formik.values.startDate, formik.values.endDate]);

  async function editLeaveRequest() {
    setConfirmationModal(false);

    if (formik.values.noOfDays === 0) {
      setErrorMessage("❌ Leave duration cannot be 0.");
      setErrorModal(true);
      return;
    }

    try {
      await axios.put(`${serverUrl}/leaverequests/${editId}`, formik.values);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error updating leave request:", error);
      setErrorMessage("❌ Failed to update leave request.");
      setErrorModal(true);
    }
  }

  return (
    <>
      <div className="container-fluid ti-background-clr px-3">
        {Object.keys(lastLeaveRequestData).length > 0 ? (
          <div className="ti-leave-management-container">
            <div className="bg-white p-5 m-5">
              <h5 className="text-center text-primary">EDIT LEAVE REQUEST</h5>

              <form onSubmit={formik.handleSubmit}>
                
                {/* Employee ID */}
                <div className="mb-3">
                  <label>Employee Id:</label>
                  <input type="text" value={formik.values.employeeId} readOnly className="form-control" />
                </div>

                {/* Start Date */}
                <div className="mb-3">
                  <label>Start Date:</label>
                  <DatePicker
                    selected={formik.values.startDate}
                    onChange={(date) => formik.setFieldValue("startDate", date)}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </div>

                {/* End Date */}
                <div className="mb-3">
                  <label>End Date:</label>
                  <DatePicker
                    selected={formik.values.endDate}
                    onChange={(date) => formik.setFieldValue("endDate", date)}
                    minDate={formik.values.startDate}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </div>

                {/* Number of Days */}
                <div className="mb-3">
                  <label>No Of Days:</label>
                  <input type="text" readOnly className="form-control" value={formik.values.noOfDays} />
                </div>

                {/* Reason */}
                <div className="mb-3">
                  <label>Reason:</label>
                  <select className="form-control" name="reason" value={formik.values.reason} onChange={formik.handleChange}>
                    <option value="">Select</option>
                    <option value="sick-leave">Sick Leave</option>
                    <option value="earned-leave">Earned Leave</option>
                    <option value="casual-leave">Casual Leave</option>
                    <option value="others-leave">Others</option>
                  </select>
                </div>

                {/* Comments */}
                <div className="mb-3">
                  <label>Comments:</label>
                  <textarea className="form-control" name="comments" value={formik.values.comments} onChange={formik.handleChange} />
                </div>

                {/* Buttons */}
                <div className="text-end">
                  <button type="button" className="btn btn-success mx-2" onClick={() => setConfirmationModal(true)}>
                    Submit
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate("/employee")}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center text-white py-5">
            <h3>No Pending Leave To Edit</h3>
            <button className="btn btn-light" onClick={() => navigate("/employee")}>Back</button>
          </div>
        )}

        {/* CONFIRMATION MODAL */}
        <Modal show={confirmationModal} centered>
          <Modal.Body>Do you want to submit the edited leave request?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setConfirmationModal(false)}>Cancel</Button>
            <Button variant="success" onClick={editLeaveRequest}>Submit</Button>
          </Modal.Footer>
        </Modal>

        {/* SUCCESS MODAL */}
        <Modal show={successModal} centered>
          <div className="p-4 text-center">
            <img src={successCheck} className="w-25" alt="success" />
            <h6 className="mt-3">Leave request updated successfully.</h6>
            <button className="btn btn-success w-100 mt-3" onClick={() => navigate("/employee")}>Close</button>
          </div>
        </Modal>

        {/* ERROR MODAL */}
        <Modal show={errorModal} centered>
          <div className="p-4 text-center text-danger">
            <h6>{errorMessage}</h6>
            <button className="btn btn-danger w-100 mt-3" onClick={() => setErrorModal(false)}>Close</button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default EmployeeEditLeaveRequest;
