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
  const [isOpenEmployeeManagement, setIsOpenEmployeeManagement] =
    useState(false);
  const [isOpenProjectManagement, setIsOpenProjectManagement] = useState(false);

// Fetch timesheet submission data dynamically
// Fetch timesheet submission data dynamically
useEffect(() => {
  async function fetchTimesheetData() {
    if (!adminId) {
      console.warn("Admin ID is missing.");
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
        `${serverUrl}/working-hours/${adminId}/range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
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
        setSubmitAdminId(sortedData[0].employeeId);
        setStatusValue(sortedData[0].status);

        // ✅ Update submission status dynamically
        if (sortedData[0].status === "APPROVED" || sortedData[0].status === "REJECTED") {
          dispatch(submitAdminOFF(false));
        } else {
          dispatch(submitAdminON(true));
        }
      } else {
        setStatusValue("No Data Submitted");
      }
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
  }

  fetchTimesheetData();
}, [adminId, dispatch, serverUrl, submitAdminON, submitAdminOFF]);


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
          </div>

          <div className="right-details">
            {/* <div className="row text-center ti-home-notification">
              <div className="col   mx-5 my-2 p-2 ">
                Timesheet to be approved : {countTimesheet}
              </div>
              <div className="col  mx-5  my-2 p-2  ">Rejected Timesheets : {rejectTimesheetCount}</div>
            </div> */}

            {/* notification about leave  */}
            {/* <div className="row text-center ti-home-notification">
              <div className="col   mx-5 my-2 p-2 ">
                Leaves to be approved : {leavePending}
              </div>
              <div className="col  mx-5  my-2 p-2  "> */}
            {/* Rejected Leave Request : {rejectLeave} */}
            {/* </div> */}
            {/* </div> */}

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
                        <div className="d-flex align-items-center">
                          <p className="mb-0 me-2">STATUS:</p>
                          <button
                            className="view-btn p-2"
                            style={{
                              backgroundColor:
                                leave.status === "APPROVED"
                                  ? "green"
                                  : leave.status === "REJECTED"
                                    ? "red"
                                    : "blue",
                              color: "white",
                            }}
                          >
                            {leave.status}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminHome;
