import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import leaveUrl from "../../Api/leaveRequest";
import {  serverUrl } from "../../APIs/Base_UrL";

function AdminViewRejectedLeaveRequests() {
  const [rejectedLeaveRequests, setRejectedLeaveRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue.adminId;

  useEffect(() => {
    async function getRejectedLeaveRequests() {
      try {
        const response = await axios.get(`${serverUrl}/admin/leave-requests`);
        let rejectedOne = response.data.filter(
          (leave) => leave.status == "REJECTED"
        );
        setRejectedLeaveRequests(rejectedOne.slice(-3));
      } catch (error) {
        console.error("Error fetching rejected leave requests:", error);
        setErrorMessage(
          "Error fetching rejected leave requests. Please try again."
        );
      }
    }
    getRejectedLeaveRequests();
  }, []);
  console.log(rejectedLeaveRequests);
  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <div className="ti-background-clr">
      {rejectedLeaveRequests.length > 0 ? (
        <Container>
          <div className="py-3 ">
            <p className="text-center spr-approval-title" style={{color:"white"}}>
              Rejected Leave Requests
            </p>
          </div>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="table-responsive">
            <table className="table table-bordered table-hover border border-1 border-black">
              <thead className="">
                <tr className="text-center spr-approval-header">
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total No of Days</th>
                  <th>Reason for Rejection</th>
                </tr>
              </thead>
              <tbody>
                {rejectedLeaveRequests.map((leave) => (
                  <tr key={leave.id} className="text-center">
                    <td>{leave.reason}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.noOfDays}</td>
                    <td>{leave.reasonForRejection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </Container>
      ) : (
        <div className="no-timesheet w-auto">
          <h3>No Rejected Leave Request Available</h3>
          <button
            className="btn btn-secondary "
            onClick={() => {
              navigate("/admin");
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminViewRejectedLeaveRequests;
