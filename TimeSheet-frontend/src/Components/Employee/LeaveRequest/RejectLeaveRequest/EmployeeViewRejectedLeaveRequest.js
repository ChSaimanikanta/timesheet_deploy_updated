import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { leaveRequest_Url, serverUrl } from "../../../APIs/Base_UrL";

function ViewRejectedLeaveRequests() {
  const [rejectedLeaveRequests, setRejectedLeaveRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const employeeValue = useSelector((state) => state.employeeLogin.value);
  const employeeId = employeeValue.employeeId;

  useEffect(() => {
    async function getRejectedLeaveRequests() {
      try {
        const response = await axios.get(
          `${serverUrl}/leaverequests/employee/${employeeId}`
        );

        let rejectedOne = response.data.filter(
          (leave) => leave.status === "REJECTED"
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

  const handleCancel = () => {
    navigate("/employee");
  };

  return (
    <div className="ti-background-clr">
      {rejectedLeaveRequests.length > 0 ? (
        <Container>
          <div className="py-3 ">
            <p className="text-center spr-approval-title"style={{color:"white", fontSize:"18px"}}> 
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
          <div className="d-flex justify-content-center">
            <button className="btn btn-secondary w-auto" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </Container>
      ) : (
        <div className="no-timesheet">
          <h3>No Rejected Leave Request Available</h3>
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigate("/employee");
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewRejectedLeaveRequests;
