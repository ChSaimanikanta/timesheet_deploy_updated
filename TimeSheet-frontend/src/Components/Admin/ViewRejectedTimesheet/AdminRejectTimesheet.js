import axios from "axios";
import employeeSheetUrl from "../../Api/employeeEdit";
import Select from "react-select";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";

import {
  submitAdminON,
  submitAdminOFF,
} from "../../features/submitAdminButton";
import { useSelector, useDispatch } from "react-redux";
import { adminUrl, serverUrl } from "../../APIs/Base_UrL";

function RejectTimesheet() {
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue.adminId;
  const [startSubmitDate, setStartSubmitDate] = useState("");
const [endSubmitDate, setEndSubmitDate] = useState("");
const [submitTimesheetStatus, setSubmitTimesheetStatus] = useState("");
const [submitadminId, setSubmitAdminId] = useState("");

  const [submitButtonState, setSubmitButtonState] = useState("");
  const [timesheetData, setTimesheetData] = useState([]);
  const [editableData, setEditableData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState("");
  const [uniqueProjectIds, setUniqueProjectIds] = useState("");
  const [projectDatas, setProjectDatas] = useState({});
  const [availableProjects, setAvailableProjects] = useState([]);
  const [error, setError] = useState("");
  const [workHourError, setWorkHourError] = useState("");
  let [totalWorkHours, setTotalWorkHours] = useState(0);
  const [editDataSaveConfirmation, setEditDataSaveConfirmation] =
    useState(false);
  const [saveModalForEmployeeRejectEdit, setSaveModalForEmployeeRejectEdit] =
    useState(false);
  const [rejectDataSubmitConfirmation, setRejectDataSubmitConfirmation] =
    useState(false);
  const [successModalForTimesheetApprove, setSuccessModalForTimesheetApprove] =
    useState(false);
  const [viewRejectReason, setViewRejectReason] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

useEffect(() => {
  async function getRejectTimesheet() {
    if (!adminId) {
      console.warn("Admin ID is missing.");
      return;
    }

    try {
      let today = new Date();
      let startDate, endDate;

      // ✅ Ensure correct timesheet period logic
      if (today.getDate() <= 15) {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 15);
      } else {
        startDate = new Date(today.getFullYear(), today.getMonth(), 16);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }

      // ✅ Prevent timezone shifts
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      // ✅ Use `toLocaleDateString('en-CA')` to maintain consistent formatting
      let formattedStartDate = startDate.toLocaleDateString("en-CA");
      let formattedEndDate = endDate.toLocaleDateString("en-CA");

      console.log("Fetching rejected timesheet:", formattedStartDate, "to", formattedEndDate);

      const response = await axios.get(
        `${serverUrl}/working-hours/${adminId}/range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );

      const datas = response.data;

      if (datas.length > 0) {
        let firstEntry = datas[0];
        let lastEntry = datas[datas.length - 1];

        setStartSubmitDate(firstEntry.date);
        setEndSubmitDate(lastEntry.date);
        setSubmitAdminId(firstEntry.employeeId);
        setSubmitTimesheetStatus(firstEntry.status);

        // ✅ Ensure rejection handling logic is correct
        if (firstEntry.status === "REJECTED") {
          const updatedData = datas.map((data) => ({
            ...data,
            rejectionReason: data.rejectionReason || "",
            status: "NEW",
          }));

          setTimesheetData(updatedData);
          setEditableData(updatedData);
          setViewRejectReason(firstEntry.rejectionReason || "");
          dispatch(submitAdminOFF(false));
        } else {
          dispatch(submitAdminON(true));
        }
      } else {
        setSubmitTimesheetStatus("No Data Submitted");
      }
    } catch (error) {
      console.error("Error fetching rejected timesheet data:", error);
    }
  }

  getRejectTimesheet();
}, [adminId, serverUrl, dispatch]);


  // console.log(timesheetData);

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
      adminId: adminId,
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

  async function editDataSaveConfirmationFun() {
    setEditDataSaveConfirmation(true);
  }

  async function rejectDataSubmitConfirmationFun() {
    if (!error) {
      setRejectDataSubmitConfirmation(true);
    }
  }

  function goToEmployeeHome() {
    navigate("/admin");
  }

  function editDataCancelFun() {
    setEditDataSaveConfirmation(false);
  }
  function rejectSubmitDataCancelFun() {
    setRejectDataSubmitConfirmation(false);
  }
  function rejectDataSumbitFun() {
    setRejectDataSubmitConfirmation(false);
    setSuccessModalForTimesheetApprove(true);
  }

  async function editDataSaveFun() {
    setEditDataSaveConfirmation(false);
  }


 const rejectDataSubmitFun = async () => {
  setRejectDataSubmitConfirmation(false);
  try {
    console.log("Submitting rejected timesheet data:", editableData);

    const response = await axios.put(`${serverUrl}/working-hours/update`, editableData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("API Response:", response.data);
    
    if (response.status === 200) {
      dispatch(submitAdminON(true));
      setSuccessModalForTimesheetApprove(true);
    } else {
      console.error("Unexpected API response:", response);
    }
  } catch (error) {
    console.error("Error submitting rejected timesheet data:", error.response?.data || error.message);
  }
};

  function closeSuccessModal() {
    setSuccessModalForTimesheetApprove(false);
    navigate("/admin");
  }

  return (
    <>
      <div className="ti-background-clr">
        {timesheetData.length > 0 ? (
          <div className="ti-data-field-container pt-4">
            <div>
              <p className="fs-4 text-danger ">Reject Timesheet</p>
            </div>

            <div className="p-1 my-2 border border-danger border-2 bg-light">
              <p>{viewRejectReason}</p>
            </div>

            <div className="d-flex justify-content-between">
              <div className="m-1">
                <label htmlFor="emp_id">Admin Id : </label>
                <input
                  type="text"
                  id="emp_id"
                  className="mx-1"
                  value={adminId}
                  readOnly
                />
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="m-1">
                <label htmlFor="fromDate">Start Date: </label>
                <input
                  type="text"
                  id="fromDate"
                  className="mx-1"
                  value={startSubmitDate}
                  readOnly
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="m-1">
                <label htmlFor="fromDate">End Date : </label>
                <input
                  type="text"
                  id="fromDate"
                  className="mx-1"
                  value={endSubmitDate}
                  readOnly
                />
              </div>
            </div>

            <div
              className=" border table-responsive border-1 rounded p-4 border-black my-4"
              style={{ position: "relative", zIndex: 1 }}
            >
              {error && (
                <div
                  style={{ color: "red", marginLeft: "20px", fontWeight: 900 }}
                >
                  {error}
                </div>
              )}
              <table className="table table-bordered border-dark text-center">
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
                            options={availableProjects.map((project) => ({
                              value: project,
                              label: project,
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
                  className="AddTimesheet btn btn-success ms-2 w-auto"
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
            <div>
              <span className="fw-bold">Total Hours Worked : </span>{" "}
              <span className="fw-bold">{totalWorkHours}</span>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success m-3 w-5"
                onClick={rejectDataSubmitConfirmationFun}
                style={{ width: "100px" }}
              >
                Submit
              </button>
              <button
                className="btn btn-secondary m-3"
                onClick={goToEmployeeHome}
                style={{ width: "auto" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="no-timesheet">
            <h3>No Rejected Timesheet Available</h3>
            <button
              className="btn btn-secondary w-auto"
              onClick={() => {
                navigate("/admin");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <Modal show={rejectDataSubmitConfirmation}>
          <Modal.Body>Do you want to Submit?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={rejectSubmitDataCancelFun}>
              Cancel
            </Button>
           <Button variant="success" onClick={rejectDataSubmitFun}>

              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="custom-modal"
          style={{ left: "50%", transform: "translateX(-50%)" }}
          dialogClassName="modal-dialog-centered"
          show={successModalForTimesheetApprove}
        >
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img
              src={successCheck}
              className="img-fluid mb-4"
              alt="successCheck"
            />
            <p className="mb-4 text-center">
              {" "}
              Your Timesheet has submitted for approval.
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
      </div>
    </>
  );
}

export default RejectTimesheet;
