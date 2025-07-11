import axios from "axios";
import { useSelector } from "react-redux";
import { adminUrl, serverUrl } from "../../APIs/Base_UrL";
import { employee_Url } from "../../APIs/Base_UrL";

//Get employee data
export const getEmployeeData = async () => {
  try {
    const response = await axios.get(`${serverUrl}/admin/projects/employees`);
    return response.data; // Assuming the response.data contains the array of employee data
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return []; // Return an empty array in case of error
  }
};
// Get Employee Detail
export const getEmployeeDetails = async (employeeId) => {
  try {
    const response = await axios.get(
      `${serverUrl}/admin/projects/employees/${employeeId}`
    );
    const createdProject = response.data; // Assuming the response.data contains the array of employee data
    return createdProject;
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return []; // Return an empty array in case of error
  }
};
//create employee

export const addEmployeeData = async (formValues, adminId) => {
  try {
    const response = await axios.post(
      `${serverUrl}/employee/saveemployee?adminId=${adminId}`,
      formValues
    );
    // Assuming the response contains the newly created employee data
    const createdEmployee = response.data;
    // You can handle the response as needed
    // console.log('Created employee:', createdEmployee);
    return createdEmployee;
  } catch (error) {
    console.error("Error adding employee data:", error);
    // Handle error as needed
  }
};

// Check for duplicate employee details
export const checkEmployeeDuplicates = async (employeeData) => {
  try {
    const response = await axios.get(`${serverUrl}/employee/getemployees`);
    const allEmployees = response.data;

    const duplicates = {
      employeeId: false,
      emailId: false,
      panNumber: false,
      mobileNumber: false,
      aadharNumber: false,
    };

    allEmployees.forEach((employee) => {
      // Normalize all values to strings for consistent comparison
      const employeeId = employee.employeeId?.toString() || "";
      const employeeEmail = employee.emailId?.toLowerCase() || "";
      const employeePAN = employee.panNumber?.toUpperCase() || "";
      const employeeMobile = employee.mobileNumber?.toString() || "";
      const employeeAadhar = employee.aadharNumber?.toString() || "";

      const inputId = employeeData.employeeId?.toString() || "";
      const inputEmail = employeeData.emailId?.toLowerCase() || "";
      const inputPAN = employeeData.panNumber?.toUpperCase() || "";
      const inputMobile = employeeData.mobileNumber?.toString() || "";
      const inputAadhar = employeeData.aadharNumber?.toString() || "";

      if (employeeId === inputId) {
        duplicates.employeeId = true;
      }

      if (employeeEmail === inputEmail) {
        duplicates.emailId = true;
      }

      if (employeePAN === inputPAN) {
        duplicates.panNumber = true;
      }

      if (employeeMobile === inputMobile) {
        duplicates.mobileNumber = true;
      }

      if (employeeAadhar === inputAadhar) {
        duplicates.aadharNumber = true;
      }
    });

    return duplicates;
  } catch (error) {
    console.error("Error checking employee duplicates:", error);
    return null;
  }
};

///last entered  employee
export const getLastEnteredEmployee = async () => {
  try {
    const response = await axios.get(`${serverUrl}/employee/getemployees`);
    const allEmployees = response.data;
    if (allEmployees.length === 0) {
      return null;
    }
    const lastEnteredEmployeeData = allEmployees[allEmployees.length - 1];
    return lastEnteredEmployeeData;
  } catch (error) {
    console.error("Error fetching last entered employee:", error);
    return null;
  }
};

//delete employee
export const deleteEmployeeData = async (employeeId, adminId) => {
  try {
    // Make DELETE request to the API endpoint with the employeeId
    await axios.delete(
      `${serverUrl}/employee/${employeeId}?adminId=${adminId}`
    );

    // Retrieve updated employee data from the API and return it
    const updatedEmployeeData = await getEmployeeData();
    return updatedEmployeeData;
  } catch (error) {
    console.error("Error deleting employee data:", error);
    // Handle error as needed
    return null;
  }
};
//edit employee
export const updateEmployeeData = async (id, adminId, updatedData) => {
  try {
    const response = await axios.put(
      `${serverUrl}/employee/${id}?adminId=${adminId}`,
      updatedData
    );
    return response.data; // Assuming the response.data contains the updated employee data
  } catch (error) {
    console.error("Error updating employee data:", error);
    throw error; // Throw error to be handled in component
  }
};
