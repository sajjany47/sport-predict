// components/FormikTextInput.tsx

import { getIn } from "formik";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export const FormikTextInput = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  return (
    <div className="mb-2">
      <Label htmlFor={field.name}>{props.label}</Label>
      <Input
        {...field}
        {...props}
        id={field.name}
        value={field.value || ""}
        placeholder={`Enter ${field.name}`}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
          hasError
            ? "border-red-500 ring-red-200"
            : "border-gray-300 focus:ring-blue-300"
        }`}
      />

      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-600 mt-1 block">
          {getIn(errors, field.name)}
        </small>
      )}
    </div>
  );
};

export const FormikSelectField = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  return (
    <div className="mb-2">
      <Label htmlFor={field.name}>{props.label}</Label>
      <select
        id={field.name}
        {...field}
        {...props}
        value={field.value || ""}
        // placeholder={`Select ${field.name}`}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          hasError
            ? "border-red-500 ring-red-200"
            : "border-gray-300 focus:ring-blue-300"
        }`}
      >
        {props.options.map((item: any, index: number) => (
          <option value={item.value} key={index}>
            {item.label}
          </option>
        ))}
      </select>

      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-600 mt-1 block">
          {getIn(errors, field.name)}
        </small>
      )}
    </div>
  );
};
