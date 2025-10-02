import * as Yup from "yup";

export const SupportTicketValidation = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  category: Yup.string()
    .oneOf(
      ["general", "payment", "prediction", "technical", "account"],
      "Invalid category"
    )
    .required("Category is required"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long"),

  status: Yup.string()
    .oneOf(["in-progress", "resolved", "open"], "Invalid status")
    .default("in-progress"),

  message: Yup.array().of(
    Yup.object().shape({
      isRead: Yup.boolean().notRequired(),
      text: Yup.string().required("Message text is required"),
      replyAt: Yup.date().default(() => new Date()),
      replyBy: Yup.string().required("ReplyBy is required"),
      ticketStatus: Yup.string()
        .oneOf(["in-progress", "resolved", "open"], "Invalid ticket status")
        .default("in-progress"),
    })
  ),
});
