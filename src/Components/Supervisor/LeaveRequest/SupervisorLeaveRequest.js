import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { schemaLeave } from "./SupervisorLeaveSchema";
import { serverUrl } from "../../APIs/Base_UrL";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import { leaveSubmitON } from "../../features/empLeaveSubmit";
import { useSelector, useDispatch } from "react-redux";
import "./supervisorLeaveRequest.css";
import { isHoliday } from "../../../Utils/holidays";

export function SupervisorLeaveRequest() {
    const supervisorValue = useSelector((state) => state.supervisorLogin.value);
    const supervisorId = supervisorValue.supervisorId;
  
    const [leaveSuccessModal, setLeaveSuccessModal] = useState(false);
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [approvedLeaveCount, setApprovedLeaveCount] = useState(0);
    const [totalLeaves, setTotalLeaves] = useState(18);
    const [pendingLeaves, setPendingLeaves] = useState(0);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    // Function to calculate pending leaves
    const calculatePendingLeaves = () => {
      const count = totalLeaves - approvedLeaveCount;
      setPendingLeaves(count);
    };
  
    // Function to fetch and calculate approved leaves
    const calculateApprovedLeave = async () => {
      try {
        const response = await axios.get(
          `${serverUrl}/supervisor/leave-requests`
        );
  
        const currentYear = new Date().getFullYear();
        const allLeaves = response.data;
  
        const approvedDays = allLeaves
          .filter((leave) => {
            const leaveYear = new Date(leave.startDate).getFullYear();
            return leave.status === "APPROVED" && leaveYear === currentYear;
          })
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
  
    // Automatically calculate number of leave days
    const formik = useFormik({
      initialValues: {
        supervisorId,
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
  
          // Validate requested days do not exceed available leaves
          if (requestedDays > pendingLeaves) {
            alert(
              `Error: You cannot request ${requestedDays} days. Only ${pendingLeaves} days are available.`
            );
            return;
          }
  
          const leaveData = await axios.post(
            `${serverUrl}/supervisor/leave-requests`,
            values
          );
  
          if (leaveData.data) {
            setLeaveSuccessModal(true);
            setTotalLeaves((prevTotalLeaves) => prevTotalLeaves - requestedDays);
            localStorage.setItem(`leaveObjectId${supervisorId}`, leaveData.data.id);
            dispatch(leaveSubmitON(true));
            formik.resetForm();
          }
        } catch (error) {
          console.error("Error submitting leave request:", error);
        }
      },
    });
  
 useEffect(() => {
  if (formik.values.startDate && formik.values.endDate) {
    const start = new Date(formik.values.startDate);
    const end = new Date(formik.values.endDate);

    let days = 0;
    let current = new Date(start);

    while (current <= end) {
      const isSundayDay = current.getDay() === 0;
      const isHolidayDay = isHoliday(current);

      if (!isSundayDay && !isHolidayDay) {
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
            <h5 className="text-center pt-4" style={{color:"white"}}>SUPERVISOR LEAVE REQUEST</h5>
            <div className="ti-leave-management-container">
              <h5 style={{color:"white"}}>YOUR AVAILABLE LEAVES: {pendingLeaves}</h5>
              <div className="bg-white">
                <div className="row">
                  <div className="col">
                    <div className="p-5 center-align">
                      <form onSubmit={formik.handleSubmit}>
                        {/* Start Date */}
                        <div className="my-3 leave-row">
                          <label>
                            <span style={{ color: "red" }}>*</span> Start Date:
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
                                    : ""
                                )
                              }
                              minDate={new Date()}
                              placeholderText="dd/mm/yyyy"
                              dateFormat="dd/MM/yyyy"
                              className="w-100"
                            />
                            {formik.errors.startDate && (
                              <div style={{ color: "red" }}>
                                {formik.errors.startDate}
                              </div>
                            )}
                          </div>
                        </div>
      
                        {/* End Date */}
                        <div className="my-3 leave-row">
                          <label>
                            <span style={{ color: "red" }}>*</span> End Date:
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
                                    : ""
                                )
                              }
                              minDate={new Date()}
                              placeholderText="dd/mm/yyyy"
                              dateFormat="dd/MM/yyyy"
                              className="w-100"
                            />
                            {formik.errors.endDate && (
                              <div style={{ color: "red" }}>
                                {formik.errors.endDate}
                              </div>
                            )}
                          </div>
                        </div>
      
                        {/* Number of Days */}
                        <div className="my-3 leave-row">
                          <label>No Of Days:</label>
                          <input
                            type="text"
                            readOnly
                            className="w-25"
                            value={formik.values.noOfDays}
                          />
                        </div>
      
                        {/* Reason */}
                        <div className="my-3 leave-row">
                          <label>
                            <span style={{ color: "red" }}>*</span> Reason:
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
                              <div style={{ color: "red" }}>
                                {formik.errors.reason}
                              </div>
                            )}
                          </div>
                        </div>
      
                        {/* Comments */}
                        <div className="my-3 leave-row">
                          <label>
                            <span style={{ color: "red" }}>*</span> Comments:
                          </label>
                          <div style={{ flex: 2 }}>
                            <textarea
                              name="comments"
                              onChange={formik.handleChange}
                              value={formik.values.comments}
                              required
                            />
                            {formik.errors.comments && (
                              <div style={{ color: "red" }}>
                                {formik.errors.comments}
                              </div>
                            )}
                          </div>
                        </div>
      
                        {/* Submit and Cancel Buttons */}
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
                            onClick={() => navigate("/supervisor")}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Success Modal */}
              <Modal
                className="custom-modal"
                style={{ left: "50%", transform: "translateX(-50%)" }}
                dialogClassName="modal-dialog-centered"
                show={leaveSuccessModal}
              >
                <div className="d-flex flex-column modal-success p-4 align-items-center">
                  <img
                    src={successCheck}
                    className="img-fluid mb-4"
                    alt="successCheck"
                  />
                  <p className="mb-4 text-center">
                    Your Leave Request Submitted Successfully
                  </p>
                  <button
                    className="btn w-100 text-white"
                    onClick={() => {
                      setLeaveSuccessModal(false);
                      navigate("/supervisor");
                    }}
                    style={{ backgroundColor: "#5EAC24" }}
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
  