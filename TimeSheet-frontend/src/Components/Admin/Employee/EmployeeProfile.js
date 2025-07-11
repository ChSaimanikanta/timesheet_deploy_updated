import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import successCheck from '../../Image/checked.png';
import '../../css/style.css';
import { addEmployeeData } from './EmployeeService';
import { useSelector } from 'react-redux';

export default function EmployeeProfile() {
  const [employeeData, setEmployeeData] = useState(null);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [successConfirmation, setSuccessConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [isEditConfirmationOpen, setEditConfirmationOpen] = useState(false);
  const [createdEmployeeId, setCreatedEmployeeId] = useState(null);
  const adminValue = useSelector(state => state.adminLogin.value);
  const adminId = adminValue.adminId;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.employee) {
      setEmployeeData(location.state.employee);
    }
  }, [location.state]);

  const handleEditConfirm = () => setEditConfirmationOpen(true);
  const handleEditConfirmClose = () => setEditConfirmationOpen(false);
  const handleEditYes = () => {
    setEditConfirmationOpen(false);
    navigate('/admin/createemployee?editMode=true', { state: { employee: employeeData } });
  };

  const handleSubmitClick = async () => {
    try {
      const response = await addEmployeeData(employeeData, adminId);
      console.log(response.emailId);

      if(response){
        setCreatedEmployeeId(response.employeeId);
        setSuccessConfirmation(true);
      }else{
        console.log(response.emailId);
      }

    
    } catch (error) {
      setError('Error submitting employee data. Please try again.');
      
    }
  };

  const handleSuccessClick = () => setSuccessModalOpen(true);
  const handleClose = () => setSuccessModalOpen(false);
  const handleConfirmClose = () => {
    setSuccessConfirmation(false);
    navigate('/admin');
  };

  if (!employeeData) return <div>Loading...</div>;

  return (
    <div className='container background-clr py-4'>
      <div>
        <h3 className='text-center mb-4'>Employee Profile</h3>
        <div className='employee-form'>
          <div className='row'>
            {[
              ['EmployeeId', employeeData.employeeId],
              ['Firstname', employeeData.firstName],
              ['Lastname', employeeData.lastName],
              ['Address', employeeData.address],
              ['Mobile Number', employeeData.mobileNumber],
              ['Email Id', employeeData.emailId],
              ['Aadhar Card', employeeData.aadharNumber],
              ['Pan Card', employeeData.panNumber],
              ['Password', employeeData.password]
            ].map(([label, value], index) => (
              <div key={index} className='col-md-6 form-group mb-3'>
                <label className='label col-md-4 fw-bold'>{label}:</label>
                <label className='label col-md-8'>{value}</label>
              </div>
            ))}
          </div>
        </div>
        <div className='text-center mt-4'>
          <button type='button' className='btn btn-secondary mx-2' onClick={handleEditConfirm}>
            Edit
          </button>
          <button type='button' className='btn btn-success mx-2' onClick={handleSubmitClick}>
            Submit
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal show={isEditConfirmationOpen} onHide={handleEditConfirmClose}>
        <Modal.Body>Do you want to navigate to the edit page?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleEditConfirmClose}>Cancel</Button>
          <Button variant='primary' onClick={handleEditYes}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <Modal centered size='sm' show={successConfirmation} onHide={handleConfirmClose}>
        <Modal.Body>
          <div className='d-flex flex-column modal-success p-4 align-items-center'>
            <img src={successCheck} className='img-fluid mb-4' alt='successCheck' />
            <p className='mb-4 text-center'>Employee Profile Created Successfully</p>
            {createdEmployeeId && <p className='mb-4 text-center'>Employee ID: {createdEmployeeId}</p>}
            <p className='mb-4 text-center'>Employee Name: {employeeData.firstName}</p>
            <button className='btn w-100 text-white' onClick={handleConfirmClose} style={{ backgroundColor: '#5EAC24' }}>
              Close
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {error && (
        <Modal centered size='sm' show={Boolean(error)} onHide={() => setError(null)}>
          <Modal.Body>
            <div className='d-flex flex-column modal-error p-4 align-items-center'>
              <p className='mb-4 text-center'>{error}</p>
              <button className='btn w-100 text-white' onClick={() => setError(null)} style={{ backgroundColor: '#d9534f' }}>
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
