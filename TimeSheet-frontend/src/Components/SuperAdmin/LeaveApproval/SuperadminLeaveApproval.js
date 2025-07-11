import { useEffect, useState } from "react";
import axios from 'axios';
import { Container } from "react-bootstrap";
import { Modal, Button } from 'react-bootstrap';
import successCheck from '../../Image/checked.png'
import { useNavigate } from "react-router-dom";
import SuperAdminNav from "../Navbar/SuperAdminNav";
import { admins_Url, serverUrl } from "../../APIs/Base_UrL";
import leaveUrl from "../../Api/leaveRequest"
import "./SuperadminLeaveApproval.css";
function SuperadminLeaveApproval() {
  const [leaveDatas, setleaveDatas] = useState([])
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [errorForRejection, setErrorForRejection] = useState('');
  const [askConfitrmationForApprove, setAskConfirmationForApprove] = useState(false)
  const [askConfitrmationForReject, setAskConfirmationForReject] = useState(false)
  const [successModalForApprove, setSuccessModalForApprove] = useState(false)
  const [successModalForReject, setSuccessModalForReject] = useState(false)
  const [atLeastOneChecked, setAtLeastOneChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  async function getLeaveData() {
    try {
      const response = await axios.get(`${serverUrl}/superadmin`);
      const datas = response.data;




      const filteredLeaveList = datas.filter(leave => leave.status === "PENDING");
      const leaveList = filteredLeaveList.slice(-5);

      setleaveDatas(leaveList.map((leave) => ({
        ...leave,
        checked: false,
      })));
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  }

  useEffect(() => {


    getLeaveData();
  }, [])



  useEffect(() => {
    // Check if at least one checkbox is checked
    const isChecked = leaveDatas.some((sheet) => sheet.checked);
    setSelectAllChecked(isChecked)
    setAtLeastOneChecked(isChecked);
    if (isChecked) {
      setErrorMessage('');
    }

  }, [leaveDatas]);

  function validateRejection() {

    if (rejectReason !== "") {

      setErrorForRejection("");

    }

  }

  useEffect(() => {
    validateRejection();
  }, [rejectReason])


  // ask confirmation or trigger alert
  function approveLeaveFun() {

    if (atLeastOneChecked) {
      setAskConfirmationForApprove(true);
    } else {
      setErrorMessage("Please select at least one Leave Request!!")
    }



  }
  // ask confirmation or trigger alert
  function rejectLeaveFun() {
    if (atLeastOneChecked) {
      setAskConfirmationForReject(true);
    } else {
      setErrorMessage("Please select at least one Leave Request!!")
    }



  }

  // reset the timesheet
  function cancelLeaveFun() {
    navigate('/superadmin')
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
    const approvedLeavesRequest = leaveDatas.filter((leave) => leave.checked === true);

    console.log(approvedLeavesRequest);

    try {
      // Create an array of promises
      const updatePromises = approvedLeavesRequest.map(async (admin) => {
        // Perform the PUT request
        const response = await axios.put(`${serverUrl}/superadmin/${admin.id}/approve`);

        if (response.data) {
          getLeaveData();
          // Show success modal
          setSuccessModalForApprove(true);
        }

      });




    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  }


  // cancel the approvel
  function approveCancelConfirmation() {
    setAskConfirmationForApprove(false);

  }
  console.log(rejectReason);
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
      const updates = rejectLeaves.map(async (leave) => {
        // Update the leave object with rejection reason


        // Make a PUT request to update the status of the leave in the API
        const response = await axios.put(`${serverUrl}/superadmin/${leave.id}/reject`, {
          reasonForRejection: rejectReason
        });

        if (response.data) {

          getLeaveData();
          setRejectReason("");
          // Show success modal
          setSuccessModalForReject(true);

        }


      });

      // // Wait for all updates to finish
      // const updatedLeaves = await Promise.all(updates);


    } catch (error) {
      console.log('API error', error);
    }
  }

  // reject cancel
  function rejectCancelConfirmation() {
    setAskConfirmationForReject(false);

  }



  function selectAllCheckbox(event) {
    const check = event.target.checked;
    setSelectAllChecked(check);
    setleaveDatas(prevData =>
      prevData.map(data => ({
        ...data,
        checked: check
      }))
    );

  }


  return (
    <>

      <div className="ti-background-clr">
        {leaveDatas.length > 0 ? (<Container>
          <div className="py-3 ">
            <p className=" text-center spr-approval-title " style={{color:"white"}}>Leave List</p>
          </div>
          {/* without select timesheet error  */}
          {errorMessage && <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>}
          {/* table head */}
          <div className="table-responsive ">
            <table className="table table-bordered table-hover border border-1 border-black ">
              <thead>
                <tr className="text-center spr-approval-header">
                  <th className="first1"> <input type="checkbox" checked={selectAllChecked} onChange={selectAllCheckbox} />Select </th>
                  <th>Admin Id</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>No Of Days Leave</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody >
                {/* table body */}
                {leaveDatas ? leaveDatas.map((sheet) => (
                  <tr key={sheet.id} className="text-center">
                    <td>
                      <input
                        type="checkbox"
                        name="approvalchkLeave"
                        checked={sheet.checked}
                        onChange={() => handleCheckboxChange(sheet.id)}
                      ></input>
                    </td>
                    <td>{sheet.adminId}</td>
                    <td>{sheet.reason}</td>
                    <td>{sheet.startDate}</td>
                    <td>{sheet.endDate}</td>
                    <td>{sheet.noOfDays}</td>
                    <td>{sheet.comments}</td>



                  </tr>
                )) : ""}


              </tbody>
            </table>
          </div>
          {/* buttons for approvel page */}
          <div className="d-flex justify-content-around no-wrap m-auto">
            <button className="btn btn-success m-2 w-auto" onClick={approveLeaveFun}>Approve</button>
            <button className="btn btn-danger m-2 w-auto" onClick={rejectLeaveFun}>Reject</button>
            <button className="btn btn-secondary m-2 w-auto" onClick={cancelLeaveFun} >Cancel</button>
          </div>
        </Container>) : (<div className="no-timesheet">
          <h3>No Submitted Leave Request</h3>
          <button className="btn btn-secondary " onClick={() => { navigate('/superadmin') }}>Cancel</button>

        </div>)}


        {/* confirmation modal for approvel */}
        <div className="approveModal">
          <Modal show={askConfitrmationForApprove}>

            <Modal.Body >Do you want to approve this leave request?</Modal.Body>

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
          <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForApprove}  >
            <div className="d-flex flex-column modal-success p-4 align-items-center ">
              <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
              <p className="mb-4 text-center">The leave request has been approved.</p>
              <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForApprove(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
            </div>
          </Modal>

          {/* confirmation modal for rejects */}

          <Modal show={askConfitrmationForReject}>
            <Modal.Header>
              Are you sure you want to reject ?
            </Modal.Header>
            <Modal.Body>

              <div>
                <label htmlFor="reject-reason" className="pe-1"><span style={{ color: 'red' }}>*</span> Select The Reason For Reject :</label>

                <select id="reject-reason" name="rejectReason" onChange={(e) => { setRejectReason(e.target.value) }} value={rejectReason}>
                  <option value="">Select</option>
                  <option value="excessive requests">Excessive Requests</option>
                  <option value="busy periods">Busy Periods</option>
                  <option value="incomplete work">Incomplete Works</option>
                  <option value="Policy Violations">Policy Violations</option>

                </select>

              </div>
              <div className="text-danger  m-2">{errorForRejection ? errorForRejection : ""}</div>
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
          <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForReject}  >
            <div className="d-flex flex-column modal-success p-4 align-items-center ">
              <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
              <p className="mb-4 text-center">The leave request has been rejected.</p>
              <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForReject(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
            </div>
          </Modal>



        </div>
      </div>

    </>
  )
}

export default SuperadminLeaveApproval;