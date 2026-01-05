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
import { getValidLeaveDays } from "../../../Utils/holidays"; // ✅ IMPORT

function AdminEditLeaveRequest() {
  const [lastLeaveRequestData, setLastLeaveRequestData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();
  const adminId = useSelector((state) => state.adminLogin.value.adminId);

  const formik = useFormik({
    initialValues: {
      empId: "",
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
      const response = await axios.get(`${serverUrl}/admin/leave-requests`);
      const pendingItems = response.data.filter((item) => item.status === "PENDING");

      if (pendingItems.length > 0) {
        const lastRequest = pendingItems[pendingItems.length - 1];

        setLastLeaveRequestData(lastRequest);
        setEditId(lastRequest.id);

        formik.setValues({
          empId: adminId,
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

  useEffect(() => {
    fetchLeaveData();
  }, []);

  // ⭐ UPDATE: Sunday + Holiday count using utility
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const days = getValidLeaveDays(formik.values.startDate, formik.values.endDate);
      formik.setFieldValue("noOfDays", days);
    }
  }, [formik.values.startDate, formik.values.endDate]);

  async function editLeaveRequest() {
    setConfirmationModal(false);

    if (formik.values.noOfDays === 0) {
      alert("❌ Leave cannot be updated only for Sundays/Holidays.");
      return;
    }

    try {
      await axios.put(`${serverUrl}/admin/leave-requests/${editId}`, formik.values);
      setSuccessModal(true);
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  }

  const handleClose = () => {
    setSuccessModal(false);
    navigate("/admin");
  };

  return (
    <>
      <div className="ti-background-clr">
        {lastLeaveRequestData ? (
          <div className="ti-leave-management-container">
            <h5 className="text-center pt-4" style={{ color: "white" }}>
              EDIT LEAVE REQUEST
            </h5>

            <div className="bg-white p-4">
              <form onSubmit={formik.handleSubmit}>
                <div className="my-3 leave-row">
                  <label>Admin Id :</label>
                  <input type="text" value={adminId} readOnly className="w-25" />
                </div>

                <div className="my-3 leave-row">
                  <label>Start Date :</label>
                  <DatePicker
                    selected={formik.values.startDate}
                    onChange={(date) => formik.setFieldValue("startDate", date)}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                <div className="my-3 leave-row">
                  <label>End Date :</label>
                  <DatePicker
                    selected={formik.values.endDate}
                    onChange={(date) => formik.setFieldValue("endDate", date)}
                    minDate={formik.values.startDate}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                <div className="my-3 leave-row">
                  <label>No Of Days :</label>
                  <input type="text" value={formik.values.noOfDays} readOnly className="w-25" />
                </div>

                <div className="my-3 leave-row">
                  <label>Reason :</label>
                  <select name="reason" onChange={formik.handleChange} value={formik.values.reason}>
                    <option value="">Select</option>
                    <option value="sick-leave">Sick Leave</option>
                    <option value="earned-leave">Earned Leave</option>
                    <option value="casual-leave">Casual Leave</option>
                    <option value="others-leave">Others</option>
                  </select>
                </div>

                <div className="my-3 leave-row">
                  <label>Comments :</label>
                  <textarea name="comments" onChange={formik.handleChange} value={formik.values.comments} />
                </div>

                <div className="my-5 text-end">
                  <button
                    type="submit"
                    className="btn btn-success mx-2"
                    onClick={() => setConfirmationModal(true)}
                  >
                    Submit
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin")}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <h3 className="text-white text-center pt-5">No Pending Leave To Edit</h3>
        )}

        {/* CONFIRMATION MODAL */}
        <Modal show={confirmationModal}>
          <Modal.Body>Do you want to submit the edited leave request?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setConfirmationModal(false)}>Cancel</Button>
            <Button variant="success" onClick={editLeaveRequest}>Submit</Button>
          </Modal.Footer>
        </Modal>

        {/* SUCCESS MODAL */}
        <Modal show={successModal} centered>
          <div className="text-center p-4">
            <img src={successCheck} alt="success" className="w-25 mb-3"/>
            <h6>Leave Request Updated Successfully</h6>
            <button className="btn btn-success mt-3 w-100" onClick={handleClose}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default AdminEditLeaveRequest;
