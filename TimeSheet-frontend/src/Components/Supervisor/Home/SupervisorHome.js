import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../Supervisor/Home/supervisor.css";
import { useSelector, useDispatch } from "react-redux";
import { submitON, submitOFF } from "../../features/submitBtn";

import { leaveSubmitON, leaveSubmitOFF } from "../../features/empLeaveSubmit";
import axios from "axios";
import { serverUrl, supervisorurl } from '../../APIs/Base_UrL'


function SupervisorHome() {
  const supervisorValue = useSelector((state) => state.supervisorLogin.value);
  const supervisorId = supervisorValue.supervisorId;
  const [isOpenTimesheet, setIsOpenTimesheet] = useState(true);
  const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(true);
  const [startSubmitDate, setStartSubmitDate] = useState("");
  const [endSubmitDate, setEndSubmitDate] = useState("");
  const [submitSupervisorId, setSubmitSupervisorId] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [countTimesheet, setCountTimesheet] = useState(0);
  const [rejectTimesheetCount, setRejectTimesheetCount] = useState(0);
  const [leaveObjectId, setLeaveObjectId] = useState("");
  const [isLeaveSubmit, setIsLeaveSubmit] = useState("");
  const [leaveSubmitEmpId, setLeaveSubmitEmpId] = useState("");
  const [leaveSubmitStartDate, setLeaveSubmitStartDate] = useState("");
  const [leaveSubmitEndDate, setLeaveSubmitEndDate] = useState("");
  const [leaveSubmitStatus, setLeaveSubmitStatus] = useState("");
  const [leavePending, setLeavePending] = useState(0);
  const [rejectLeave, setRejectLeave] = useState(0);
  const dispatch = useDispatch();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [calendarImage, setCalendarImage] = useState(null);
const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    async function fetchTimesheetData() {
      if (!supervisorId) {
        console.warn("Supervisor ID is missing.");
        return;
      }

      const formatDate = (date) => date.toLocaleDateString("en-CA");

      const today = new Date();
      const ranges = [];

      // Check both halves of the last 3 months (you can increase this range if needed)
      for (let i = 0; i < 3; i++) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();

        const firstHalfStart = new Date(year, month, 1);
        const firstHalfEnd = new Date(year, month, 15, 23, 59, 59, 999);
        const secondHalfStart = new Date(year, month, 16);
        const secondHalfEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

        ranges.push(
          {
            label: "Second Half",
            startDate: formatDate(secondHalfStart),
            endDate: formatDate(secondHalfEnd),
          },
          {
            label: "First Half",
            startDate: formatDate(firstHalfStart),
            endDate: formatDate(firstHalfEnd),
          }
        );
      }

      let foundData = null;

      for (const range of ranges) {
        try {
          const response = await axios.get(
            `${serverUrl}/sup/api/working-hours/${supervisorId}/range`,
            {
              params: {
                startDate: range.startDate,
                endDate: range.endDate,
              },
            }
          );

          if (response.data && response.data.length > 0) {
            foundData = {
              data: response.data,
              label: range.label,
            };
            break; // Stop at the first valid submission found
          }
        } catch (error) {
          console.error(`Error fetching ${range.label} timesheet:`, error);
        }
      }

      if (foundData) {
        const sortedData = foundData.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstDate = sortedData[0].date;
        const lastDate = sortedData[sortedData.length - 1].date;

        setStartSubmitDate(firstDate);
        setEndSubmitDate(lastDate);
        setSubmitSupervisorId(sortedData[0].employeeId);
        setStatusValue(sortedData[0].status);

        const status = sortedData[0].status;
        if (status === "APPROVED" || status === "REJECTED") {
          dispatch(submitOFF(false));
        } else {
          dispatch(submitON(true));
        }
      } else {
        setStatusValue("No Data Submitted");
      }
    }

    fetchTimesheetData();
  }, [supervisorId, dispatch, serverUrl]);


  console.log(startSubmitDate);
  console.log(endSubmitDate);
  console.log(submitSupervisorId);






  useEffect(() => {
    async function fetchLeaveRequests() {
      if (!supervisorId) {
        console.warn("Supervisor ID is missing for leave request fetch.");
        return;
      }

      try {
        let response = await axios.get(`${serverUrl}/supervisor/leave-requests/${supervisorId}`);
        let data = response.data;

        const currentDate = new Date();
        const filteredLeaveRequests = data.filter(request => {
          const requestEndDate = new Date(request.endDate);
          return (
            requestEndDate.getFullYear() > currentDate.getFullYear() ||
            (requestEndDate.getFullYear() === currentDate.getFullYear() &&
              requestEndDate.getMonth() > currentDate.getMonth()) ||
            (requestEndDate.getFullYear() === currentDate.getFullYear() &&
              requestEndDate.getMonth() === currentDate.getMonth() &&
              requestEndDate.getDate() >= currentDate.getDate())
          );
        });

        setLeaveRequests(filteredLeaveRequests);
      } catch (error) {
        console.error("Error fetching filtered leave requests:", error);
      }
    }

    fetchLeaveRequests();
  }, [supervisorId]);

 const handleCancelClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };
  
  // Cancel confirmation logic
  const handleConfirmCancel = () => {
    fetch(`${serverUrl}/supervisor/leave-requests/${selectedId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // alert("Leave request cancelled successfully.");
          setLeaveRequests((prev) => prev.filter((leave) => leave.id !== selectedId));
        } else {
          return response.json().then((error) => {
            alert(`Failed to cancel: ${error.message || "Unexpected error."}`);
          });
        }
      })
      .catch((err) => {
        console.error("Cancel error:", err);
        alert("Something went wrong while cancelling.");
      })
      .finally(() => {
        setShowModal(false);
        setSelectedId(null);
      });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedId(null);
  };
  return (
    <>
      <div className="ti-background-clr">
        <div className="ti-home-container">
          <div className="left-navigation">
            <div
              className={`collapse-container mb-3 ${isOpenTimesheet ? "active" : ""
                }`}
            >
              <button
                onClick={() => setIsOpenTimesheet(!isOpenTimesheet)}
                className="collapse-toggle btn fw-bold"
              >
                Timesheet Options
              </button>
              {isOpenTimesheet && (
                <div className="collapse-content ">
                  <ul>
                    <Link to={"/supervisor/addtimesheet"}>Add Timesheet</Link>
                  </ul>
                  {/* <ul>
                    <Link to={"/supervisor/edittimesheet"}>Edit Timesheet</Link>
                  </ul> */}
                  <ul>
                    <Link to={"/supervisor/rejecttimesheet"}>
                      View Rejected Timesheet
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/supervisor/approvetimesheet"}>
                      Employee Timesheet Approval & Rejection
                    </Link>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={`collapse-container mb-3 ${isOpenLeaveManagement ? "active" : ""
                }`}
            >
              <button
                onClick={() => setIsOpenLeaveManagement(!isOpenLeaveManagement)}
                className="collapse-toggle btn fw-bold"
              >
                Leave Management
              </button>
              {isOpenLeaveManagement && (
                <div className="collapse-content ">
                  <ul>
                    <Link to={"/supervisor/leaverequest"}>
                      Add Leave Request
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/supervisor/editleaverequest"}>
                      Edit Leave Request
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/supervisor/viewrejectedleaverequests"}>
                      View Rejected Leave Requests
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/supervisor/viewapprovedleaverequests"}>
                      View Approved Leave Requests
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/supervisor/leaveapproval"}>
                      Approve or Reject Employee Leave Requests
                    </Link>
                  </ul>
                </div>
              )}
            </div>
            {/* HOLIDAY CALENDAR */}
            <div className="collapse-content">
              <ul>
                <button className="btn btn-outline-primary w-100 mb-2"
                  onClick={() => setCalendarImage("/hyd-calender-2026.png")}>
                  Hyderabad Holiday Calendar
                </button>
              </ul>
              <ul>
                <button className="btn btn-outline-success w-100"
                  onClick={() => setCalendarImage("/coimbatore-calender-2026.png")}>
                  Coimbatore Holiday Calendar
                </button>
              </ul>
            </div>
          </div>

          <div className="right-details">

            {calendarImage ? (
              // SHOW CALENDAR IMAGE VIEW
              <div className="position-relative p-3"
                style={{ background: "#fff", borderRadius: "8px", minHeight: "85vh" }}>

                <button className="btn btn-primary position-absolute"
                  style={{ top: "10px", right: "10px" }}
                  onClick={() => setCalendarImage(null)}>
                  Back
                </button>

                <div className="d-flex justify-content-center align-items-center h-100">
                  <img src={calendarImage} alt="Holiday Calendar"
                    className="img-fluid"
                    style={{ maxHeight: "80vh", objectFit: "contain" }} />
                </div>

              </div>

            ) : (
              <div className="row text-center ti-home-content mt-2">
                {/* timesheet status */}
                <div className="col mx-5 my-2 p-2 ">
                  <p className="p-2 title">Your Submitted Timesheet</p>
                  <div className="body   p-2 text-start">
                    <div className="m-4 ti-home-ti-status p-4">
                      <h5 className=""> Timesheet Period </h5>

                      <div className="d-flex flex-column ms-4">
                        <div className="d-flex align-items-center mb-2">
                          <p className="mb-0 me-2">Start date :</p>
                          <p className="mb-0">{startSubmitDate}</p>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <p className="mb-0 me-2">End date :</p>
                          <p className="mb-0">{endSubmitDate}</p>
                        </div>
                        <div className="d-flex align-items-center">
                          <p className="mb-0 me-2">STATUS :</p>
                          {statusValue && (
                            <button
                              className="view-btn p-2"
                              style={{
                                backgroundColor:
                                  statusValue === "APPROVED"
                                    ? "green"
                                    : statusValue === "REJECTED"
                                      ? "red"
                                      : "blue",
                                color: "white", // Set the text color to white for better visibility
                              }}
                            >
                              {statusValue}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* navigation pages */}
              <div className="col mx-5 my-2 p-2">
                  <p className="p-2 title">Your Requested Leaves</p>
                  <div className="body p-2 text-start">
                    {leaveRequests.map((leave, index) => (
                      <div key={index} className="m-4 ti-home-ti-status p-4">
                        <h5>Leave Request Period</h5>
                        <div className="d-flex flex-column ms-4">
                          <div className="d-flex align-items-center mb-2">
                            <p className="mb-0 me-2">Start date:</p>
                            <p className="mb-0">{leave.startDate}</p>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <p className="mb-0 me-2">End date:</p>
                            <p className="mb-0">{leave.endDate}</p>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <p className="mb-0 me-2">Number of Days:</p>
                            <p className="mb-0">{leave.noOfDays}</p>
                          </div>
                          <div style={{ backgroundColor: "#d5d8f6", padding: "5px", borderRadius: "8px" }}>
                            <div className="d-flex align-items-center mb-2">
                              {/* STATUS Label */}
                              <p className="mb-0 me-2" style={{ fontSize: "14px", color: "#555" }}>
                                <strong>STATUS:</strong>
                              </p>

                              {/* Buttons in one line */}
                              <div className="d-flex gap-3 align-items-center">
                                {/* Status Button */}
                                <button
                                  className="view-btn"
                                  style={{
                                    backgroundColor:
                                      leave.status === "APPROVED"
                                        ? "green"
                                        : leave.status === "REJECTED"
                                          ? "red"
                                          : "blue",
                                    color: "white",
                                    height: "30px",
                                    width: "120px",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "0 10px",
                                    fontSize: "14px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "default", // 👈 This makes the arrow appear on hover
                                  }}
                                >
                                  {leave.status}
                                </button>


                                {/* Cancel Button - Only when status is PENDING */}
                                {leave.status === "PENDING" && (
                                  <button
                                    className="cancel-btn"
                                    style={{
                                      backgroundColor: "red",
                                      color: "white",
                                      height: "30px",
                                      width: "120px",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      padding: "0 10px",
                                      fontSize: "12px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    onClick={() => handleCancelClick(leave.id)}
                                  >
                                    Cancel Request
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>

                
                  {/* Modal for confirmation */}
                  {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Cancel Leave Request</h5>
                            <button type="button" className="btn-close" onClick={handleModalClose}></button>
                          </div>
                          <div className="modal-body">
                            <p>Are you sure you want to cancel this leave request?</p>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleModalClose}>
                              Close
                            </button>
                            <button className="btn btn-danger" onClick={handleConfirmCancel}>
                              Confirm Cancellation
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SupervisorHome;
