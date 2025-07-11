import axios from "axios";
import employeeSheetUrl from "../../Api/employeeEdit";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import successCheck from "../../Image/checked.png";
import "./approvalPage.css";
import {
  editTimesheetSuccessModal,
  editTimesheetRejectModal,
} from "../../features/modal";
import { useLocation } from "react-router-dom";
import { admins_Url, adminUrl, serverUrl } from "../../APIs/Base_UrL";
function ModifyAdminTimesheet() {
  const [timesheetData, setTimesheetData] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const { startDate, endDate } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uniqueDates, setUniqueDates] = useState("");
  const [uniqueProjectIds, setUniqueProjectIds] = useState("");
  const [projectDatas, setProjectDatas] = useState({});
  const [availableProjects, setAvailableProjects] = useState([]);
  const [error, setError] = useState("");
  const [editableData, setEditableData] = useState([]);
  const [workHourError, setWorkHourError] = useState("");
  let [totalWorkHours, setTotalWorkHours] = useState(0);

  const [editApproveConfirmationModal, setEditApproveConfirmationModal] =
    useState(false);
  const [editRejectConfirmationModal, setEditRejectConfirmationModal] =
    useState(false);
  const [rejectReason, setRejectReason] = useState(
    "Please reach out superadmin  regarding your timesheet."
  );

  const editTimesheetSuccessModalValue = useSelector(
    (state) => state.modal.value.editTimesheetSuccessModalValue
  );
  const editTimesheetRejectModalValue = useSelector(
    (state) => state.modal.value.editTimesheetRejectModalValue
  );

  function editTimesheetApproveConfirmation() {
    setEditApproveConfirmationModal(true);
  }

  function editTimesheetApproveCancel() {
    setEditApproveConfirmationModal(false);
  }

  async function updateTimesheet() {
    try {
      // Use Promise.all to ensure all asynchronous requests complete before proceeding
      await Promise.all(
        editableData.map(async () => {
          let response = await axios.put(
            `${serverUrl}/admins/working-hours/update`,
            editableData
          );
        })
      );
    } catch (error) {
      console.log("error");
    }
  }

  async function editTimesheetApproveSave() {
    setEditApproveConfirmationModal(false);

    try {
      await updateTimesheet();

      await axios.put(
        `${serverUrl}/admins/working-hours/${id}/approve-range?startDate=${startDate}&endDate=${endDate}`
      );

      dispatch(editTimesheetSuccessModal(true));
    } catch (error) {
      console.log(error);
    }
  }

  function closeSuccessModal() {
    dispatch(editTimesheetSuccessModal(false));
    navigate("/superadmin/timesheetapproval");
  }

  function editTimesheetRejectConfirmation() {
    setEditRejectConfirmationModal(true);
  }

  function editTimesheetRejectCancel() {
    setEditRejectConfirmationModal(false);
  }

  async function editTimesheetRejectSave() {
    setEditRejectConfirmationModal(false);

    try {
      await updateTimesheet();

      await axios.put(
        `${serverUrl}/admins/working-hours/${id}/reject-range?startDate=${startDate}&endDate=${endDate}&reason=${rejectReason}`
      );

      dispatch(editTimesheetRejectModal(true));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${serverUrl}/admin/projects`);
        let projectDatas = response.data;
        let projectIds = projectDatas.map((project) => project.projectId);
        setAvailableProjects(projectIds);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const groupByProject = () => {
    const projectMap = {};
    timesheetData.forEach((entry) => {
      if (!projectMap[entry.projectId]) {
        projectMap[entry.projectId] = {};
      }
      projectMap[entry.projectId][entry.date] = entry.hours;
    });
    setProjectDatas(projectMap);
  };

  const spiltingProject = () => {
    const uniqueDates = [...new Set(timesheetData.map((item) => item.date))];
    const uniqueProjectIds = [
      ...new Set(timesheetData.map((item) => item.projectId)),
    ];
    setUniqueDates(uniqueDates);
    setUniqueProjectIds(uniqueProjectIds);
  };

  useEffect(() => {
    spiltingProject();
    groupByProject();
  }, [timesheetData]);

  async function getEditTimesheet() {
    const response = await axios.get(
      `${serverUrl}/admins/working-hours/${id}/range?startDate=${startDate}&endDate=${endDate}`
    );
    const datas = response.data;
    console.log(datas);
    setTimesheetData(datas);
    setEditableData(datas);
  }

  useEffect(() => {
    getEditTimesheet();
  }, [id, startDate, endDate]);

  function findOutDay(date) {
    const givenDate = new Date(date);
    const dayOftheweek = givenDate.toLocaleDateString("default", {
      weekday: "short",
    });
    return dayOftheweek;
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString("default", { month: "short" });
    return `${month} ${date.getDate()}`;
  };

  const getDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("default", { weekday: "short" });
  };

  const updateProject = (newProjectId, index) => {
    console.log(newProjectId);
    console.log(index);
    // Check if the new project ID already exists
    if (
      uniqueProjectIds.includes(newProjectId) &&
      uniqueProjectIds[index] !== newProjectId
    ) {
      setError("Project already in use.");
      return;
    } else {
      setError(""); // Clear error if valid
    }

    // Capture the old projectId before it changes
    const oldProjectId = uniqueProjectIds[index];

    setUniqueProjectIds((prevUniqueProjectIds) => {
      const newProjectIds = [...prevUniqueProjectIds];
      newProjectIds[index] = newProjectId;
      return newProjectIds;
    });

    setEditableData((prevEditableData) => {
      return prevEditableData.map((entry) => {
        if (entry.projectId === oldProjectId) {
          return { ...entry, projectId: newProjectId };
        }
        return entry;
      });
    });
  };

  const handleHoursChange = (projectId, date, newHours) => {
    // Allow only numeric input
    if (/^\d*$/.test(newHours)) {
      setEditableData((prevData) =>
        prevData.map((entry) =>
          entry.projectId === projectId && entry.date === date
            ? { ...entry, hours: Number(newHours) }
            : entry
        )
      );
      setWorkHourError("");
      // Calculate total hours for the date
      const totalHours = editableData
        .filter((entry) => entry.date === date)
        .reduce(
          (sum, entry) =>
            sum +
            (entry.projectId === projectId
              ? parseInt(newHours)
              : parseInt(entry.hours)),
          0
        );

      if (totalHours > 15) {
        setWorkHourError("Maximum work hours per day is 15.");
        setEditableData((prevData) =>
          prevData.map((entry) =>
            entry.projectId === projectId && entry.date === date
              ? { ...entry, hours: 0 }
              : entry
          )
        );
      }
    }
  };

  const addProjectRow = () => {
    const newProjectId = ""; // Placeholder for new project ID
    setUniqueProjectIds([...uniqueProjectIds, newProjectId]);

    // Add entries for the new project in editableData with 0 hours for each date
    const newEntries = uniqueDates.map((date) => ({
      employeeId: id,
      projectId: newProjectId,
      date: date,
      hours: 0,
    }));

    setEditableData((prevEditableData) => [...prevEditableData, ...newEntries]);
  };

  const deleteProjectRow = (index) => {
    const newUniqueProjectIds = [...uniqueProjectIds];
    const [removedProjectId] = newUniqueProjectIds.splice(index, 1);
    setUniqueProjectIds(newUniqueProjectIds);

    setEditableData((prevEditableData) =>
      prevEditableData.filter((entry) => entry.projectId !== removedProjectId)
    );
  };

  const calculateTotalWorkHours = () => {
    const total = editableData.reduce((acc, entry) => acc + entry.hours, 0);
    setTotalWorkHours(total);
  };

  useEffect(() => {
    calculateTotalWorkHours();
  }, [editableData]);

  function goToHomePage() {
    navigate("/superadmin/timesheetapproval");
  }

  function closeRejectModal() {
    dispatch(editTimesheetRejectModal(false));
    navigate("/superadmin/timesheetapproval");
  }

  return (
    <>
      {timesheetData && (
        <div className="AddTimesheet background-cl">
          <div className="ti-data-field-container pt-4">
            <div>
              <p className="sprAdmin-createAdmin-title " style={{color:"white"}}>Edit Timesheet</p>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex m-3">
                <label htmlFor="emp_id" style={{color:"white"}}>Admin Id : </label>
                <input
                  type="text"
                  id="emp_id"
                  className="mx-1"
                  value={id}
                  readOnly
                />
              </div>
              <div className="d-flex m-3">
                <label htmlFor="fromDate" style={{color:"white"}}>Start Date: </label>
                <input
                  type="text"
                  id="fromDate"
                  className="mx-1"
                  value={startDate}
                  readOnly
                />
              </div>
              <div className="d-flex m-3">
                <label htmlFor="fromDate" style={{color:"white"}} >End Date : </label>
                <input
                  type="text"
                  id="fromDate"
                  className="mx-1"
                  value={endDate}
                  readOnly
                />
              </div>
            </div>

            <div
              className=" border border-1 rounded p-4 border-black my-4"
              style={{ position: "relative", zIndex: 1, }}
            >
              {error && (
                <div
                  style={{ color: "red", marginLeft: "20px", fontWeight: 900 }}
                >
                  {error}
                </div>
              )}
              <table className="table table-bordered border-dark text-center met">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#c8e184" }}>Date</th>
                    {uniqueDates &&
                      uniqueDates.map((date) => (
                        <th style={{ backgroundColor: "#c8e184" }} key={date}>
                          {formatDate(date)}
                        </th>
                      ))}
                    <td style={{ backgroundColor: "#c8e184" }}></td>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: "#c8e184" }}>Day</th>
                    {uniqueDates &&
                      uniqueDates.map((date) => (
                        <td
                          key={date}
                          style={{
                            backgroundColor:
                              getDay(date).toLowerCase() === "sun"
                                ? "yellow"
                                : "#c8e184",
                          }}
                        >
                          {getDay(date)}
                        </td>
                      ))}
                    <td style={{ backgroundColor: "#c8e184" }}></td>
                  </tr>
                </thead>
                <tbody>
                  {uniqueProjectIds &&
                    uniqueProjectIds.map((projectId, index) => (
                      <tr key={index}>
                        <td
                          style={{ width: "120px", backgroundColor: "#e8fcaf" }}
                        >
                          <Select
                            value={
                              availableProjects.find(
                                (project) => project === projectId
                              )
                                ? { value: projectId, label: projectId }
                                : null
                            }
                            options={availableProjects.map((projectId) => ({
                              value: projectId,
                              label: projectId,
                            }))}
                            className="AddTimesheet my-2"
                            styles={{
                              control: (base) => ({
                                ...base,
                                minWidth: "150px", // Adjust the width here
                              }),
                              menu: (base) => ({
                                ...base,
                                minWidth: "150px", // Adjust dropdown menu width
                              }),
                            }}
                            onChange={(selectedOption) =>
                              updateProject(selectedOption.value, index)
                            }
                          />
                        </td>
                        {uniqueDates.map((date) => (
                          <td key={date} style={{ backgroundColor: "#e8fcaf" }}>
                            <input
                              type="text"
                              inputMode="numeric"
                              className="AddTimesheet form-control my-3 text-center"
                              min={0}
                              max={12}
                              placeholder="0"
                              disabled={
                                findOutDay(date).toLowerCase() === "sun"
                              }
                              value={
                                editableData.find(
                                  (entry) =>
                                    entry.projectId === projectId &&
                                    entry.date === date
                                )?.hours || ""
                              }
                              onChange={(e) =>
                                handleHoursChange(
                                  projectId,
                                  date,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        ))}
                        <td style={{ backgroundColor: "#e8fcaf" }}>
                          <button
                            type="button"
                            className="AddTimesheet btn btn-danger my-3"
                            onClick={() => deleteProjectRow(index)}
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="d-flex ">
                <button
                  type="button"
                  className="AddTimesheet btn btn-success ms-2"
                  onClick={addProjectRow}
                >
                  +
                </button>

                {workHourError && (
                  <div
                    className="mt-2"
                    style={{
                      color: "red",
                      marginLeft: "20px",
                      fontWeight: 900,
                    }}
                  >
                    {workHourError}
                  </div>
                )}
              </div>
            </div>
            <div >
              <span className="fw-bold" style={{color:"white"}}>Total Hours Worked : </span>{" "}
              <span className="fw-bold" style={{color:"white"}}>{totalWorkHours}</span>
            </div>
            <div className="d-flex">
              <button
                type="button"
                onClick={editTimesheetApproveConfirmation}
                className="btn btn-success m-3 "
                style={{ width: "100px" }}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={editTimesheetRejectConfirmation}
                className="btn btn-danger m-3 "
                style={{ width: "100px" }}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={goToHomePage}
                className="btn btn-secondary m-3 "
                style={{ width: "100px" }}
              >
                Cancel
              </button>
            </div>
          </div>
          <div>
            {/* modals for confirmation */}

            <Modal show={editApproveConfirmationModal}>
              <Modal.Body>Do you want to approve this timesheet?</Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={editTimesheetApproveCancel}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={editTimesheetApproveSave}>
                  Approve
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={editRejectConfirmationModal}>
              <Modal.Body>
                Do you want to reject this timesheet?
                <div className="textarea-container">
                  <textarea
                    rows="4"
                    cols="40"
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="mt-2 fixed-size-textarea"
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={editTimesheetRejectCancel}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={editTimesheetRejectSave}>
                  Reject
                </Button>
              </Modal.Footer>
            </Modal>

            {/* modal for editTimesheetsuccess approvel */}
            <Modal
              className="custom-modal"
              style={{ left: "50%", transform: "translateX(-50%)" }}
              dialogClassName="modal-dialog-centered"
              show={editTimesheetSuccessModalValue}
            >
              <div className="d-flex flex-column modal-success p-4 align-items-center ">
                <img
                  src={successCheck}
                  className="img-fluid mb-4"
                  alt="successCheck"
                />
                <p className="mb-4 text-center">Timesheet has been approved.</p>
                <button
                  className="btn  w-100 text-white"
                  onClick={closeSuccessModal}
                  style={{ backgroundColor: "#5EAC24" }}
                >
                  Close
                </button>
              </div>
            </Modal>

            {/* modal for editTimesheet reject */}
            <Modal
              className="custom-modal"
              style={{ left: "50%", transform: "translateX(-50%)" }}
              dialogClassName="modal-dialog-centered"
              show={editTimesheetRejectModalValue}
            >
              <div className="d-flex flex-column modal-success p-4 align-items-center ">
                <img
                  src={successCheck}
                  className="img-fluid mb-4"
                  alt="successCheck"
                />
                <p className="mb-4 text-center">Timesheet has been rejected.</p>
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
      )}
    </>
  );
}

export default ModifyAdminTimesheet;
