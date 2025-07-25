import * as yup from "yup";

export const orderValidationSchema = yup.object().shape({
  orderNumber: yup.string().required("Order number is required"),

  ordertype: yup
    .string()
    .oneOf(["subscription", "prediction", "credit"])
    .required("Order type is required"),

  price: yup.number().nullable().min(0, "Price cannot be negative"),

  userId: yup.string().required("User ID is required"),

  subscriptionId: yup.string().nullable(),

  subscriptionExpired: yup.date().nullable(),

  credits: yup.number().nullable().min(0, "Credits cannot be negative"),

  paymentStatus: yup.boolean().required("Payment status is required"),

  status: yup
    .string()
    .oneOf(["pending", "verified", "completed", "failed"])
    .default("pending"),

  paymentId: yup.string().nullable(),

  paymentMode: yup
    .string()
    .nullable()
    .oneOf(["UPI", "NETBANKING", "CARD", "OFFLINE", null]),

  senderId: yup.string().nullable(),

  receiverId: yup.string().nullable(),

  paymentDate: yup.date().nullable(),
});
