import * as yup from "yup";

export const statsValidationSchema = yup.object().shape({
  originalName: yup.string().required("Original name is required"),
  publicName: yup.string().required("Public name is required"),
  type: yup.string().oneOf(["stadium", "player"]).required("Type is required"),
});
