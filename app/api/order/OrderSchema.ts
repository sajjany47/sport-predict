import * as yup from "yup";

export const orderValidationSchema = yup.object().shape({
  ordertype: yup
    .string()
    .oneOf(["subscription", "prediction", "credit"])
    .required("Order type is required"),

  price: yup.number().nullable().min(0, "Price cannot be negative"),

  userId: yup.string().required("User ID is required"),

  subscriptionId: yup.string().nullable(),

  subscriptionExpired: yup.date().nullable(),

  credits: yup.number().nullable().min(0, "Credits cannot be negative"),

  status: yup
    .string()
    .oneOf(["pending", "refunded", "completed", "failed"])
    .default("pending"),

  paymentId: yup.string().nullable(),

  paymentMode: yup
    .string()
    .nullable()
    .oneOf(["UPI", "NETBANKING", "QRCODE", "PROMOTION", null]),

  receiverId: yup.string().nullable(),

  paymentDate: yup.date().nullable(),
});
