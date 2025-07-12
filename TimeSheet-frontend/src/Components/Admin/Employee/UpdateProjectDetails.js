import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap"; // Importing Modal
import { useSelector } from "react-redux";
import "./UpdateProjectDetails.css";
import successCheck from "../../Image/checked.png";
import { adminUrl, employee_Url, serverUrl, supervisorurl } from "../../APIs/Base_UrL";
import './UpdateProjectDetails.css';
import Button from "react-bootstrap/Button";
const UpdateProjectDetails = () => {
  const adminValue = useSelector((state) => state.adminLogin.value);
  const adminId = adminValue.adminId;
  const { id } = useParams();
  const [availableProjects, setAvailableProjects] = useState([]);

  const [availableSupervisorIds, setAvailableSupervisorIds] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [editing, setEditing] = useState(false);
   const [showModal, setShowModal] = useState(false);

  const [updatedProject, setUpdatedProject] = useState({
    projectTitle: "",
    projectDescription: "",
    employeeTeamMembers: [{ employeeId: "", firstName: "" }],
    supervisorTeamMembers: [{ supervisorId: "", firstName: "" }],
  });



  const [showSaveModal, setShowSaveModal] = useState(false); // Modal state for save confirmation
  const [showArchiveModal, setShowArchiveModal] = useState(false); // Modal state for archive confirmation
  const [updateProjectSuccessModal, setUpdateProjectSuccessModal] =
    useState(false);
  const navigate = useNavigate();

  const fetchProjectDetails = async (projectId) => {
    if (projectId) {
      try {
        const response = await axios.get(
          `${serverUrl}/admin/projects/${projectId}`
        );
        const foundProject = response.data;

        if (foundProject) {
          setSearchResult(foundProject);
          setUpdatedProject({
            projectTitle: foundProject.projectTitle,
            projectDescription: foundProject.projectDescription,
            employeeTeamMembers: foundProject.employeeTeamMembers.map(
              (member) => member.employeeId
            ),
            supervisorTeamMembers: foundProject.supervisorTeamMembers.map(
              (supervisor) => supervisor.supervisorId
            ),
          });
        } else {
          setSearchResult(null);
        }
      } catch (error) {
        console.error("Error fetching project details:", error.message);
        setSearchResult(null);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjectDetails(projectId);
  };

  const handleClick = (e) => {
    e.preventDefault();
    fetchProjectDetails(projectId);
  };

  const handleEmployeeIdChange = (index, value) => {
    const updatedEmployeeTeamMembers = [...updatedProject.employeeTeamMembers];
    updatedEmployeeTeamMembers[index] = value;
    setUpdatedProject({
      ...updatedProject,
      employeeTeamMembers: updatedEmployeeTeamMembers,
    });
  };

  const handleSupervisorIdChange = (index, value) => {
    const updatedSupervisorTeamMembers = [
      ...updatedProject.supervisorTeamMembers,
    ];
    updatedSupervisorTeamMembers[index] = value;
    setUpdatedProject({
      ...updatedProject,
      supervisorTeamMembers: updatedSupervisorTeamMembers,
    });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  // const handleCancel = () => {
  //   navigate('/admin');
  // };

  const handleShowSaveModal = () => {
    setShowSaveModal(true); // Show save confirmation modal
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false); // Hide save confirmation modal
  };

  const handleSave = async () => {
    handleCloseSaveModal();
    const transformedProject = {
      projectTitle: updatedProject.projectTitle,
      projectDescription: updatedProject.projectDescription,
      employeeTeamMembers: updatedProject.employeeTeamMembers,
      supervisorTeamMembers: updatedProject.supervisorTeamMembers,
    };

    try {
      const response = await axios.put(
        `${serverUrl}/admin/projects/${projectId}?adminId=${adminId}`,
        transformedProject,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Fetch updated project details after saving
      fetchProjectDetails(projectId);
      setUpdateProjectSuccessModal(true); // Show success modal

      setEditing(false);
    } catch (error) {
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.log("No response from server. Please try again later.");
      } else {
        console.log("Error updating project details. Please try again.");
      }
    }
  };

  const handleAddTeamMember = () => {
    setUpdatedProject({
      ...updatedProject,
      employeeTeamMembers: [...updatedProject.employeeTeamMembers, ""],
    });
  };

  const handleRemoveTeamMember = (index) => {
    const updatedEmployeeTeamMembers = [...updatedProject.employeeTeamMembers];
    updatedEmployeeTeamMembers.splice(index, 1);
    setUpdatedProject({
      ...updatedProject,
      employeeTeamMembers: updatedEmployeeTeamMembers,
    });
  };

  const handleAddSupervisor = () => {
    setUpdatedProject({
      ...updatedProject,
      supervisorTeamMembers: [...updatedProject.supervisorTeamMembers, ""],
    });
  };

  const handleRemoveSupervisor = (index) => {
    const updatedSupervisorTeamMembers = [
      ...updatedProject.supervisorTeamMembers,
    ];
    updatedSupervisorTeamMembers.splice(index, 1);
    setUpdatedProject({
      ...updatedProject,
      supervisorTeamMembers: updatedSupervisorTeamMembers,
    });
  };

  const handleArchive = async () => {
    try {
      await axios.delete(
        `${serverUrl}/admin/projects/${projectId}?adminId=${adminId}`
      );
      // alert("Project archived successfully!");
      navigate("/admin");
    } catch (error) {
      alert("Error archiving project. Please try again.");
    }
    setShowModal(false);
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${serverUrl}/admin/projects`);
        if (Array.isArray(response.data)) {
          setAvailableProjects(response.data); // Assuming response.data is the array of project objects
        } else {
          console.error("Invalid response:", response.data);
          setAvailableProjects([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        setAvailableProjects([]); // Handle errors gracefully
      }
    };

    fetchProjects();
  }, []);

  const [availableEmployeeIds, setAvailableEmployeeIds] = useState([]);

  useEffect(() => {
    const fetchEmployeeIds = async () => {
      try {
        const response = await axios.get(`${serverUrl}/employee/getemployees`);
        if (Array.isArray(response.data)) {
          setAvailableEmployeeIds(response.data); // Assuming the response contains an array of employee IDs
        } else {
          console.error("Expected an array but got:", response.data);
          setAvailableEmployeeIds([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching employee IDs:", error.message);
        setAvailableEmployeeIds([]); // Handle errors by setting to an empty array
      }
    };

    const fetchSupervisorIds = async () => {
      try {
        const response = await axios.get(`${serverUrl}/supervisors`);
        if (Array.isArray(response.data)) {
          setAvailableSupervisorIds(response.data); // Valid array
        } else {
          console.error("Expected an array but got:", response.data);
          setAvailableSupervisorIds([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching supervisor IDs:", error.message);
        setAvailableSupervisorIds([]); // Fallback to empty array
      }
    };

    fetchEmployeeIds();
    fetchSupervisorIds();
  }, []);

  const combinedTeamMembers = availableSupervisorIds.concat(availableEmployeeIds);

  // State to manage selected ID
  const [selectedId, setSelectedId] = useState("");

  // Handle dropdown value change
  const handleSelectionChange = (value) => {
    setSelectedId(value);
  };

  return (
    <>
      <div className="container project-update-container"> {/* Renamed container for clarity */}
        <div className="row">
          <div className="col d-flex project-search-form-container"> {/* Renamed container */}
            <form onSubmit={handleSearch} className="w-100">
              <p className="sprAdmin-createAdmin-title mb-4" style={{ color: "white" }}>Search Project</p>
              <div className="container">
  <div className="row mb-2 align-items-center">
    <div className="col-12 col-md-auto mb-2 mb-md-0">
      <label
  className="project-id-label"
  htmlFor="projectId"
  style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}
>
  Select Project ID:
</label>

    </div>

    <div className="col-12 col-md-6 mb-2 mb-md-0">
      <select
        id="projectId"
        className="form-control"
        value={projectId || ""}
        onChange={(e) => setProjectId(e.target.value)}
      >
        <option value="" disabled>
          Select a Project ID
        </option>
        {availableProjects.map((project) => (
          <option key={project.projectId} value={project.projectId}>
            {project.projectId} - {project.projectTitle}
          </option>
        ))}
      </select>
    </div>

    <div className="col-12 col-md-auto">
      <button
        type="button"
        className="btn btn-primary w-100 w-md-auto"
        onClick={handleClick}
      >
        Search
      </button>
    </div>
  </div>
</div>



            </form>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col project-details-form-container">
            {searchResult && (
              <form>
                <div className="project-details-container">
                  <div className="project-details-header">
                    <h3>Project Details</h3>
                    <div className="button">
                      {!editing && (
                        <button className="btn btn-primary" onClick={handleEdit}>
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <p>
                    <strong>Project Title:</strong>{" "}
                    {editing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={updatedProject.projectTitle}
                        onChange={(e) =>
                          setUpdatedProject({
                            ...updatedProject,
                            projectTitle: e.target.value,
                          })
                        }
                      />
                    ) : (
                      searchResult.projectTitle
                    )}
                  </p>
                  <p>
                    <strong>Project Description:</strong>{" "}
                    {editing ? (
                      <textarea
                        className="form-control"
                        value={updatedProject.projectDescription}
                        onChange={(e) =>
                          setUpdatedProject({
                            ...updatedProject,
                            projectDescription: e.target.value,
                          })
                        }
                      />
                    ) : (
                      searchResult.projectDescription
                    )}
                  </p>

                  {editing ? (
                    <>
                      <div>
                        <strong>Team Members</strong>
                        {updatedProject.employeeTeamMembers.map((employee, index) => (
                          <div key={index} className="mb-3">
                            <select
                              className="form-control"
                              value={employee || ""}
                              onChange={(e) => handleEmployeeIdChange(index, e.target.value)}
                            >
                              <option value="" disabled>
                                Select an Employee ID
                              </option>
                              {availableEmployeeIds
                                .filter(
                                  (employeeOption) =>
                                    !updatedProject.employeeTeamMembers.some(
                                      (selectedEmployee, selectedIndex) =>
                                        selectedEmployee === employeeOption.employeeId && selectedIndex !== index
                                    ) &&
                                    !updatedProject.supervisorTeamMembers.includes(employeeOption.employeeId)
                                )
                                .map((employeeOption) => (
                                  <option key={employeeOption.employeeId} value={employeeOption.employeeId}>
                                    {employeeOption.employeeId} - {employeeOption.firstName} {employeeOption.lastName} (Employee)
                                  </option>
                                ))}

                            </select>
                            <div className="d-flex align-items-center gap-2 mt-2">
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleRemoveTeamMember(index)}
                                disabled={updatedProject.employeeTeamMembers.length <= 1} // Disable when only one team member
                              >
                                Remove
                              </button>
                              {index === updatedProject.employeeTeamMembers.length - 1 && (
                                <button
                                  type="button"
                                  className="btn btn-success"
                                  onClick={handleAddTeamMember}
                                >
                                  Add Team Member
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>





                      <br />
                      <div>
                        <strong>Supervisor Employees</strong>
{updatedProject.supervisorTeamMembers.map((supervisor, index) => (
  <div key={index} className="mb-3">
    <select
      className="form-control"
      value={supervisor || ""}
      onChange={(e) => handleSupervisorIdChange(index, e.target.value)}
    >
      <option value="" disabled>
        Select a Supervisor ID
      </option>

      {(() => {
        const originalSupervisors = combinedTeamMembers
          .filter((member) => !!member.supervisorId)
          .map((member) => member.supervisorId);

        return combinedTeamMembers
          // Remove duplicate members based on ID
          .filter((member, index, self) => {
            const id = member.supervisorId || member.employeeId;
            return index === self.findIndex(
              (m) => (m.supervisorId || m.employeeId) === id
            );
          })

          // Prepare label for each member
          .map((member) => {
            const id = member.supervisorId || member.employeeId;
            const isOriginallySupervisor = originalSupervisors.includes(id);

            const roleLabel = isOriginallySupervisor ? 'Supervisor' : 'Employee';

            return {
              id,
              label: `${id} - ${member.firstName} ${member.lastName} (${roleLabel})`
            };
          })

          // Render options
          .map((option, index) => (
            <option key={`${option.id}-${index}`} value={option.id}>
              {option.label}
            </option>
          ));
      })()}
    </select>

    <div className="d-flex align-items-center gap-2 mt-2">
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => handleRemoveSupervisor(index)}
        disabled={updatedProject.supervisorTeamMembers.length <= 1}
      >
        Remove
      </button>

      {index === updatedProject.supervisorTeamMembers.length - 1 && (
        <button
          type="button"
          className="btn btn-success"
          onClick={handleAddSupervisor}
        >
          Add Supervisor
        </button>
      )}
    </div>
  </div>
))}

                      </div>



                      <br />
                    </>
                  ) : (
                    <>
                      {searchResult.employeeTeamMembers && (
                        <div>
                          <strong>Team Members</strong>
                          {searchResult.employeeTeamMembers.map((member, index) => (
                            <p key={index}>
                              {member.employeeId} - {member.firstName}
                            </p>
                          ))}
                        </div>
                      )}
                      <br />
                      {searchResult.supervisorTeamMembers && (
                        <div>
                          <strong>Supervisors</strong>
                          {searchResult.supervisorTeamMembers.map(
                            (supervisor, index) => (
                              <p key={index}>
                                {supervisor.supervisorId} - {supervisor.firstName}
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {editing && (
                    <div className="d-flex justify-content-end mb-3">
                      <button
                        type="button"
                        className="btn btn-success mx-2"
                        onClick={handleShowSaveModal}
                      >
                        Save
                      </button>
                       <button
        type="button"
        className="btn btn-danger mx-2"
        onClick={() => setShowModal(true)}
      >
        Delete
      </button>
                      {showModal && (
  <div
    className="modal show fade d-block"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to Delete this project?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleArchive}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

                      <button
                        type="button"
                        className="btn btn-secondary mx-2"
                        onClick={() => {
                          navigate("/admin");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                </div>


              </form>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          className="AddTimesheet btn btn-secondary m-3"
          style={{ width: "100px" }}
          onClick={() => {
            navigate("/admin");
          }}
        >
          Cancel
        </button>
      </div>

      {/* Save Confirmation Modal */}
      <Modal show={showSaveModal} onHide={handleCloseSaveModal} centered>
        <Modal.Body>
          <p>Are you sure you want to save the changes to this project?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSaveModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        className="custom-modal"
        style={{
          top: "10%",  // Adjust the percentage as needed
          left: "50%",
          transform: "translateX(-50%)",
        }}
        dialogClassName="modal-dialog-top"
        show={updateProjectSuccessModal}
      >
        <div className="d-flex flex-column modal-success p-4 align-items-center">
          <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
          <p className="mb-4 text-center">Your Project Updated Successfully</p>
          <button
            className="btn w-100 text-white"
            onClick={() => {
              setUpdateProjectSuccessModal(false);
              fetchProjectDetails(projectId);
            }}
            style={{ backgroundColor: "#5EAC24" }}
          >
            Close
          </button>
        </div>
      </Modal>

    </>
  );
};

export default UpdateProjectDetails;
