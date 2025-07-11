import { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import leaveUrl from "../../Api/leaveRequest";
import { adminUrl, serverUrl } from "../../APIs/Base_UrL";
import { supervisorurl } from "../../APIs/Base_UrL";

function AdminApproveLeaveRequest() {
  const [leaveDatas, setleaveDatas] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [errorForRejection, setErrorForRejection] = useState("");
  const [askConfitrmationForApprove, setAskConfirmationForApprove] =
    useState(false);
  const [askConfitrmationForReject, setAskConfirmationForReject] =
    useState(false);
  const [successModalForApprove, setSuccessModalForApprove] = useState(false);
  const [successModalForReject, setSuccessModalForReject] = useState(false);
  const [atLeastOneChecked, setAtLeastOneChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue.adminId;

  const navigate = useNavigate();
  async function getLeaveData() {
    try {
      const response = await axios.get(`${serverUrl}/admin`);
      const leaveList = response.data;
      console.log(leaveList);
      const filteredLeaveList = leaveList.filter(
        (leave) => leave.status === "PENDING"
      );

      setleaveDatas(
        filteredLeaveList.map((leave) => ({
          ...leave,
          checked: false,
        }))
      );
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  }

  useEffect(() => {
    getLeaveData();
  }, []);

  useEffect(() => {
    // Check if at least one checkbox is checked
    const isChecked = leaveDatas.some((sheet) => sheet.checked);
    setSelectAllChecked(isChecked);
    setAtLeastOneChecked(isChecked);
    if (isChecked) {
      setErrorMessage("");
    }
  }, [leaveDatas]);
  // console.log("abc")
  function validateRejection() {
    if (rejectReason !== "") {
      setErrorForRejection("");
    }
  }

  useEffect(() => {
    validateRejection();
  }, [rejectReason]);

  // ask confirmation or trigger alert
  function approveLeaveFun() {
    if (atLeastOneChecked) {
      setAskConfirmationForApprove(true);
    } else {
      setErrorMessage("Please select at least one Leave Request!!");
    }
  }
  // ask confirmation or trigger alert
  function rejectLeaveFun() {
    if (atLeastOneChecked) {
      setAskConfirmationForReject(true);
    } else {
      setErrorMessage("Please select at least one Leave Request!!");
    }
  }

  // reset the timesheet
  function cancelLeaveFun() {
    navigate("/admin");
  }

  // update the timesheetCheckBox
  function handleCheckboxChange(id) {
    setleaveDatas((prevData) =>
      prevData.map((sheet) =>
        sheet.id === id ? { ...sheet, checked: !sheet.checked } : sheet
      )
    );
  }

  async function approveSaveConfirmation() {
    setAskConfirmationForApprove(false);

    // Filter the leaves that are approved
    const approvedLeavesRequest = leaveDatas.filter(
      (leave) => leave.checked === true
    );

    console.log(approvedLeavesRequest);

    try {
      // Create an array of promises
      const updatePromises = approvedLeavesRequest.map(async (data) => {
        // Perform the PUT request
        const response = await axios.put(
          `${serverUrl}/supervisor/leave-requests/${data.id}/approve?adminId=${adminId}`
        );
      });

      // Wait for all the promises to complete
      setSuccessModalForApprove(true);
      console.log("abc");
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  }
  function closeSuccessModal() {
    setSuccessModalForApprove(false);
    getLeaveData();
  }

  // cancel the approvel
  function approveCancelConfirmation() {
    setAskConfirmationForApprove(false);
  }

  // reject the timesheet
  async function rejectSaveConfirmation() {
    // First validate the rejection reason
    if (!rejectReason) {
      // Set the error message if no reason is selected
      setErrorForRejection("Please select the reject reason");
      // Do not proceed with the rejection process
      return;
    }

    setAskConfirmationForReject(false);
    const rejectLeaves = leaveDatas.filter((leave) => leave.checked === true);

    try {
      // Update the status of rejected leaves and track their IDs
      const updates = rejectLeaves.map(async (data) => {
        // Update the leave object with rejection reason

        // Make a PUT request to update the status of the leave in the API
        const response = await axios.put(
          `${serverUrl}/supervisor/leave-requests/${data.id}/reject?adminId=${adminId}&reasonForRejection=${rejectReason}`
        );
      });

      setSuccessModalForReject(true);
    } catch (error) {
      console.log("API error", error);
    }
  }

  function closeRejectModal() {
    setSuccessModalForReject(false);
    getLeaveData();
  }

  // reject cancel
  function rejectCancelConfirmation() {
    setAskConfirmationForReject(false);
  }

  // function goToLeaveDetails(id, check) {

  //   if (check) {
  //     console.log(id)
  //     navigate('/admin/leavedetails/' + id)
  //   } else {
  //     setErrorMessage("Please select the person you wish to view !!!")
  //   }

  //   console.log(id)

  // }

  function selectAllCheckbox(event) {
    const check = event.target.checked;
    setSelectAllChecked(check);
    setleaveDatas((prevData) =>
      prevData.map((data) => ({
        ...data,
        checked: check,
      }))
    );
  }

  return (
    <>
      <div className="ti-background-clr">
        {leaveDatas.length > 0 ? (
          <Container>
            <div className="py-3 ">
              <p className=" text-center spr-approval-title ">Leave List</p>
            </div>
            {/* without select timesheet error  */}
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            {/* table head */}
            <div className="table-responsive">
              <table className="table table-bordered   table-hover border border-1 border-black">
                <thead className="">
                  <tr className="text-center spr-approval-header">
                    <th>
                      {" "}
                      <input
                        className="me-1"
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={selectAllCheckbox}
                      />
                      Select{" "}
                    </th>
                    <th>Supervisor Id</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>No Of Days Leave</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {/* table body */}
                  {leaveDatas
                    ? leaveDatas.map((sheet) => (
                        <tr key={sheet.id} className="text-center">
                          <td>
                            <input
                              type="checkbox"
                              name="approvalchkLeave"
                              checked={sheet.checked}
                              onChange={() => handleCheckboxChange(sheet.id)}
                            ></input>
                          </td>
                          <td>{sheet.supervisorId}</td>
                          <td>{sheet.reason}</td>
                          <td>{sheet.startDate}</td>
                          <td>{sheet.endDate}</td>
                          <td>{sheet.noOfDays}</td>
                          <td>{sheet.comments}</td>
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>
            </div>
            {/* buttons for approvel page */}
            <div className="d-flex justify-content-around flex-wrap">
              <button className="btn btn-success  w-auto" onClick={approveLeaveFun}>
                Approve
              </button>
              <button className="btn btn-danger w-auto" onClick={rejectLeaveFun}>
                Reject
              </button>
              <button
                className="btn btn-secondary w-auto"
                onClick={cancelLeaveFun}
              >
                Cancel
              </button>
            </div>
          </Container>
        ) : (
          <div className="no-timesheet">
            <h3>No Submitted Leave Request</h3>
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

        {/* confirmation modal for approvel */}
        <div className="approveModal">
          <Modal show={askConfitrmationForApprove}>
            <Modal.Body>Do you want to approve this leave request?</Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={approveCancelConfirmation}>
                Cancel
              </Button>
              <Button variant="primary" onClick={approveSaveConfirmation}>
                Approve
              </Button>
            </Modal.Footer>
          </Modal>
          {/* modal for success approvel */}
          <Modal
            className="custom-modal"
            style={{ left: "50%", transform: "translateX(-50%)" }}
            dialogClassName="modal-dialog-centered"
            show={successModalForApprove}
          >
            <div className="d-flex flex-column modal-success p-4 align-items-center ">
              <img
                src={successCheck}
                className="img-fluid mb-4"
                alt="successCheck"
              />
              <p className="mb-4 text-center">
                The leave request has been approved.
              </p>
              <button
                className="btn  w-100 text-white"
                onClick={closeSuccessModal}
                style={{ backgroundColor: "#5EAC24" }}
              >
                Close
              </button>
            </div>
          </Modal>

          {/* confirmation modal for rejects */}

          <Modal show={askConfitrmationForReject}>
            <Modal.Header>Are you sure you want to reject ?</Modal.Header>
            <Modal.Body>
              <div>
                <label htmlFor="reject-reason" className="pe-1">
                  <span style={{ color: "red" }}>*</span> Select The Reason For
                  Reject :
                </label>

                <select
                  id="reject-reason"
                  name="rejectReason"
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                  }}
                  value={rejectReason}
                >
                  <option value="">Select</option>
                  <option value="excessive requests">Excessive Requests</option>
                  <option value="busy periods">Busy Periods</option>
                  <option value="incomplete work">Incomplete Works</option>
                  <option value="policy violations">Policy Violations</option>
                </select>
              </div>
              <div className="text-danger  m-2">
                {errorForRejection ? errorForRejection : ""}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={rejectCancelConfirmation}>
                Cancel
              </Button>
              <Button variant="danger" onClick={rejectSaveConfirmation}>
                Reject
              </Button>
            </Modal.Footer>
          </Modal>

          {/* modal for leave request reject */}
          <Modal
            className="custom-modal"
            style={{ left: "50%", transform: "translateX(-50%)" }}
            dialogClassName="modal-dialog-centered"
            show={successModalForReject}
          >
            <div className="d-flex flex-column modal-success p-4 align-items-center ">
              <img
                src={successCheck}
                className="img-fluid mb-4"
                alt="successCheck"
              />
              <p className="mb-4 text-center">
                The leave request has been rejected.
              </p>
              <button
                className="btn  w-100 text-white"
                onClick={closeRejectModal}
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

export default AdminApproveLeaveRequest;
