// components/FormikTextInput.tsx

import { Field, FieldArray, getIn } from "formik";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import Select from "react-select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";

export const FormikTextInput = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  // Extract custom className if provided
  const customClass = props.className || "";

  // Base classes that should always be applied
  const baseClasses = `w-full ${props.icon ? "pl-10" : ""}`;

  // Conditional classes based on validation state
  const stateClasses = hasError
    ? "border-red-500 ring-red-200 focus:ring-red-200 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-300 focus:border-blue-500";

  // Combine all classes
  const inputClasses = `mt-2 mb-2 ${baseClasses} ${stateClasses} ${customClass}`;

  return (
    <div className={props.containerClass || ""}>
      {props.label && (
        <Label
          htmlFor={field.name}
          className={props.labelClass || "text-gray-700 font-medium mb-1 block"}
        >
          {props.label}
        </Label>
      )}

      <div className="relative">
        {props.icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {props.icon}
          </div>
        )}

        <Input
          {...field}
          {...props}
          id={field.name}
          value={field.value || ""}
          placeholder={
            props.placeholder || `Enter ${props.label || field.name}`
          }
          className={inputClasses}
        />
      </div>

      {hasError && (
        <small className="text-red-600 mt-1 block text-sm">
          {getIn(errors, field.name)}
        </small>
      )}
    </div>
  );
};

export const FormikTextArea = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  // Extract custom className if provided
  const customClass = props.className || "";

  // Base classes that should always be applied
  const baseClasses = `w-full resize-none ${props.icon ? "pl-10" : ""}`;

  // Conditional classes based on validation state
  const stateClasses = hasError
    ? "border-red-500 ring-red-200 focus:ring-red-200 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-300 focus:border-blue-500";

  // Combine all classes
  const inputClasses = `mt-2 mb-2 ${baseClasses} ${stateClasses} ${customClass}`;

  return (
    <div className={props.containerClass || ""}>
      {props.label && (
        <Label
          htmlFor={field.name}
          className={props.labelClass || "text-gray-700 font-medium mb-1 block"}
        >
          {props.label}
        </Label>
      )}

      <div className="relative">
        {props.icon && (
          <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
            {props.icon}
          </div>
        )}

        <Textarea
          {...field}
          {...props}
          id={field.name}
          value={field.value || ""}
          placeholder={
            props.placeholder || `Enter ${props.label || field.name}`
          }
          className={inputClasses}
        />
      </div>

      {hasError && (
        <small className="text-red-600 mt-1 block text-sm">
          {getIn(errors, field.name)}
        </small>
      )}
    </div>
  );
};

export const FormikTextPassword = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  // Extract custom classes
  const customClass = props.className || "";

  // Base classes
  const baseClasses = `w-full pr-10 ${props.icon ? "pl-10" : ""}`;

  // Validation classes
  const stateClasses = hasError
    ? "border-red-500 ring-red-200 focus:ring-red-200 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-300 focus:border-blue-500";

  // Final input classes
  const inputClasses = `mt-2 mb-2 ${baseClasses} ${stateClasses} ${customClass}`;

  return (
    <div className={props.containerClass || ""}>
      {props.label && (
        <Label
          htmlFor={field.name}
          className={props.labelClass || "text-gray-700 font-medium mb-1 block"}
        >
          {props.label}
        </Label>
      )}

      <div className="relative">
        {props.icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {props.icon}
          </div>
        )}

        <Input
          {...field}
          {...props}
          id={field.name}
          type={showPassword ? "text" : "password"}
          value={field.value || ""}
          placeholder={
            props.placeholder || `Enter ${props.label || field.name}`
          }
          className={inputClasses}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {hasError && (
        <small className="text-red-600 mt-1 block text-sm">
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

  // Extract custom className if provided
  const customClass = props.className || "";

  // Base classes
  const baseClasses = `w-full px-3 py-2 rounded-md appearance-none ${
    props.icon ? "pl-10" : ""
  }`;

  // Conditional classes based on validation state
  const stateClasses = hasError
    ? "border-red-500 ring-red-200 focus:ring-red-200 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-300 focus:border-blue-500";

  // Final input classes
  const selectClasses = `mt-2 mb-2 border ${baseClasses} ${stateClasses} ${customClass}`;

  return (
    <div className={props.containerClass || ""}>
      {props.label && (
        <Label
          htmlFor={field.name}
          className={props.labelClass || "text-gray-700 font-medium mb-1 block"}
        >
          {props.label}
        </Label>
      )}

      <div className="relative">
        {props.icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {props.icon}
          </div>
        )}

        <select
          id={field.name}
          {...field}
          {...props}
          value={field.value || ""}
          className={selectClasses}
        >
          <option value="">
            {props.placeholder || `Select ${props.label || field.name}`}
          </option>
          {props.options?.map((item: any, index: number) => (
            <option value={item.value} key={index}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {hasError && (
        <small className="text-red-600 mt-1 block text-sm">
          {getIn(errors, field.name)}
        </small>
      )}
    </div>
  );
};

export const FormikAutoSelectField = ({
  field,
  form: { touched, errors, setFieldValue },
  ...props
}: any) => {
  const [options, setOptions] = useState<any[]>([]);

  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  // Debounced option loader
  const loadOptions = async (inputValue: string) => {
    if (inputValue.length >= 2 && props.loadOptions) {
      const newOptions = await props.loadOptions(inputValue);
      setOptions(newOptions);
    }
  };

  const handleInputChange = (inputValue: string) => {
    loadOptions(inputValue);
  };

  return (
    <div className={`${props.containerClass || ""} mb-2`}>
      {props.label && (
        <Label
          htmlFor={field.name}
          className={props.labelClass || "text-gray-700 font-medium mb-1 block"}
        >
          {props.label}
        </Label>
      )}

      <div className="relative">
        {props.icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {props.icon}
          </div>
        )}

        <Select
          id={field.name}
          {...props}
          name={field.name}
          value={options.find((opt) => opt.value === field.value) || null}
          onChange={(option: any) =>
            setFieldValue(field.name, option ? option.value : "")
          }
          onInputChange={handleInputChange}
          options={options}
          isClearable
          isSearchable
          placeholder={
            props.placeholder || `Search ${props.label || field.name}...`
          }
          className={`mt-2  ${props.icon ? "pl-10" : ""} ${
            hasError ? "react-select-error" : "react-select-normal"
          } ${props.className || ""}`}
          classNamePrefix="react-select"
        />
      </div>

      {hasError && (
        <small className="text-red-600 mt-1 block text-sm">
          {getIn(errors, field.name)}
        </small>
      )}
    </div>
  );
};

export const FormikRadioGroup = ({
  field,
  form: { touched, errors, setFieldValue },
  ...props
}: any) => {
  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  return (
    <div className={`${props.containerClass || ""} mb-2`}>
      {props.label && (
        <Label
          htmlFor={field.name}
          className={props.labelClass || "text-gray-700 font-medium mb-1 block"}
        >
          {props.label}
        </Label>
      )}

      <RadioGroup
        id={field.name}
        value={field.value || ""}
        onValueChange={(val) => setFieldValue(field.name, val)}
        className={`flex gap-4 rounded-md px-3 py-2 ${
          hasError
            ? "border border-red-500 ring-red-200"
            : "border border-gray-300 focus:ring-blue-300"
        } ${props.className || ""}`}
      >
        {props.options.map((option: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem
              id={`${field.name}-${index}`}
              value={option.value}
            />
            <Label htmlFor={`${field.name}-${index}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>

      {hasError && (
        <small className="text-red-600 mt-1 block text-sm">
          {getIn(errors, field.name)}
        </small>
      )}
    </div>
  );
};

export const FormikFieldArray = ({ data }: any) => {
  return (
    <div className={`${data.containerClass || ""} mb-2`}>
      {data.label && (
        <Label className="block mb-2 text-base font-medium">{data.label}</Label>
      )}

      <FieldArray
        name={data.name}
        render={(arrayHelpers) => (
          <div className="space-y-4 border border-gray-300 p-4 rounded-md">
            {data.values?.map((_: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end"
              >
                {data.keyArray.map((elm: any, ind: number) => (
                  <div className={elm.className} key={ind}>
                    <Field
                      {...elm}
                      name={`${data.name}[${index}].${elm.name}`}
                    />
                  </div>
                ))}

                <div
                  className={`${
                    data.buttonClass || ""
                  } flex items-center justify-start h-full mt-[30px]`}
                >
                  <Trash2
                    className="h-5 w-5 text-red-500 cursor-pointer mt-2"
                    onClick={() => arrayHelpers.remove(index)}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => arrayHelpers.push({ ...data.initialObject })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add More
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export const FormikCheckBox = ({
  field,
  form: { touched, errors, setFieldValue },
  ...props
}: any) => {
  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  return (
    <div className={`${props.containerClass || ""} mb-2`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.name}
          checked={!!field.value}
          onCheckedChange={(checked) => setFieldValue(field.name, checked)}
          className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
            hasError ? "border-red-500 ring-red-200" : "border-gray-300"
          } ${props.className || ""}`}
        />
        <Label
          htmlFor={field.name}
          className={props.labelClass || "text-sm text-gray-600"}
        >
          {props.label}
        </Label>
      </div>

      {hasError && (
        <small className="text-red-600 mt-1 block text-sm">
          {getIn(errors, field.name)}
        </small>
      )}
    </div>
  );
};
