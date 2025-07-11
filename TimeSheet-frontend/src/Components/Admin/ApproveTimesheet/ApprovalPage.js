import { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editTimesheetSuccessModal,
  editTimesheetRejectModal,
} from "../../features/modal";
import employeeSheetUrl from "../../Api/employeeEdit";
import { adminUrl, serverUrl } from "../../APIs/Base_UrL";
import { supervisorurl } from "../../APIs/Base_UrL";

function AdminApprovalPage() {
  const [timesheetDatas, setTimesheetDatas] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [rejectReason, setRejectReason] = useState(
    " Your timesheet has been rejected. Please reach out supervisor regarding your timesheet. "
  );
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
  const dispatch = useDispatch();
  // console.log(timesheetDatas)

  async function getTimesheet() {
    try {
      const timesheets = await axios.get(`${serverUrl}/admin/new`);
      const datasOfTimesheet = timesheets.data;

      let timehseetData = [];

      for (let empId in datasOfTimesheet) {
        const adminData = datasOfTimesheet[empId];
        const workingHours = adminData.workingHours;

        // Fetch startDate and endDate
        const startDate = workingHours[0].date;
        const endDate = workingHours[workingHours.length - 1].date;
        const totalHours = adminData.totalHours;
        const adminId = adminData.employeeId;
        timehseetData = [
          ...timehseetData,
          { adminId, startDate, endDate, totalHours, checked: false },
        ];
      }

      setTimesheetDatas(timehseetData.slice(-5));
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
  }

  useEffect(() => {
    getTimesheet();
  }, []);

  console.log(timesheetDatas);

  useEffect(() => {
    // Check if at least one checkbox is checked
    const isChecked = timesheetDatas.some((sheet) => sheet.checked);
    setSelectAllChecked(isChecked);
    setAtLeastOneChecked(isChecked);
    if (isChecked) {
      setErrorMessage("");
    }
  }, [timesheetDatas]);

  // ask confirmation or trigger alert
  function approvesheetFun() {
    if (atLeastOneChecked) {
      setAskConfirmationForApprove(true);
    } else {
      setErrorMessage("Please select at least one Timesheet!!");
    }
  }
  // ask confirmation or trigger alert
  function rejectsheetFun() {
    if (atLeastOneChecked) {
      setAskConfirmationForReject(true);
    } else {
      setErrorMessage("Please select at least one Timesheet!!");
    }
  }

  // reset the timesheet
  function cancelsheetFun() {
    navigate("/admin");
  }

  // update the timesheetCheckBox
  function handleCheckboxChange(adminId) {
    setTimesheetDatas((prevData) =>
      prevData.map((sheet) =>
        sheet.adminId === adminId
          ? { ...sheet, checked: !sheet.checked }
          : sheet
      )
    );
  }

  // timesheet approvel
  async function approveSaveConfirmation() {
    setAskConfirmationForApprove(false);
    const approvedSheets = timesheetDatas.filter(
      (sheet) => sheet.checked === true
    );
    console.log(approvedSheets);
    try {
      // Update the status of approved sheets and track their IDs
      const updates = approvedSheets.map(async (sheet) => {
        // Make a PUT request to update the status of the sheet in the API
        const response = await axios.put(
          `${serverUrl}/sup/api/working-hours/${sheet.adminId}/approve-range?startDate=${sheet.startDate}&endDate=${sheet.endDate}&adminId=${adminId}`
        );
        const responseData = response.data;

        if (responseData) {
          setSuccessModalForApprove(true);
        }
      });
    } catch (error) {
      console.log("API error", error);
    }
  }

  // cancel the approvel
  function approveCancelConfirmation() {
    setAskConfirmationForApprove(false);
  }

  // reject the timesheet
  async function rejectSaveConfirmation() {
    setAskConfirmationForReject(false);
    const rejectSheets = timesheetDatas.filter(
      (sheet) => sheet.checked === true
    );
    console.log(rejectSheets);
    try {
      // Update the status of approved sheets and track their IDs
      const updates = rejectSheets.map(async (sheet) => {
        // Update the status of the sheet locally
        const updatedSheet = { ...sheet, rejectionReason: rejectReason };

        // Make a PUT request to update the status of the sheet in the API
        const response = await axios.put(
          `${serverUrl}/sup/api/working-hours/${sheet.adminId}/reject-range?startDate=${sheet.startDate}&endDate=${sheet.endDate}&reason=${rejectReason}&adminId=${adminId}`
        );

        if (response.data) {
          setSuccessModalForReject(true);
        }
      });
    } catch (error) {
      console.log("API error", error);
    }
  }

  // reject cancel
  function rejectCancelConfirmation() {
    setAskConfirmationForReject(false);
  }

  function goEditPage(id, check, startDate, endDate) {
    if (check) {
      console.log(id);
      console.log(startDate);
      console.log(endDate);
      navigate("/admin/approvetimesheet/modifyemployeetimesheet/" + id, {
        state: { startDate, endDate },
      });
    } else {
      setErrorMessage("Please select the timesheet you wish to edit!!!");
    }
  }

  function selectAllCheckbox(event) {
    const check = event.target.checked;
    setSelectAllChecked(check);
    setTimesheetDatas((prevData) =>
      prevData.map((data) => ({
        ...data,
        checked: check,
      }))
    );
  }

  function closeSuccessModal() {
    setSuccessModalForApprove(false);
    getTimesheet();
  }

  function closeRejectModal() {
    setSuccessModalForReject(false);
    getTimesheet();
  }

  return (
    <div className="ti-background-clr p-3">
      {timesheetDatas.length > 0 ? (
        <Container>
          <div className="py-3 text-center">
            <p className="spr-approval-title" style={{color:"white"}}>Timesheet List</p>
          </div>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="table-responsive ap">
            <table className="table table-bordered table-hover border border-1 border-black ap1">
              <thead className="spr-approval-header text-center">
                <tr>
                  <th className="select-column text-center">
                    <input
                      className="me-1"
                      type="checkbox"
                      checked={selectAllChecked}
                      onChange={selectAllCheckbox}
                    />
                    <span className="d-inline-block">Select</span>
                  </th>
                  <th>Supervisor Id</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>No hrs Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {timesheetDatas.map((sheet) => (
                  <tr key={sheet.adminId} className="text-center">
                    <td>
                      <input
                        type="checkbox"
                        name="approvalchkTimesheet"
                        checked={sheet.checked}
                        onChange={() => handleCheckboxChange(sheet.adminId)}
                      />
                    </td>
                    <td>{sheet.adminId}</td>
                    <td>{sheet.startDate}</td>
                    <td>{sheet.endDate}</td>
                    <td>{sheet.totalHours}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          goEditPage(
                            sheet.adminId,
                            sheet.checked,
                            sheet.startDate,
                            sheet.endDate
                          )
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-center flex-wrap gap-2">
            <button className="btn btn-success w-auto" onClick={approvesheetFun}>
              Approve
            </button>
            <button className="btn btn-danger w-auto" onClick={rejectsheetFun}>
              Reject
            </button>
            <button className="btn btn-secondary w-auto" onClick={cancelsheetFun}>
                Cancel
            </button>
          </div>
        </Container>
      ) : (
        <div className="no-timesheet text-center">
          <h3>No Submitted Timesheet</h3>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Confirmation Modals */}
      <Modal show={askConfitrmationForApprove} centered>
        <Modal.Body>Do you want to approve these sheets?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={approveCancelConfirmation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={approveSaveConfirmation}>
            Approve
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={successModalForApprove} centered>
        <div className="text-center p-4">
          <p>Timesheets have been approved.</p>
          <Button className="btn-success w-100" onClick={closeSuccessModal}>
            Close
          </Button>
        </div>
      </Modal>

      <Modal show={askConfitrmationForReject} centered>
        <Modal.Body>
          Are you sure you want to reject these sheets?
          <textarea
            rows="4"
            className="form-control mt-2"
            placeholder="Enter reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
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

      <Modal show={successModalForReject} centered>
        <div className="text-center p-4">
          <p>Timesheets have been rejected.</p>
          <Button className="btn-success w-100" onClick={closeRejectModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminApprovalPage;
