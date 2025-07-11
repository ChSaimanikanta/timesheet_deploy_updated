import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../Supervisor/Home/supervisor.css";
import { useSelector, useDispatch } from "react-redux";
import { submitON, submitOFF } from "../../features/submitBtn";

import { leaveSubmitON, leaveSubmitOFF } from "../../features/empLeaveSubmit";
import axios from "axios";
import { leaveRequest_Url, serverUrl } from "../../APIs/Base_UrL";
import { employeeWorkingHours_Url } from "../../APIs/Base_UrL";

function EmployeeHome() {
  const employeeValue = useSelector((state) => state.employeeLogin.value);
  const employeeId = employeeValue.employeeId;
  const [isOpenTimesheet, setIsOpenTimesheet] = useState(true);
  const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(true);
  const [startSubmitDate, setStartSubmitDate] = useState("");
  const [endSubmitDate, setEndSubmitDate] = useState("");
  const [submitEmployeeId, setSubmitEmployeeId] = useState("");
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
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // Fetch timesheet submission data dynamically
  useEffect(() => {
    async function fetchTimesheetData() {
      if (!employeeId) {
        console.warn("Employee ID is missing.");
        return;
      }

      let today = new Date();
      let startDate, endDate;

      // ✅ Determine correct timesheet period
      if (today.getDate() <= 15) {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First half (1st to 15th)
        endDate = new Date(today.getFullYear(), today.getMonth(), 15);
      } else {
        startDate = new Date(today.getFullYear(), today.getMonth(), 16); // Second half (16th to last day)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }

      // ✅ Ensure endDate covers the entire day
      endDate.setHours(23, 59, 59, 999);

      // ✅ Format dates correctly to prevent timezone shifts
      let formattedStartDate = startDate.toLocaleDateString('en-CA'); // Correct format YYYY-MM-DD
      let formattedEndDate = endDate.toLocaleDateString('en-CA');

      console.log("Fetching timesheet:", formattedStartDate, "to", formattedEndDate);

      try {
        let response = await axios.get(
          `${serverUrl}/workinghours/employee/${employeeId}/range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );

        let data = response.data;

        console.log("API Response:", data);

        if (data.length > 0) {
          // ✅ Sort data to ensure correct start and end dates
          let sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

          let firstDate = sortedData[0].date;  // ✅ First entry in sorted data
          let lastDate = sortedData[sortedData.length - 1].date;  // ✅ Last entry in sorted data

          setStartSubmitDate(firstDate);
          setEndSubmitDate(lastDate);
          setSubmitEmployeeId(sortedData[0].employeeId);
          setStatusValue(sortedData[0].status);

          // ✅ Update submission status dynamically
          if (sortedData[0].status === "APPROVED" || sortedData[0].status === "REJECTED") {
            dispatch(submitOFF(false));
          } else {
            dispatch(submitON(true));
          }
        } else {
          setStatusValue("No Data Submitted");
        }
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
      }
    }

    fetchTimesheetData();
  }, [employeeId, dispatch, serverUrl, submitON, submitOFF]);

  async function leaveStatus() {
    let response = await axios.get(
      `${serverUrl}/leaverequests/employee/${employeeId}`
    );
    let data = response.data;

    let submitLeaveRequest = data.filter((obj) => obj.id == leaveObjectId);

    submitLeaveRequest.map((obj) => {
      setLeaveSubmitStartDate(obj.startDate);
      setLeaveSubmitEndDate(obj.endDate);
      setLeaveSubmitStatus(obj.status);
    });
    let leaveStatus = submitLeaveRequest.some(
      (obj) => obj.status === "PENDING"
    );
    console.log(leaveStatus);
    if (leaveStatus) {
      dispatch(leaveSubmitON(true));
    } else {
      dispatch(leaveSubmitOFF(false));
    }
  }

  useEffect(() => {
    leaveStatus();
  }, [leaveObjectId]);

  // Open modal with selected leave ID
  const handleCancelClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Cancel confirmation logic
  const handleConfirmCancel = () => {
    fetch(`${serverUrl}/leaverequests/${selectedId}`, {
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

  useEffect(() => {
    async function fetchLeaveRequests() {
      try {
        let response = await axios.get(`${serverUrl}/leaverequests/employee/${employeeId}`);
        let data = response.data;

        // Filter out leave requests that have already passed their end date
        const currentDate = new Date();
        const filteredLeaveRequests = data.filter(request => {
          const requestEndDate = new Date(request.endDate);
          // Compare only the date part, not the time
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
        console.error("Error fetching leave requests:", error);
      }
    }

    fetchLeaveRequests();
  }, []);

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
                    <Link to={"/employee/addtimesheet"}>Add Timesheet</Link>
                  </ul>
                  {/* <ul>
                    <Link to={"/employee/edittimesheet"}>Edit Timesheet</Link>
                  </ul> */}
                  <ul>
                    <Link to={"/employee/rejecttimesheet"}>
                      View Rejected Timesheet
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
                    <Link to={"/employee/leaverequest"}>Add Leave Request</Link>
                  </ul>
                  <ul>
                    <Link to={"/employee/editleaverequest"}>
                      Edit Leave Request
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/employee/rejectedleaverequests"}>
                      View Rejected Leave Requests
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/employee/approvedleaverequests"}>
                      View Approved Leave Requests
                    </Link>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="right-details">

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
                              cursor: "default",
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
                  {leaveRequests.map((leave) => (
                    <div key={leave.id} className="m-4 ti-home-ti-status p-4">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeHome;