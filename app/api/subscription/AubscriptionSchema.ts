import * as yup from "yup";

export const subscriptionValidationSchema = yup.object({
  name: yup.string().required("Name is required"),
  price: yup.number().min(0).required("Price is required"),
  credits: yup.number().min(0).required("Credits are required"),
  features: yup.array().of(yup.string()).required("Features are required"),
  popular: yup.boolean().required("Popular flag is required"),
  isActive: yup.boolean().required("Status is required"),
});
