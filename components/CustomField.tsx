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
import { set } from "mongoose";

export const FormikTextInput = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  return (
    <>
      <Label htmlFor={field.name}>{props.label}</Label>
      <div className="relative">
        {props.icon && props.icon}
        <Input
          {...field}
          {...props}
          id={field.name}
          value={field.value || ""}
          placeholder={`Enter ${
            props.placeholder ? props.placeholder : props.label
          }`}
          className={`w-full ${props.icon && "pl-10"} ${
            hasError
              ? "border-red-500 ring-red-200"
              : "border-gray-300 focus:ring-blue-300"
          }`}
        />
      </div>

      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-600 mt-1 block">
          {getIn(errors, field.name)}
        </small>
      )}
    </>
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

  return (
    <>
      <Label htmlFor={field.name}>{props.label}</Label>
      <div className="relative">
        {props.icon && props.icon}
        <Input
          {...field}
          {...props}
          id={field.name}
          type={showPassword ? "text" : "password"}
          value={field.value || ""}
          placeholder={`Enter ${
            props.placeholder ? props.placeholder : props.label
          }`}
          className={`w-full ${props.icon && "pl-10"} ${
            hasError
              ? "border-red-500 ring-red-200"
              : "border-gray-300 focus:ring-blue-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-600 mt-1 block">
          {getIn(errors, field.name)}
        </small>
      )}
    </>
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
    <>
      <Label htmlFor={field.name}>{props.label}</Label>
      <div className="relative">
        {props.icon && props.icon}
        <select
          id={field.name}
          {...field}
          {...props}
          value={field.value || ""}
          // placeholder={`Select ${field.name}`}
          className={`w-full ${props.icon && "pl-10"} ${
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
      </div>

      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-600 mt-1 block">
          {getIn(errors, field.name)}
        </small>
      )}
    </>
  );
};

export const FormikAutoSelectField = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  const [options, setOptions] = useState([]);

  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  const debouncedLoadOptions = async (inputValue: any) => {
    if (inputValue.length >= 2) {
      const newOptions = await props.loadOptions(inputValue);
      setOptions(newOptions);
    }
  };

  const handleInputChange = (inputValue: string) => {
    debouncedLoadOptions(inputValue);
  };

  return (
    <>
      {props.label && (
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {props.label}
        </label>
      )}

      <div className="relative">
        {props.icon && props.icon}
        <Select
          id={field.name}
          options={options}
          {...field}
          {...props}
          onInputChange={handleInputChange}
          placeholder={`Search...`}
          isClearable
          isSearchable
          classNamePrefix="react-select"
        />
      </div>

      {hasError && (
        <small className="text-red-600 mt-1 block">
          {getIn(errors, field.name)}
        </small>
      )}
    </>
  );
};

export const FormikRadioGroup = ({
  field,
  form: { touched, errors },
  ...props
}: any) => {
  const hasError =
    Boolean(getIn(errors, field.name)) && getIn(touched, field.name);

  return (
    <>
      <Label className="block mb-1 text-sm font-medium" htmlFor={field.name}>
        {props.label}
      </Label>

      <RadioGroup
        id={field.name}
        {...field}
        {...props}
        value={field.value || ""}
        className={`flex gap-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          hasError
            ? "border-red-500 ring-red-200"
            : "border-gray-300 focus:ring-blue-300"
        } ${props?.className}`}
      >
        {props.options.map((option: any, index: any) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem
              id={`${field.name}-${index}`}
              value={option.value}
            />
            <Label htmlFor={`${field.name}-${index}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>

      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-600 mt-1 block">
          {getIn(errors, field.name)}
        </small>
      )}
    </>
  );
};

export const FormikFieldArray = ({ data }: any) => {
  return (
    <>
      <Label className="block mb-2 text-base font-medium">{data.label}</Label>
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
                  className={`${data.buttonClass} flex items-center justify-start h-full mt-[30px]`}
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
    </>
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
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          {...field}
          {...props}
          id={field.name}
          checked={field.value || ""}
          onCheckedChange={(checked) => setFieldValue(field.name, checked)}
          className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
            hasError ? "border-red-500 ring-red-200" : "border-gray-300"
          }`}
        />
        <Label htmlFor={field.name} className="text-sm text-gray-600">
          {props.label}
        </Label>
      </div>
      {Boolean(getIn(errors, field.name)) && getIn(touched, field.name) && (
        <small className="text-red-600 mt-1 block">
          {getIn(errors, field.name)}
        </small>
      )}
    </>
  );
};
