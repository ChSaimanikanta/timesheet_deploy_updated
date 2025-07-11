import * as Yup from 'yup';

export const basicSchema = Yup.object().shape({

  // regex validation for form field
  // first name
  adminId: Yup.string()
  
  .required('adminId is required'),

  firstName: Yup.string()
  .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Please enter a valid First Name') // Allows alphabets and single spaces
  .required('First Name is required'),

  // last name
  lastName: Yup.string()
    .matches(/^[A-Za-z]+(?:[A-Za-z]+)*$/, 'Please enter the valid LastName')
    .required('Last Name is required'),
  // address
  address: Yup.string()
    .min(3, 'Address should have at least 3 characters')
    .required('Address is required'),
  // email
  emailId: Yup.string()
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Email must be a valid email address")
  .required("Email is required"),


  // phone
  mobileNumber: Yup.number()
  .typeError('The phone number should be a number')
  .integer('The phone number should be a number without decimals')
  .positive('The phone number should be a positive number')
  .test(
    'len',
    'The phone number should be exactly 10 digits',
    (val) => val && val.toString().length === 10
  )
  .required('Phone number is required'),

  // aadhar
  aadharNumber: Yup.number()
        .typeError('The Aadhar number should be a number')
        .test(
            'len',
            'The Aadhar number should be exactly 12 digits',
            val => val && val.toString().length === 12
        )
        .required('Aadhar number is required'),
  // pan
  panNumber: Yup.string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/
      , 'PAN card number must be of format: BEJPC8665H')
    .required('Pan Number is required'),
    
    password: Yup.string()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, 
        "Password must include at least one number, one letter, one special character (including underscore), and have a minimum length of 8 characters.")
    .matches(/^[^%&=/<>?]+$/, 
        "Password must not contain reserved characters (% & = / < > ?).")
    .required("Password is required"),



    // checkboxes
  // employeeAccess: Yup.object().shape({
  //   create: Yup.boolean(),
  //   edit: Yup.boolean(),
  //   delete: Yup.boolean(),
  // }),
  // projectAccess: Yup.object().shape({
  //   create: Yup.boolean(),
  //   edit: Yup.boolean(),
  //   delete: Yup.boolean(),
  // }),
  


});

