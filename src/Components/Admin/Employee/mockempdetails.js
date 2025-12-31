import React, { useState } from "react";


// export default employeeData;

 const employeedatas = JSON.parse(sessionStorage.getItem('employeedatas')) || [];

export const getEmployeeData = () => employeedatas;
// const [employeeData, setEmployeeData] = useState()

export const addEmployeeData = (newData) => {
    const existingIndex = employeedatas.findIndex(item => item.id === newData.id);

  if (existingIndex !== -1) {
    // If the item with the same id exists, update it
    employeedatas[existingIndex] = newData;
  } else {
    // If the item with the same id does not exist, add it
    employeedatas.push({ id: employeedatas.length + 1, ...newData });
  }
//   employeedatas.push({ id: employeedatas.length + 1, ...newData });
  sessionStorage.setItem('employeedatas', JSON.stringify(employeedatas));
  // setEmployeeData(employeedatas)
};

export const getLastEnteredEmployee = () => {
    // const employeedatas = getEmployeeData();
    const employeedatas = JSON.parse(sessionStorage.getItem('employeedatas')) || [];
    if (employeedatas.length === 0) {
      return null;
    }
    return employeedatas[employeedatas.length - 1];
  };
  

export const deleteEmployeeData = (employeeId) => {
  const updatedEmployeeData = getEmployeeData().filter(employee => employee.id !== employeeId);
  
  sessionStorage.setItem('employeedatas', JSON.stringify(updatedEmployeeData));
  return updatedEmployeeData; // Update state immediately
};
export default employeedatas;