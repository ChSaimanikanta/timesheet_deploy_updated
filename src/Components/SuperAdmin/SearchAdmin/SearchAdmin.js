import "./searchadmin.css";
import url from "../../Api/data";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { successModal, deleteSuccessModal } from "../../features/modal";
import { Modal, Button } from "react-bootstrap";
import successCheck from "../../Image/checked.png";
import SuperAdminNav from "../Navbar/SuperAdminNav";
import { admins_Url, serverUrl } from "../../APIs/Base_UrL";

function SearchAdmin() {
  // admin List
  const [adminList, setAdminList] = useState([]);
  // for search adminlist
  const [searchQuery, setSearchQuery] = useState("");

  // active row
  const [activeRow, setActiveRow] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // create admin success modal
  const modal = useSelector((state) => state.modal.value);
  const showModal = modal.showSuccessModal;
  const deleteSuccessModalValue = modal.deleteSuccessModalValue;

  //   fetch the data from api
  async function getDataFromApi() {
    try {
      let response = await axios.get(`${serverUrl}/admins/getadmins`); //getadmin backend url
      const array = response.data;
      setAdminList(array);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    // Otherwise, fetch and display the details of the last admin added by default
    getDataFromApi();
  }, []);

  function handleAdminClick(admin) {
    setActiveRow(admin.adminId);
    navigate("/superadmin/searchadmin/admindetailsview/" + admin.adminId);
    console.log(admin);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Searching admin based on matching starting characters of the name or id
  const filteredAdminList = adminList.filter(
    (admin) =>
      admin.firstName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      admin.adminId.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      admin.emailId.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="ti-background-clr">
        <div className="ti-data-field-container row m-auto mt-5">
          {/* admin list view and search */}
          <div className="col ">
            <div
              className="d-flex justify-content-between align-items-center flex-wrap p-2 prime-1"
              style={{ backgroundColor: "white" }}
            >
              <p className="fw-bold flex-grow-1 text-center m-0">ADMIN USERS</p>
              <div>
                <form className="no-focus-outline" onSubmit={(e) => e.preventDefault()}>
                  <input
                    className="w-75 border-0"
                    type="search"
                    placeholder="search admin"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  ></input>
                  <button className="border-0 bg-white" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
            </div>
            <div className="sprAdmin-admin-list table-responsive prime-2">
              <table className="table custom-table table-hover mt-0 sadmin">
                <thead className="sprAdmin-searchAdmin-table-header">
                  <tr className="text-center text-white">
                    <th scope="col">Admin Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminList.length > 0 && searchQuery ? (
                    filteredAdminList.map((d) => (
                      <tr
                        key={d.adminId}
                        className={`text-center adminList-column ${activeRow === d.adminId ? "table-active" : ""
                          }`}
                        onClick={() => handleAdminClick(d)}
                      >
                        <td>{d.adminId}</td>
                        <td>{d.firstName}</td>
                        <td>{d.emailId}</td>
                      </tr>
                    ))
                  ) : (
                    searchQuery && (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No records found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-secondary w-auto"
              onClick={() => {
                navigate("/superadmin");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div>
        <Modal
          className="custom-modal"
          style={{ left: "50%", transform: "translateX(-50%)" }}
          dialogClassName="modal-dialog-centered"
          show={showModal}
        >
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img
              src={successCheck}
              className="img-fluid mb-4"
              alt="successCheck"
            />
            <p className="mb-4 text-center">
              Admin User Profile Created Successfully
            </p>
            <button
              className="btn  w-100 text-white"
              onClick={() => {
                dispatch(successModal(false));
              }}
              style={{ backgroundColor: "#5EAC24" }}
            >
              Close
            </button>
          </div>
        </Modal>

        {/* admin delete success modal */}
        <Modal
          className="custom-modal"
          style={{ left: "50%", transform: "translateX(-50%)" }}
          dialogClassName="modal-dialog-centered"
          show={deleteSuccessModalValue}
        >
          <div className="d-flex flex-column modal-success p-4 align-items-center ">
            <img
              src={successCheck}
              className="img-fluid mb-4"
              alt="successCheck"
            />{" "}
            <p className="mb-4 text-center">
              Admin User Profile Deleted Successfully
            </p>
            <button
              className="btn  w-100 text-white"
              onClick={() => {
                dispatch(deleteSuccessModal(false));
              }}
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

export default SearchAdmin;
