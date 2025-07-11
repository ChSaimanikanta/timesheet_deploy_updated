import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import modalReducer from './Components/features/modal'
import adminDetailReducer from './Components/features/adminDetails';
import submitBtn from './Components/features/submitBtn';
import empLeaveSubmit from './Components/features/empLeaveSubmit';
import employeeLogin from './Components/features/employeeLogin';
import adminLogin from './Components/features/adminLogin';
import superadminLogin from './Components/features/superadminLogin';
import submitAdminButton from './Components/features/submitAdminButton';
import supervisorLogin from './Components/features/supervisorLogin';
import { BrowserRouter } from 'react-router-dom';
  const store=configureStore({

    reducer:{
      modal:modalReducer,
      adminDetails:adminDetailReducer,
      submitBtn,
      empLeaveSubmit,
      employeeLogin,
      adminLogin,
      superadminLogin,
      submitAdminButton,
      supervisorLogin
    }

  })

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  
      <Provider store={store}>
        <App />
      </Provider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
