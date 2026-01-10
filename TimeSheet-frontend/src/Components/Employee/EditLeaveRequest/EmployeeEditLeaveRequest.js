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

function EmployeeEditLeaveRequest() {
  const [lastLeaveRequestData, setLastLeaveRequestData] = useState({});
  const [editId, setEditId] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [numberOfDays, setNumberOfDays] = useState(0);
  const employeeValue = useSelector((state) => state.employeeLogin.value);
  const employeeId = employeeValue.employeeId;

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
      const response = await axios.get(
        `${serverUrl}/leaverequests/employee/${employeeId}`
      );
      const leaveRequest = response.data;
      //  const filteringEmployeeId = leaveRequest.filter(item => item.empId === employeeId);
      const pendingItems = leaveRequest.filter(
        (item) => item.status === "PENDING"
      );

      if (pendingItems.length > 0) {
        const lastRequest = pendingItems[pendingItems.length - 1];
        console.log("last", lastRequest.employeeId);
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
  console.log("last State", lastLeaveRequestData);
  useEffect(() => {
    fetchLeaveData();
  }, []);

  // useEffect(() => {
  //   if (formik.values.startDate && formik.values.endDate) {
  //     const start = new Date(formik.values.startDate);
  //     const end = new Date(formik.values.endDate);
  //     let days = 0;

  //     // Loop through each date in the range and count only non-Saturdays and non-Sundays
  //     for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
  //       if (d.getDay() !== 0 && d.getDay() !== 6) { // Exclude Sundays (0) and Saturdays (6)
  //         days++;
  //       }
  //     }

  //     setNumberOfDays(days);
  //     formik.setFieldValue("noOfDays", days);
  //   }
  // }, [formik.values.startDate, formik.values.endDate]);

  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const start = new Date(formik.values.startDate);
      const end = new Date(formik.values.endDate);
      let days = 0;

      // Clone the start date to avoid mutating it
      let current = new Date(start);

      // Loop through each date in the range and count only non-Sundays
      while (current <= end) {
        if (current.getDay() !== 0) { // Exclude Sundays (0)
          days++;
        }
        current.setDate(current.getDate() + 1);
      }

      setNumberOfDays(days);
      formik.setFieldValue("noOfDays", days);
    }
  }, [formik.values.startDate, formik.values.endDate]);


  async function editLeaveRequest() {
    setConfirmationModal(false);
    try {
      await axios.put(
        `${serverUrl}/leaverequests/${editId}`,
        formik.values
      );
      setSuccessModal(true);
      console.log("submitted successfully");
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  }

  function closeSuccessModal() {
    setSuccessModal(true);
    navigate("/employee");
  }

  return (
    <>
      <div className="container-fluid ti-background-clr px-3">
        {lastLeaveRequestData &&
          Object.keys(lastLeaveRequestData).length > 0 ? (
          <div className="ti-leave-management-container">
            <div className="bg-white p-5 m-5">
              <h5 className="text-center pt-4 text-primary">
                EDIT LEAVE REQUEST
              </h5>
              <div className="row">
                <div className="col-12">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="needs-validation"
                  >
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="mb-3">
                      <label>No Of Days:</label>
                      <input
                        type="text"
                        readOnly
                        className="form-control"
                        value={formik.values.noOfDays}
                      />
                    </div>

                    {/* Reason Dropdown */}
                    <div className="mb-3">
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
                    <div className="mb-3">
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
                    <div className="d-flex flex-column flex-md-row justify-content-md-end gap-2">
                      <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="btn btn-success"
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
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
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
