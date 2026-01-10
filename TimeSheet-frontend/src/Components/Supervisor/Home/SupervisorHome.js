import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../Supervisor/Home/supervisor.css";
import { useSelector, useDispatch } from "react-redux";
import { submitON, submitOFF } from "../../features/submitBtn";

import { leaveSubmitON, leaveSubmitOFF } from "../../features/empLeaveSubmit";
import axios from "axios";
import { serverUrl, supervisorurl } from '../../APIs/Base_UrL'
import { Button, Modal } from "react-bootstrap";


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

  // Cancel Leave Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
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

  // Open modal with selected leave ID
  /* ------------------ CANCEL LEAVE ------------------ */

  const handleCancelClick = (id) => {
    setSelectedLeaveId(id);
    setShowModal(true);
  };

  const confirmCancelLeave = async () => {
    try {
      await axios.delete(
        `${serverUrl}/supervisor/leave-requests/${selectedLeaveId}`
      );

      setLeaveRequests((prev) =>
        prev.filter((leave) => leave.id !== selectedLeaveId)
      );

      setShowModal(false);
    } catch (error) {
      console.error("Cancel leave failed:", error);
    }
  };
  return (
    <>
      <div className="ti-background-clr">
        <div className="ti-home-container">

          {/* LEFT NAVIGATION SIDEBAR */}
          <div className="left-navigation">

            {/* TIMESHEET MENU */}
            <div className={`collapse-container mb-3 ${isOpenTimesheet ? "active" : ""}`}>
              <button className="collapse-toggle btn fw-bold"
                onClick={() => setIsOpenTimesheet(!isOpenTimesheet)}>
                Timesheet Options
              </button>

              {isOpenTimesheet && (
                <div className="collapse-content">
                  <ul><Link to={"/supervisor/addtimesheet"}>Add Timesheet</Link></ul>
                  <ul><Link to={"/supervisor/rejecttimesheet"}>View Rejected Timesheet</Link></ul>
                  <ul><Link to={"/supervisor/approvetimesheet"}>Employee Approval</Link></ul>
                </div>
              )}
            </div>

            {/* LEAVE MENU */}
            <div className={`collapse-container mb-3 ${isOpenLeaveManagement ? "active" : ""}`}>
              <button className="collapse-toggle btn fw-bold"
                onClick={() => setIsOpenLeaveManagement(!isOpenLeaveManagement)}>
                Leave Management
              </button>

              {isOpenLeaveManagement && (
                <div className="collapse-content">
                  <ul><Link to={"/supervisor/leaverequest"}>Add Leave Request</Link></ul>
                  <ul><Link to={"/supervisor/viewrejectedleaverequests"}>Rejected Requests</Link></ul>
                  <ul><Link to={"/supervisor/viewapprovedleaverequests"}>Approved Requests</Link></ul>
                  <ul><Link to={"/supervisor/leaveapproval"}>Approve Employee Leave</Link></ul>
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

          {/* RIGHT MAIN SCREEN */}
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
              // DEFAULT DASHBOARD VIEW
              <div className="row text-center ti-home-content mt-2">

                {/* TIMESHEET CARD */}
                <div className="col mx-5 my-2 p-2">
                  <p className="p-2 title">Your Submitted Timesheet</p>
                  <div className="body p-2 text-start">
                    <div className="m-4 ti-home-ti-status p-4">
                      <h5 className="">Timesheet Period</h5>

                      <div className="d-flex flex-column ms-4">

                        {/* Start Date */}
                        <div className="d-flex align-items-center mb-2">
                          <p className="mb-0 me-2">Start Date:</p>
                          <p className="mb-0">{startSubmitDate}</p>
                        </div>

                        {/* End Date */}
                        <div className="d-flex align-items-center mb-2">
                          <p className="mb-0 me-2">End Date:</p>
                          <p className="mb-0">{endSubmitDate}</p>
                        </div>

                        {/* Status */}
                        <div className="d-flex align-items-center">
                          <p className="mb-0 me-2">Status:</p>
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
                                color: "white",
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


                {/* LEAVE CARD */}
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
                            <p className="mb-0">{leave.noOfDays}</p> </div>
                          <div className="d-flex align-items-center">
                            <p className="mb-0 me-2">STATUS:</p>
                            <button className="view-btn p-2"
                              style={{ backgroundColor: leave.status === "APPROVED" ? "green" : leave.status === "REJECTED" ? "red" : "blue", color: "white", }} >
                              {leave.status} </button> {/* Cancel Button - Only when status is PENDING */}
                            {leave.status === "PENDING" && (
                              <button className="cancel-btn"
                                style={{ backgroundColor: "red", color: "white", height: "30px", width: "120px", border: "none", borderRadius: "4px", cursor: "pointer", padding: "0 10px", fontSize: "12px", display: "flex", justifyContent: "center", alignItems: "center", }} onClick={() => handleCancelClick(leave.id)} > Cancel Request </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>

      {/* CANCEL MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>Are you sure you want to cancel this leave request?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>No</Button>
          <Button variant="danger" onClick={confirmCancelLeave}>Yes, Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SupervisorHome;
