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
import { leaveRequest_Url, serverUrl } from "../../APIs/Base_UrL";
import "./EmployeeEditLeaveRequest.css";
import { getValidLeaveDays } from "../../../Utils/holidays";

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

  const formik = useFormik({
    initialValues: {
      employeeId: "",
      startDate: "",
      endDate: "",
      noOfDays: 0,
      reason: "",
      status: "",
      comments: "",
    },
    validationSchema: schemaLeave,
    onSubmit: () => setConfirmationModal(true),
  });

  /* ---------------- FETCH LAST PENDING LEAVE ---------------- */
  async function fetchLeaveData() {
    try {
      const response = await axios.get(
        `${serverUrl}/leaverequests/employee/${employeeId}`
      );

      const pendingItems = response.data.filter(
        (item) => item.status === "PENDING"
      );

      if (pendingItems.length > 0) {
        const lastRequest = pendingItems[pendingItems.length - 1];

        setLastLeaveRequestData(lastRequest);
        setEditId(lastRequest.id);

        formik.setValues({
          employeeId: lastRequest.employeeId,
          startDate: lastRequest.startDate,
          endDate: lastRequest.endDate,
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

  /* ---------------- AUTO CALCULATE DAYS (SUNDAYS + HOLIDAYS) ---------------- */
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const days = getValidLeaveDays(
        formik.values.startDate,
        formik.values.endDate
      );
      formik.setFieldValue("noOfDays", days);
    }
  }, [formik.values.startDate, formik.values.endDate]);

  /* ---------------- UPDATE LEAVE ---------------- */
  async function editLeaveRequest() {
    setConfirmationModal(false);

    if (formik.values.noOfDays === 0) {
      setErrorMessage(
        "❌ You cannot apply leave only on holidays or Sundays."
      );
      setErrorModal(true);
      return;
    }

    try {
      await axios.put(
        `${serverUrl}/leaverequests/${editId}`,
        formik.values
      );
      setSuccessModal(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
        "Error updating leave request. Try again."
      );
      setErrorModal(true);
    }
  }

  function closeSuccessModal() {
    setSuccessModal(false);
    navigate("/employee");
  }

  return (
    <>
      <div className="ti-background-clr">
        {lastLeaveRequestData &&
          Object.keys(lastLeaveRequestData).length > 0 ? (
          <div className="ti-leave-management-container">
            <h5 className="text-center pt-4" style={{ color: "white" }}>
              EDIT LEAVE REQUEST
            </h5>
            <div className="bg-white p-4">
              <form
                onSubmit={formik.handleSubmit}
                
              >
                <div className="my-3 leave-row">
                  <label> Employee Id:
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="empId"
                    value={formik.values.employeeId}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.empId && formik.errors.empId && (
                    <p className="text-danger small">
                      {formik.errors.empId}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div className="my-3 leave-row">
                  <label> Start Date:
                    <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={formik.values.startDate}
                    onChange={(date) =>
                      formik.setFieldValue("startDate", date)
                    }
                    minDate={new Date()}
                    placeholderText="dd/mm/yyyy"
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </div>

                {/* End Date */}
                <div className="my-3 leave-row">
                  <label>End Date:
                    <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    selected={formik.values.endDate}
                    onChange={(date) =>
                      formik.setFieldValue("endDate", date)
                    }
                    minDate={new Date()}
                    placeholderText="dd/mm/yyyy"
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                  {formik.errors.endDate && (
                    <p className="text-danger small">
                      {formik.errors.endDate}
                    </p>
                  )}
                </div>

                {/* No Of Days */}
                <div className="my-3 leave-row">
                  <label>No Of Days:</label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={formik.values.noOfDays}
                  />
                </div>

                {/* Reason Dropdown */}
                <div className="my-3 leave-row">
                  <label>Reason:
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    id="leave-reason"
                    name="reason"
                    onChange={formik.handleChange}
                    value={formik.values.reason}
                  >
                    <option value="">Select</option>
                    <option value="sick-leave">Sick Leave</option>
                    <option value="earned-leave">Earned Leave</option>
                    <option value="casual-leave">Casual Leave</option>
                    {/* <option value="maternity-leave">Maternity Leave</option> */}
                    <option value="others-leave">Others</option>
                  </select>
                  {formik.touched.reason && formik.errors.reason && (
                    <p className="text-danger small">
                      {formik.errors.reason}
                    </p>
                  )}
                </div>

                {/* Comments */}
                <div className="my-3 leave-row">
                  <label>Comments:
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    name="comments"
                    onChange={formik.handleChange}
                    value={formik.values.comments}
                  ></textarea>
                  {formik.touched.comments && formik.errors.comments && (
                    <p className="text-danger small">
                      {formik.errors.comments}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="my-5 text-end">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="btn btn-success mx-2"
                    onClick={() => setConfirmationModal(true)}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/employee")}
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          </div>

        ) : (
          <div className="text-white text-center pt-5">
            <h3 style={{ color: "white" }}>No Leave Request Available</h3>
            <p style={{ color: "white" }}>Please create a new one.</p>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/employee")}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        <Modal show={confirmationModal} centered>
          <Modal.Body>
            Do you want to submit the edited leave request?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setConfirmationModal(false)}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={editLeaveRequest}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Success Modal */}
        <Modal show={successModal} centered>
          <div className="modal-success p-4 text-center">
            <img src={successCheck} className="img-fluid mb-3" alt="Success" />
            <p>Leave request updated successfully.</p>
            <button
              className="btn btn-success w-100"
              onClick={closeSuccessModal}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default EmployeeEditLeaveRequest;