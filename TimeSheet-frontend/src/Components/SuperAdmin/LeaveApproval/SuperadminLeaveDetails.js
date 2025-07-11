// import React, { useState, useEffect } from "react";
// import { useFormik } from "formik";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { schemaLeave } from "../LeaveApproval/LeaveSchema";
// import leaveUrl from "../../Api/leaveRequest";
// import { Modal, Button } from "react-bootstrap";
// import successCheck from "../../Image/checked.png";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";

// function SuperAdminApproveDetails() {
//   const [leaveData, setLeaveData] = useState(null);
//   const [editId, setEditId] = useState(null);
  
//   const navigate = useNavigate();
//   const [leaveEmp, setLeaveEmp] = useState({});
//   const { id } = useParams();
//   const [rejectReason, setRejectReason] = useState('');
//     const [errorForRejection, setErrorForRejection] = useState('');
//     const [askConfitrmationForApprove, setAskConfirmationForApprove] = useState(false)
//     const [askConfitrmationForReject, setAskConfirmationForReject] = useState(false)
//     const [successModalForApprove, setSuccessModalForApprove] = useState(false)
//     const [successModalForReject, setSuccessModalForReject] = useState(false)

//   const formik = useFormik({
//     initialValues: {
//       startDate: new Date(),
//       endDate: new Date(),
//       numberOfDays: "",
//       leaveReason: "",
//       leaveComment: "",
//     },
//     validationSchema: schemaLeave,
//     onSubmit: editLeaveRequest,
//   });

//   useEffect(() => {
    
//     fetchLeaveData();
//   }, []);

//   async function fetchLeaveData() {
//     try {
//       const response = await axios.get(leaveUrl);
//       const leaveRequest = response.data;
//     //   const leaveData = res.data;
//     // setLeaveEmp(leaveData);
//       if (leaveRequest.length > 0) {
//         const lastRequest = leaveRequest[leaveRequest.length - 1];
//         setLeaveEmp(lastRequest);
//         setEditId(lastRequest.id);
//         formik.setValues({
//           startDate: new Date(lastRequest.startDate),
//           endDate: new Date(lastRequest.endDate),
//           numberOfDays: lastRequest.numberOfDays,
//           leaveReason: lastRequest.leaveReason,
//           leaveComment: lastRequest.leaveComment,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching leave request:", error);
//     }
//   } 

//   async function editLeaveRequest() {
//     try {

//      const res = await axios.put(`${leaveUrl}/${editId}`, formik.values);
//      const response = await axios.get(`${leaveUrl}/${id}`);
//      const updatedLeave = response.data;
//      // Update the leaveEmp state with the updated data
//      setLeaveEmp(updatedLeave);
//     //   setSuccessModal(true);
//     } catch (error) {
//       console.error("Error updating leave request:", error);
//     }
//   }

// function approveLeaveFun() {
//     editLeaveRequest();
//     setAskConfirmationForApprove(true);
//     console.log('approve')
// }

// function rejectLeaveFun() {
//     setAskConfirmationForReject(true);
// }


// // leave approvel
// async function approveSaveConfirmation() {
//     setAskConfirmationForApprove(false);

//     try {
//         const updatedLeave = {
//             ...leaveEmp,
//             status: "your leave request has been approved"
//         };

//         const response = await axios.put(`${leaveUrl}/${id}`, updatedLeave);
//         console.log(response.data);

//         setLeaveEmp(updatedLeave);
//         setSuccessModalForApprove(true);
//     } catch (error) {
//         console.log(error);
//     }
// }


// // cancel the approvel
// function approveCancelConfirmation() {
//     setAskConfirmationForApprove(false);

// }

// // reject the timesheet
// async function rejectSaveConfirmation() {


//     // First validate the rejection reason
//     if (!rejectReason) {
//         // Set the error message if no reason is selected
//         setErrorForRejection("Please select the reject reason");
//         // Do not proceed with the rejection process
//         return;
//     }
//     setAskConfirmationForReject(false);

//     try {

//         const updatedLeave = {
//             ...leaveEmp,
//             status: "your leave request has been rejected",
//             rejectReason: rejectReason
//         };

//         const response = await axios.put(`${ leaveUrl } / ${ id }`, updatedLeave);
//         console.log(response.data)
//         setLeaveEmp(updatedLeave);
//     } catch (error) {
//         console.log(error);
//     }

// }

// // reject cancel
// function rejectCancelConfirmation() {
//     setAskConfirmationForReject(false);

//     }

//   function goToAdminHome() {
//     navigate("/admin");
//   }
//   // Calculate the last day of June
//   const lastDayOfJune = new Date(new Date().getFullYear(), 5, 30);

//   return (
//     <>
//       {/* {leaveData && ( */}
//         <div className="ti-background-clr">
//           <div className="ti-leave-management-container p-5 ">
//             <div className="bg-white p-5 ">
//               <h5 className="text-center py-2 text-primary">
//               LEAVE REQUEST SUBMISSION
//               </h5>

//               <div className="ti-data-field-container pt-4">
//                 {/* Form for editing leave request */}
//                 <form onSubmit={formik.handleSubmit}>
//                 <div className="row mb-3">
//                 <label for="inputEmail3" class="col-sm-2 col-form-label">
//                       Emp Id :
//                     </label>
//                     <div class="col-sm-10">                       
//                                                 <input type='text' disabled className='w-25 px-1' value={ leaveEmp.id} ></input>

//                                             </div>
//                                             </div>
//                                             <div className="row mb-3">
//                                             <label for="inputEmail3" class="col-sm-2 col-form-label">
//                                             Emp Name :
//                     </label>
//                     <div class="col-sm-10">                   
//                                                 <input type='text' disabled className='w-25 px-1' value={ leaveEmp.name} ></input>

//                                             </div>
//                                             </div>
//                                             {/* {leaveData && ( */}
//                  <> <div className="row mb-3">
//                     <label for="inputEmail3" class="col-sm-2 col-form-label">
//                       <span style={{ color: "red" }}>*</span> Start Date :
//                     </label>
//                     <div class="col-sm-10">
//                       <DatePicker
//                         selected={formik.values.startDate}
//                         onChange={(date) => {
//                           formik.setFieldValue("startDate", date);
//                         }}
//                         minDate={new Date()}
//                         maxDate={lastDayOfJune} // Set maxDate to the last day of June
//                         placeholderText="dd/mm/yyyy"
//                         dateFormat="dd/MM/yyyy"
//                         className="w-50"
//                       />{" "}
//                     </div>
//                   </div>

//                   <div class="row mb-3">
//                     <label for="inputEmail3" class="col-sm-2 col-form-label">
//                       <span style={{ color: "red" }}>*</span> End Date :
//                     </label>
//                     <div class="col-sm-10">
//                       <DatePicker
//                         selected={formik.values.endDate}
//                         onChange={(date) => {
//                           const endDate = date.toLocaleDateString("en-US"); // Example: "4/4/2024"
//                           formik.setFieldValue("endDate", endDate);
//                         }}
//                         minDate={new Date()}
//                         maxDate={lastDayOfJune} // Set maxDate to the last day of June
//                         placeholderText="dd/mm/yyyy"
//                         dateFormat="dd/MM/yyyy"
//                         className="w-50"
//                       />
//                        
//                     </div>
//                   </div>

//                   <div class="row mb-3">
//                     <label for="inputEmail3" class="col-sm-2 col-form-label">
//                       <span style={{ color: "red" }}>*</span> Number of days:
//                     </label>
//                     <div class="col-sm-10">
//                       <input
//                         type="text"
//                         id="numberOfDays"
//                         name="numberOfDays"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         value={formik.values.numberOfDays}
//                       ></input>
//                     </div>
//                   </div>
//                   <div class="row mb-3">
//                     <label for="inputEmail3" class="col-sm-2 col-form-label">
//                       <span style={{ color: "red" }}>*</span> Reason :
//                     </label>
//                     <div class="col-sm-10">
//                       <select
//                         id="leave-reason"
//                         name="leaveReason"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         value={formik.values.leaveReason}
//                       >
//                         <option value="">Select</option>
//                         <option value="sick-leave">Sick Leave</option>
//                         <option value="earned-leave">Earned Leave</option>
//                         <option value="casual-leave">casual Leave</option>
//                         <option value="maternity-leave">Maternity leave</option>
//                         <option value="others-leave">Others</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div class="row mb-3">
//                     <label for="inputEmail3" class="col-sm-2 col-form-label">
//                       <span style={{ color: "red" }}>*</span>Comments :
//                     </label>
//                     <div class="col-sm-10">
//                       <textarea
//                         type="text"
//                         id="leave-comment"
//                         name="leaveComment"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         value={formik.values.leaveComment}
//                       ></textarea>
//                     </div>
//                   </div>
//                   </>
//                    {/* )} */}
//                 </form>

//                 <div className='my-5 text-end'>
//                                             <button type='button' className='btn btn-success mx-2' onClick={approveLeaveFun}>Approve</button>
//                                             <button type='button' className='btn btn-danger mx-2' onClick={rejectLeaveFun} >Reject</button>
//                                             <button type='button' className='btn btn-secondary mx-2' onClick={() => { navigate('/admin/adminapproveleaverequest') }} >Cancel</button>
//                 </div>
//               </div>
//             </div>
//           </div>
 
//  {/* modals */}
//  <div className="approveModal">
//                         <Modal show={askConfitrmationForApprove}>

//                             <Modal.Body >Do you want to approve this leave request?</Modal.Body>

//                             <Modal.Footer>
//                                 <Button variant="secondary" onClick={approveCancelConfirmation}>
//                                     Cancel
//                                 </Button>
//                                 <Button variant="primary" onClick={approveSaveConfirmation}>
//                                     Approve
//                                 </Button>
//                             </Modal.Footer>
//                         </Modal>
//                         {/* modal for success approvel */}
//                         <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForApprove}  >
//                             <div className="d-flex flex-column modal-success p-4 align-items-center ">
//                                 <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
//                                 <p className="mb-4 text-center">The leave request has been approved.</p>
//                                 <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForApprove(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
//                             </div>
//                         </Modal>

//                         {/* confirmation modal for rejects */}

//                         <Modal show={askConfitrmationForReject}>
//                             <Modal.Header>
//                                 Are you sure you want to reject ?
//                             </Modal.Header>
//                             <Modal.Body>

//                                 <div>
//                                     <label htmlFor="reject-reason" className="pe-1"><span style={{ color: 'red' }}>*</span> Select The Reason For Reject :</label>

//                                     <select id="reject-reason" name="rejectReason" onChange={(e) => { setRejectReason(e.target.value) }} value={rejectReason}>
//                                         <option value="">Select</option>
//                                         <option value="excessive requests">Excessive Requests</option>
//                                         <option value="busy periods">Busy Periods</option>
//                                         <option value="incomplete work">Incomplete Works</option>
//                                         <option value="maternity-leave">Policy Violations</option>

//                                     </select>

//                                 </div>
//                                 <div className="text-danger  m-2">{errorForRejection ? errorForRejection : ""}</div>
//                             </Modal.Body>
//                             <Modal.Footer>
//                                 <Button variant="secondary" onClick={rejectCancelConfirmation}>
//                                     Cancel
//                                 </Button>
//                                 <Button variant="danger" onClick={rejectSaveConfirmation}>
//                                     Reject
//                                 </Button>
//                             </Modal.Footer>
//                         </Modal>


//                         {/* modal for leave request reject */}
//                         <Modal className="custom-modal" style={{ left: '50%', transform: 'translateX(-50%)' }} dialogClassName="modal-dialog-centered" show={successModalForReject}  >
//                             <div className="d-flex flex-column modal-success p-4 align-items-center ">
//                                 <img src={successCheck} className="img-fluid mb-4" alt="successCheck" />
//                                 <p className="mb-4 text-center">The leave request has been rejected.</p>
//                                 <button className="btn  w-100 text-white" onClick={() => { setSuccessModalForReject(false) }} style={{ backgroundColor: '#5EAC24' }}>Close</button>
//                             </div>
//                         </Modal>



//                     </div>
          
          
//         </div>
//       {/* )} */}
//     </>
//   );
// }

// export default SuperAdminApproveDetails;
