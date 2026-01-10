import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../Supervisor/Home/supervisor.css";
import { useSelector, useDispatch } from "react-redux";

import {
  submitAdminON,
  submitAdminOFF,
} from "../../features/submitAdminButton";
import { leaveSubmitON, leaveSubmitOFF } from "../../features/empLeaveSubmit";
import axios from "axios";
import { serverUrl } from "../../APIs/Base_UrL";
import './AdminHome.css';

function AdminHome() {
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue.adminId;
  const [isOpenTimesheet, setIsOpenTimesheet] = useState(false);
  const [isOpenLeaveManagement, setIsOpenLeaveManagement] = useState(false);
  const [startSubmitDate, setStartSubmitDate] = useState("");
  const [endSubmitDate, setEndSubmitDate] = useState("");
  const [submitAdminId, setSubmitAdminId] = useState("");
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
  const [isOpenEmployeeManagement, setIsOpenEmployeeManagement] =
    useState(false);
  const [isOpenProjectManagement, setIsOpenProjectManagement] = useState(false);
const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // Fetch timesheet submission data dynamically
  // Fetch timesheet submission data dynamically
  useEffect(() => {
    async function fetchTimesheetData() {
      if (!adminId) {
        console.warn("Admin ID is missing.");
        return;
      }

      try {
        const response = await axios.get(`${serverUrl}/working-hours/${adminId}`);
        const allData = response.data || [];

        if (allData.length === 0) {
          setStatusValue("No Data Submitted");
          return;
        }

        // Sort by date descending to get the latest submission
        const sortedData = allData.sort((a, b) => new Date(b.date) - new Date(a.date));

        const latestDate = sortedData[0].date;
        const latestMonth = new Date(latestDate).getMonth();
        const latestYear = new Date(latestDate).getFullYear();

        // Filter only entries from the same half of that month
        const isSecondHalf = new Date(latestDate).getDate() >= 16;
        const filteredData = sortedData.filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getMonth() === latestMonth &&
            entryDate.getFullYear() === latestYear &&
            (isSecondHalf ? entryDate.getDate() >= 16 : entryDate.getDate() <= 15)
          );
        });

        const firstDate = filteredData[filteredData.length - 1].date;
        const lastDate = filteredData[0].date;

        setStartSubmitDate(firstDate);
        setEndSubmitDate(lastDate);
        setSubmitAdminId(filteredData[0].employeeId);
        setStatusValue(filteredData[0].status);

        if (filteredData[0].status === "APPROVED" || filteredData[0].status === "REJECTED") {
          dispatch(submitAdminOFF(false));
        } else {
          dispatch(submitAdminON(true));
        }
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
      }
    }


    fetchTimesheetData();
  }, [adminId, dispatch, serverUrl]);


  // Fetch leave requests
  useEffect(() => {
    async function fetchLeaveRequests() {
      try {
        let response = await axios.get(`${serverUrl}/admin/leave-requests`);
        let data = response.data;

        // Filter leave requests with pending or future dates
        const currentDate = new Date();
        const filteredRequests = data.filter(request => {
          const requestEndDate = new Date(request.endDate);
          return requestEndDate >= currentDate;
        });

        setLeaveRequests(filteredRequests);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    }

    fetchLeaveRequests();
  }, []);

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

  return (
    <>
      <div className="ti-background-clr">
        <div className="ti-home-container">
          <div className="left-navigation">
            <div
              className={`collapse-container mb-3 ${isOpenEmployeeManagement ? "active" : ""
                }`}
            >
              <button
                onClick={() =>
                  setIsOpenEmployeeManagement(!isOpenEmployeeManagement)
                }
                className="collapse-toggle btn fw-bold"
              >
                Employee Management
              </button>
              {isOpenEmployeeManagement && (
                <div className="collapse-content ">
                  <ul>
                    <Link to={"createemployee"}>Create Employee</Link>
                  </ul>
                  <ul>
                    <Link to={"searchemployee"}>Search Employee</Link>
                  </ul>
                  <ul>
                    <Link to={"uploademployees"}>Upload Employees</Link>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={`collapse-container mb-3 ${isOpenProjectManagement ? "active" : ""
                }`}
            >
              <button
                onClick={() =>
                  setIsOpenProjectManagement(!isOpenProjectManagement)
                }
                className="collapse-toggle btn fw-bold"
              >
                Project Management
              </button>
              {isOpenProjectManagement && (
                <div className="collapse-content">
                  <ul>
                    <Link to={"createproject"}>Add Project</Link>
                  </ul>
                  <ul>
                    <Link to={"updateprojectdetails"}>Search Project</Link>
                  </ul>
                </div>
              )}
            </div>
            <div
              className={`collapse-container mb-3 ${isOpenTimesheet ? "active" : ""
                }`}
            >
              <button
                onClick={() => setIsOpenTimesheet(!isOpenTimesheet)}
                className="collapse-toggle btn fw-bold"
              >
                Timesheet Management
              </button>
              {isOpenTimesheet && (
                <div className="collapse-content ">
                  <ul>
                    <Link to={"/admin/adminaddtimesheet"}>Add Timesheet</Link>
                  </ul>
                  {/* <ul>
                    <Link to={"/admin/adminedittimesheet"}>Edit Timesheet</Link>
                  </ul> */}
                  <ul>
                    <Link to={"/admin/adminrejecttimesheet"}>
                      View Rejected Timesheet
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/approvalpage"}>Supervisor Timesheet Approval & Rejection</Link>
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
                    <Link to={"/admin/adminaddleaverequest"}>
                      Add Leave Request
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/admineditleaverequest"}>
                      Edit Leave Request
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/adminviewrejectedleaverequests"}>
                      View Rejected Leave Requests
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/adminviewapprovedleaverequests"}>
                      View Approved Leave Requests
                    </Link>
                  </ul>
                  <ul>
                    <Link to={"/admin/adminapproveleaverequest"}>
                      Approve or Reject Supervisor's Leave Requests
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
export default AdminHome;