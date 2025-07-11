import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateAdmin from "../SuperAdmin/CreateAdmin/CreateAdmin.js";
import SearchAdmin from "../SuperAdmin/SearchAdmin/SearchAdmin.js";
import AdminEdit from "../SuperAdmin/EditAdmin/AdminEdit.js";
import SuperadminHome from "../SuperAdmin/Navbar/SuperAdminNav.js";
import AdminDetailsView from "../SuperAdmin/SearchAdmin/AdminDetailsView.js";
import EditTimesheet from "../Supervisor/Approval/ModifyEmployeeTimesheet.js";
import SupervisorEmployeeApproveTimesheet from "../Supervisor/Approval/ApproveTimesheet.js";
import SupervisorHome from "../Supervisor/Home/SupervisorHome.js";
import EmployeeEditTimesheet from "../Employee/Edit/EmployeeEditTimesheet.js";
import EmployeeEditLeaveRequest from "../Employee/EditLeaveRequest/EmployeeEditLeaveRequest.js";
import SupervisorEditTimesheet from "../Supervisor/EditTimesheet/SupervisorEditTimesheet.js";
import SupervisorEditLeaveRequest from "../Supervisor/EditLeaveRequest/SupervisorEditLeaveRequest.js";
import SupervisorViewApprovedLeaveRequests from "../Supervisor/ViewRejectedLeaveRequest/SupervisorViewApprovedLeaveRequests.js";
import EmployeeHome from "../Employee/Home/EmployeeHome.js";
import RejectTimesheet from "../Employee/RejectTimesheet/RejectTimesheet.js";
import CreateEmployee from "../Admin/Employee/CreateEmployee.js";
import UploadEmployees from "../Admin/Employee/UploadEmployees.js";
import SearchEmployee from "../Admin/Employee/SearchEmployee.js";
import AdminHome from "../Admin/Home/AdminHome.js";
import AdminAddTimesheet from "../Admin/AddTimesheet/AdminAddTimesheet.js";
import AdminEditTimesheet from "../Admin/EditTimesheet/AdminEditTimesheet.js";
import AdminRejectTimesheet from "../Admin/ViewRejectedTimesheet/AdminRejectTimesheet.js";
import AdminEditLeaveRequest from "../Admin/EditLeaveRequest/AdminEditLeaveRequest.js";
import { AdminAddLeaveRequest } from '../Admin/AddLeaveRequest/AdminAddLeaveRequest.js';
import AdminViewApprovedLeaveRequests from "../Admin/ViewRejectedLeaveRequests/AdminViewApprovedLeaveRequests.js";
import AdminApproveLeaveRequest from "../Admin/ApproveLeaveRequest/AdminApproveLeaveRequest.js";
import AdminApproveDetails from "../Admin/ApproveLeaveRequest/AdminApproveDetails.js";
import EmployeeProfile from "../Admin/Employee/EmployeeProfile.js";
import EditEmployee from "../Admin/Employee/EditEmployee.js";
import EmployeeDetails from "../Admin/Employee/EmployeeDetails.js";
import Approvalpage from "../Admin/ApproveTimesheet/ApprovalPage.js";
import ApprovelBody from "../Admin/ApproveTimesheet/ApprovalPage.js";
import ModifyEmployeeTimesheet from "../Admin/ApproveTimesheet/ModifyEmployeeTimesheet.js";
import AddTimesheet from "../Employee/AddTimesheet/AddTimesheet.js";
import CreateProject from "../Admin/Employee/CreateProject.js";
import UpdateProjectDetails from "../Admin/Employee/UpdateProjectDetails.js";
import TimesheetLogin from "../Login/TimesheetLogin.js";
import Layout from "./Layout.js";
import SupAddTimesheet from "../Supervisor/AddTimesheet/AddTimesheet.js";
import SupRejectTimesheet from "../Supervisor/RejectTimesheet/RejectTimesheet.js";
import { EmployeeLeaveRequest } from "../Employee/LeaveRequest/EmployeeLeaveRequest.js";
import { useSelector } from "react-redux";

import { SupervisorLeaveRequest } from "../Supervisor/LeaveRequest/SupervisorLeaveRequest.js";
import SupervisorLeaveApproval from "../Supervisor/LeaveApproval/SupervisorLeaveApproval.js";
import SupervisorLeaveDetails from "../Supervisor/LeaveApproval/SupervisorLeaveDetails.js";
import ViewApprovedLeaveRequests from "../Employee/LeaveRequest/RejectLeaveRequest/EmployeeViewApprovedLeaveRequests.js"
import SuperadminLeaveApproval from "../SuperAdmin/LeaveApproval/SuperadminLeaveApproval.js";
import SuperadminApproveTimesheet from "../SuperAdmin/TimesheetApproval/ApproveTimesheet.js";
import SuperadminModifyAdminTimesheet from "../SuperAdmin/TimesheetApproval/ModifyEmployeeTimesheet.js";
import ViewRejectedLeaveRequests from "../Employee/LeaveRequest/RejectLeaveRequest/EmployeeViewRejectedLeaveRequest.js";
import AdminViewRejectedLeaveRequests from "../Admin/ViewRejectedLeaveRequests/AdminViewRejectedLeaveRequests.js";
import SupervisorViewRejectedLeaveRequests from "../Supervisor/ViewRejectedLeaveRequest/SupervisorViewRejectedLeaveRequests.js";
import HomePage from "../TimesheetDashboard/Homepage.js";


function RouterSetup() {
  const { isAuthenticated } = useSelector((state) => state.adminDetails.value);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";



  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/TimesheetLogin" element={<TimesheetLogin />} />
          <Route
            path="/superadmin"
            element={
              isLoggedIn ? (
                <Layout>
                  <SuperadminHome />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/superadmin/createadmin"
            element={
              isLoggedIn ? (
                <Layout>
                  <CreateAdmin />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/superadmin/searchadmin/admindetailsview/editadmin/:id"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminEdit />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/superadmin/searchadmin"
            element={
              isLoggedIn ? (
                <Layout>
                  <SearchAdmin />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/superadmin/searchadmin/admindetailsview/:id"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminDetailsView />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/superadmin/leaveapproval"
            element={
              isLoggedIn ? (
                <Layout>
                  <SuperadminLeaveApproval />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          {/* <Route path='/superadmin/leavedetails' element={isAuthenticated ? <Layout><SuperadminLeaveDetails /></Layout>:<TimesheetLogin/>} /> */}
          <Route
            path="/superadmin/timesheetapproval"
            element={
              isLoggedIn ? (
                <Layout>
                  <SuperadminApproveTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          {/* <Route path='/superadmin/leavedetails/:id' element={isAuthenticated ? <Layout><SuperadminLeaveDetails /></Layout>:<TimesheetLogin/>} /> */}
          <Route
            path="/superadmin/timesheetapproval/modifytimesheet/:id"
            element={
              isLoggedIn ? (
                <Layout>
                  <SuperadminModifyAdminTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />

          <Route
            path="/supervisor"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorHome />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/addtimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupAddTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/approvetimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorEmployeeApproveTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/editTimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorEditTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/modifyEmployeeTimesheet/:id"
            element={
              isLoggedIn ? (
                <Layout>
                  <EditTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/rejecttimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupRejectTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/leaverequest"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorLeaveRequest />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/editleaverequest"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorEditLeaveRequest />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />

          <Route
            path="/supervisor/leaveapproval"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorLeaveApproval />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/leavedetails/:id"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorLeaveDetails />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/viewrejectedleaverequests"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorViewRejectedLeaveRequests />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/supervisor/viewapprovedleaverequests"
            element={
              isLoggedIn ? (
                <Layout>
                  <SupervisorViewApprovedLeaveRequests />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          {/* employee */}
          <Route
            path="/employee"
            element={
              isLoggedIn ? (
                <Layout>
                  <EmployeeHome />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/employee/edittimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <EmployeeEditTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/employee/rejecttimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <RejectTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/employee/leaverequest"
            element={
              isLoggedIn ? (
                <Layout>
                  <EmployeeLeaveRequest />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/employee/editleaverequest"
            element={
              isLoggedIn ? (
                <Layout>
                  <EmployeeEditLeaveRequest />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />

          <Route
            path="/employee/addtimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <AddTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/employee/rejectedleaverequests"
            element={
              isLoggedIn ? (
                <Layout>
                  <ViewRejectedLeaveRequests />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/employee/approvedleaverequests"
            element={
              isLoggedIn ? (
                <Layout>
                  <ViewApprovedLeaveRequests />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          {/* admin */}
          <Route
            path="/admin"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminHome />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/adminaddtimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminAddTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/adminedittimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminEditTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/adminrejecttimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminRejectTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/approvalpage"
            element={
              isLoggedIn ? (
                <Layout>
                  <Approvalpage />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          {/* <Route path='/admin/approvalList' element={isAuthenticated ? <Layout><ApprovelBody /></Layout>:<TimesheetLogin/>} /> */}

          <Route
            path="/admin/approvetimesheet/modifyemployeetimesheet/:id"
            element={
              isLoggedIn ? (
                <Layout>
                  <ModifyEmployeeTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/createemployee"
            element={
              isLoggedIn ? (
                <Layout>
                  <CreateEmployee />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/uploademployees"
            element={
              isLoggedIn ? (
                <Layout>
                  <UploadEmployees />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/searchemployee"
            element={
              isLoggedIn ? (
                <Layout>
                  <SearchEmployee />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/employeeprofile"
            element={
              isLoggedIn ? (
                <Layout>
                  <EmployeeProfile />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/editemployee/:id"
            element={
              isLoggedIn ? (
                <Layout>
                  <EditEmployee />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/employeedetails"
            element={
              isLoggedIn ? (
                <Layout>
                  <EmployeeDetails />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/employeedetails/:id"
            element={
              isLoggedIn ? (
                <Layout>
                  <EmployeeDetails />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/createproject"
            element={
              isLoggedIn ? (
                <Layout>
                  <CreateProject />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/updateprojectdetails"
            element={
              isLoggedIn ? (
                <Layout>
                  <UpdateProjectDetails />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/adminedittimesheet"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminEditTimesheet />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/admineditleaverequest/"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminEditLeaveRequest />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/adminaddleaverequest"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminAddLeaveRequest />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />

          <Route
            path="/admin/adminapproveleaverequest"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminApproveLeaveRequest />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          {/* <Route path='/admin/adminapprovedetails/:id' element={ isAuthenticated ? <Layout><AdminApproveDetails /></Layout>:<TimesheetLogin/>} /> */}
          <Route
            path="/admin/adminviewrejectedleaverequests"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminViewRejectedLeaveRequests />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
          <Route
            path="/admin/adminviewapprovedleaverequests"
            element={
              isLoggedIn ? (
                <Layout>
                  <AdminViewApprovedLeaveRequests />
                </Layout>
              ) : (
                <TimesheetLogin />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default RouterSetup;
