import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl, supervisorurl } from "../../APIs/Base_UrL";

function SupervisorViewApprovedLeaveRequests() {
  const [approvedLeaveRequests, setApprovedLeaveRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const supervisorValue = useSelector((state) => state.supervisorLogin.value);
  const supervisorId = supervisorValue.supervisorId;

  useEffect(() => {
    async function getApprovedLeaveRequests() {
      try {
        const response = await axios.get(
          `${serverUrl}/supervisor/leave-requests`
        );

        let filteringSupervisorId = response.data.filter(
          (leave) => leave.supervisorId === supervisorId
        );
        let approvedOne = filteringSupervisorId.filter(
          (leave) => leave.status === "APPROVED"
        );
        setApprovedLeaveRequests(approvedOne.slice(-3));
      } catch (error) {
        console.error("Error fetching approved leave requests:", error);
        setErrorMessage(
          "Error fetching approved leave requests. Please try again."
        );
      }
    }
    getApprovedLeaveRequests();
  }, []);

  const handleCancel = () => {
    navigate("/supervisor");
  };

  return (
    <div className="ti-background-clr">
      {approvedLeaveRequests.length > 0 ? (
        <Container>
          <div className="py-3 ">
            <p
              className="text-center spr-approval-title"
              style={{ color: "white" }}
            >
              Approved Leave Requests
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedLeaveRequests.map((leave) => (
                  <tr key={leave.id} className="text-center">
                    <td>{leave.reason}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.noOfDays}</td>
                    <td>{leave.status}</td>
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
        <div className="no-timesheet">
          <h3>No Approved Leave Requests Available</h3>
          <button
            className="btn btn-secondary"
            onClick={() => {
              navigate("/supervisor");
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default SupervisorViewApprovedLeaveRequests;
