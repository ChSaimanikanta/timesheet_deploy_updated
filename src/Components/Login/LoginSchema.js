import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  role: Yup.string().required("Select the role"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});
