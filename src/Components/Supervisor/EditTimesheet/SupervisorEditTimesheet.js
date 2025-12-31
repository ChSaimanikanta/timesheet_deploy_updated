import axios from "axios";
import Select from "react-select";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";

import { useSelector, useDispatch } from "react-redux";
import { submitON, submitOFF } from "../../features/submitBtn";
import { adminUrl, serverUrl, supervisorurl } from "../../APIs/Base_UrL";

function SupervisorEditTimesheet() {
  const supervisorValue = useSelector((state) => state.supervisorLogin.value);
  const supervisorId = supervisorValue.supervisorId;
  const [overallLength, setOverallLength] = useState("");
  const [inputs, setInputs] = useState({
    startDate: "",
    endDate: "",
    employeeId: "",
  });
  let [totalWorkHours, setTotalWorkHours] = useState(0);
  const [isTimesheetAvailable, setIsTimesheetAvailable] = useState(false);
  const [isSubmitTimesheet, setIsSubmitTimesheet] = useState(false);
  const [editableData, setEditableData] = useState([]);
  const [getValueFromLocal, setGetValueFromLocal] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [uniqueProjectIds, setUniqueProjectIds] = useState([]);
  const [projectDatas, setProjectDatas] = useState({});
  const [saveSuccessModalForTimesheet, setSaveSuccessModalForTimesheet] =
    useState(false);
  const [successModalForTimesheet, setSuccessModalForTimesheet] =
    useState(false);
  const [editDataSubmitConfirmation, setEditDataSubmitConfirmation] =
    useState(false);
  const [error, setError] = useState(""); // Error state
  const [workHourError, setWorkHourError] = useState("");

  const objectPositionRef = useRef(1);
  const navigate = useNavigate();
  let { isSubmit } = useSelector((state) => state.submitBtn.value);
  const dispatch = useDispatch();

  const loadRecentTimesheetData = () => {
    const savedTimesheetDataList =
      JSON.parse(localStorage.getItem(supervisorId)) || [];
    if (savedTimesheetDataList.length > 0) {
      const recentIndices = savedTimesheetDataList.slice(-3);
      setOverallLength(recentIndices.length);
      let data =
        recentIndices[recentIndices.length - objectPositionRef.current] || [];
      setGetValueFromLocal(data);
      setIsTimesheetAvailable(true);
      setEditableData(data);
      console.log(data);
    }
  };

  console.log(getValueFromLocal);

  function getInputs() {
    if (getValueFromLocal.length > 0) {
      let arrayLength = getValueFromLocal.length;
      let startDate = getValueFromLocal[0].date;
      let employeeId = getValueFromLocal[0].employeeId;
      let endDate = getValueFromLocal[arrayLength - 1].date;

      setInputs({
        startDate,
        endDate,
        employeeId,
      });
    }
  }

  useEffect(() => {
    getInputs();
  }, [getValueFromLocal]);

  console.log("project Data", projectDatas);

  useEffect(() => {
    loadRecentTimesheetData();
  }, []);

 useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Dynamically include the supervisorId in the URL
        const response = await axios.get(`${serverUrl}/admin/projects/supervisors/${supervisorId}`);
        
        // Access the projects array within the response data
        let projectDatas = response.data.projects;
  
        if (Array.isArray(projectDatas)) {
          let projectIds = projectDatas.map((projectId) => projectId); // Assuming each entry in projects is a project ID
          setAvailableProjects(projectIds);
        } else {
          console.error("Projects data is not an array:", projectDatas);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    fetchProjects();
  }, [supervisorId]);

  const groupByProject = () => {
    const projectMap = {};
    getValueFromLocal.forEach((entry) => {
      if (!projectMap[entry.projectId]) {
        projectMap[entry.projectId] = {};
      }
      projectMap[entry.projectId][entry.date] = entry.hours;
    });
    setProjectDatas(projectMap);
  };

  const spiltingProject = () => {
    const uniqueDates = [
      ...new Set(getValueFromLocal.map((item) => item.date)),
    ];
    const uniqueProjectIds = [
      ...new Set(getValueFromLocal.map((item) => item.projectId)),
    ];
    setUniqueDates(uniqueDates);
    setUniqueProjectIds(uniqueProjectIds);
  };

  useEffect(() => {
    spiltingProject();
    groupByProject();
  }, [getValueFromLocal]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString("default", { month: "short" });
    return `${month} ${date.getDate()}`;
  };

  const getDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("default", { weekday: "short" });
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

  const goToPreviousPage = () => {
    console.log(objectPositionRef.current, "my");
    if (objectPositionRef.current > 3) return; // Prevent going beyond 3
    objectPositionRef.current += 1;
    loadRecentTimesheetData();
  };

  const goToNextPage = () => {
    if (objectPositionRef.current <= 1) return; // Prevent going beyond 3
    objectPositionRef.current -= 1;
    loadRecentTimesheetData();
  };

  const calculateTotalWorkHours = () => {
    const total = editableData.reduce((acc, entry) => acc + entry.hours, 0);
    setTotalWorkHours(total);
  };

  useEffect(() => {
    calculateTotalWorkHours();
  }, [editableData]);
  const updateProject = (newProjectId, index) => {
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

  const addProjectRow = () => {
    const newProjectId = ""; // Placeholder for new project ID
    setUniqueProjectIds([...uniqueProjectIds, newProjectId]);
  
    const newEntries = uniqueDates.map((date) => {
      const row = getValueFromLocal.find((entry) => entry.date === date); // Dynamically find the row
      const dateStr = date; // Use date directly from uniqueDates
  
      return {
        supervisorId: inputs.supervisorId,
        projectId: newProjectId,
        date: date,
        hours: row?.workHours?.[dateStr] || 0, // Dynamically access hours
      };
    });
  
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

  function findOutDay(date) {
    const givenDate = new Date(date);
    const dayOftheweek = givenDate.toLocaleDateString("default", {
      weekday: "short",
    });
    return dayOftheweek;
  }

  const updateTimesheetData = () => {
    if (!error) {
      const savedTimesheetDataList =
        JSON.parse(localStorage.getItem(supervisorId)) || [];
      const updatedTimesheetData = savedTimesheetDataList.map((data, index) => {
        if (
          index ===
          savedTimesheetDataList.length - objectPositionRef.current
        ) {
          return editableData;
        }
        return data;
      });

      localStorage.setItem(supervisorId, JSON.stringify(updatedTimesheetData));
      setSaveSuccessModalForTimesheet(true);

      console.log("editable", editableData);
    }
  };

  function submitConfirmation() {
    if (!error) {
      setEditDataSubmitConfirmation(true);
    }
  }

  const isUpToToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to midnight
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Normalize the input date to midnight
    return normalizedDate <= today; // Allow input for dates up to and including today
  };

  const isSubmitEnabled = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const fifteenthDate = new Date(today.getFullYear(), today.getMonth(), 15);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month
  
    // Allow submission only on the 15th or the last day of the current month
    return (
      today.toDateString() === fifteenthDate.toDateString() ||
      today.toDateString() === endOfMonth.toDateString()
    );
  };
  
  async function submitTimesheetData() {
    setEditDataSubmitConfirmation(false);

    try {
      let response = await axios.post(
        `${serverUrl}/sup/api/working-hours`,
        editableData
      );

      console.log(response.data);

      if (response.data) {
        // Show success modal
        const status = response.data[0].status;
        setSuccessModalForTimesheet(true);
        dispatch(submitON(true));
        setIsSubmitTimesheet(true);
        // Remove the submitted data from local storage
        const savedTimesheetDataList =
          JSON.parse(localStorage.getItem(supervisorId)) || [];
        const updatedTimesheetData = savedTimesheetDataList.filter(
          (_, index) =>
            index !== savedTimesheetDataList.length - objectPositionRef.current
        );
        localStorage.setItem(`isSubmitOn${supervisorId}`, "true");
        localStorage.setItem(
          `startSubmitDate${supervisorId}`,
          inputs.startDate
        );
        localStorage.setItem(`endSubmitDate${supervisorId}`, inputs.endDate);
        localStorage.setItem(
          `submitSupervisorId${supervisorId}`,
          inputs.employeeId
        );
        localStorage.setItem(`statusValue${supervisorId}`, status);
        localStorage.setItem(
          supervisorId,
          JSON.stringify(updatedTimesheetData)
        );
      }
    } catch (error) {
      console.error("Error submitting timesheet data:", error);
    }
  }

  function closeSuccessModal() {
    setSuccessModalForTimesheet(false);
    navigate("/supervisor");
  }

  function closeSaveModal() {
    setSaveSuccessModalForTimesheet(false);
    navigate("/supervisor");
  }

  return (
    <>
      <div className="ti-background-clr">
        {isTimesheetAvailable ? (
          <div className="">
            <div>
              <div className="ti-data-field-container pt-4">
                <div>
                  <p className="sprAdmin-createAdmin-title" style={{ color: "white" }}>Edit Timesheet</p>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="m-1" style={{ display: "flex", alignItems: "center" }}>
                    <label htmlFor="fromDate" style={{ color: "white", marginRight: "8px" }}>
                      Start Date:
                    </label>
                    <input
                      type="text"
                      id="fromDate"
                      className="mx-1"
                      value={inputs.startDate}
                      readOnly
                    />
                  </div>

                  <div>
                    <button
                      className="btn btn-primary mx-2"
                      onClick={goToPreviousPage}
                      disabled={objectPositionRef.current >= overallLength <=1}
                    >
                      <i className="bi bi-caret-left-fill"></i> Backward
                    </button>
                    <button
                      className="btn btn-primary mx-2"
                      onClick={goToNextPage}
                      disabled={objectPositionRef.current <= 1}
                    >
                      Forward <i className="bi bi-caret-right-fill"></i>
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="m-1" style={{ display: "flex", alignItems: "center" }}>
                    <label htmlFor="fromDate" style={{ color: "white", marginRight: "8px" }}>
                      End Date:
                    </label>
                    <input
                      type="text"
                      id="fromDate"
                      className="mx-1"
                      value={inputs.endDate}
                      readOnly
                    />
                  </div>
                </div>

                <div
                  className="border table-responsive border-1 rounded p-4 border-black my-4"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  {error && (
                    <div
                      style={{
                        color: "red",
                        marginLeft: "20px",
                        fontWeight: 900,
                      }}
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
                            <th
                              style={{ backgroundColor: "#c8e184" }}
                              key={date}
                            >
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
          {/* Place the code you provided here for rendering each row */}
          <td
            style={{
              width: "120px",
              backgroundColor: "#e8fcaf",
            }}
          >
            <Select
              value={
                availableProjects.find((project) => project === projectId)
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
                  minWidth: "150px",
                }),
                menu: (base) => ({
                  ...base,
                  minWidth: "150px",
                }),
              }}
              onChange={(selectedOption) =>
                updateProject(selectedOption.value, index)
              }
            />
          </td>
          {uniqueDates.map((date) => (
            <td
              key={date}
              style={{ backgroundColor: "#e8fcaf" }}
            >
              <input
                type="text"
                inputMode="numeric"
                className="AddTimesheet form-control my-3 text-center w-auto"
                min={0}
                max={12}
                placeholder="0"
                disabled={
                  !isUpToToday(new Date(date)) || findOutDay(date).toLowerCase() === "sun"
                } // Logic for enabling/disabling inputs
                value={
                  editableData.find(
                    (entry) =>
                      entry.projectId === projectId &&
                      entry.date === date
                  )?.hours || ""
                }
                onChange={(e) =>
                  handleHoursChange(projectId, date, e.target.value)
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
                <div>
                  <span className="AddTimesheet fw-bold" style={{ color: "white" }}>
                    Total Hours Worked : {totalWorkHours}
                  </span>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary m-3 w-5"
                    onClick={updateTimesheetData}
                    style={{ width: "100px" }}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-success m-3 w-5"
                    onClick={submitConfirmation}
                    disabled={isSubmit || !isSubmitEnabled()} 
                    style={{ width: "100px" }}
                  >
                    Submit
                  </button>
                  <button
                    className="btn btn-secondary m-3 w-5"
                    onClick={() => navigate("/supervisor")}
                    style={{ width: "100px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-timesheet">
            <h3>No Timesheet Available</h3>
            <p>Please create a new one.</p>
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
        <Modal show={editDataSubmitConfirmation}>
          <Modal.Body>Do you want to Submit?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setEditDataSubmitConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={submitTimesheetData}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          className="custom-modal"
          style={{ left: "50%", transform: "translateX(-50%)" }}
          dialogClassName="modal-dialog-centered"
          show={successModalForTimesheet}
        >
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img
              src={successCheck}
              className="img-fluid mb-4"
              alt="successCheck"
            />
            <p className="mb-4 text-center">
              {" "}
              You Have Submitted Timesheet For Approval .
            </p>
            <p className="mb-4 text-center">
              <b>
                {" "}
                {inputs.startDate} To {inputs.endDate}{" "}
              </b>
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
        <Modal
          className="custom-modal"
          style={{ left: "50%", transform: "translateX(-50%)" }}
          dialogClassName="modal-dialog-centered"
          show={saveSuccessModalForTimesheet}
        >
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img
              src={successCheck}
              className="img-fluid mb-4"
              alt="successCheck"
            />
            <p className="mb-4 text-center">
              {" "}
              Your Timesheet Saved Successfully.
            </p>
            <button
              className="btn  w-100 text-white"
              onClick={closeSaveModal}
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

export default SupervisorEditTimesheet;
