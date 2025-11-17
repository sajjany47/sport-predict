import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import {
  FormikSelectField,
  FormikTextArea,
  FormikTextInput,
} from "@/components/CustomField";
import { Button } from "@/components/ui/button";
import { OrderUpdate } from "../AdminService";
import toast from "react-hot-toast";
import CustomLoader from "@/components/ui/CustomLoader";

interface StatusDialogeProps {
  isOpen: boolean;
  onClose: () => void;
  transactionStatus: string;
  remarks?: string;
  orderId?: string;
}
const StatusDialoge = ({
  isOpen,
  onClose,
  transactionStatus,
  remarks,
  orderId,
}: StatusDialogeProps) => {
  const [loading, setLoading] = useState(false);
  const StatusValidationSchema = yup.object({
    transactionStatus: yup.string().required("Transaction Status is required"),
    remarks: yup.string().required("Remarks is required"),
  });
  const handelFormSubmit = (values: any) => {
    setLoading(true);
    let payload = {
      status: values.transactionStatus,
      remarks: values.remarks,
      orderId: orderId,
    };
    OrderUpdate(payload)
      .then((res) => {
        setLoading(false);
        toast.success(res.message);
        onClose();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to save details. Please try again.");
      });
  };
  return (
    <>
      {loading && <CustomLoader message="Updating Transaction Details" />}
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Status Change</DialogTitle>
            <DialogDescription>
              Update the transaction status to reflect the latest progress.
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={{
              transactionStatus: transactionStatus || "",
              remarks: remarks || "",
            }}
            validationSchema={StatusValidationSchema}
            onSubmit={handelFormSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="md:col-span-4">
                    <Field
                      label="Order Number"
                      component={FormikTextInput}
                      name="remarks"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Type"
                      component={FormikSelectField}
                      options={[
                        { label: "Purchase", value: "purchase" },
                        { label: "Prediction", value: "prediction" },
                        { label: "Free Credit", value: "credit" },
                      ]}
                      name="ordertype"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Status"
                      component={FormikSelectField}
                      options={[
                        { label: "Completed", value: "completed" },
                        { label: "Pending", value: "pending" },
                        { label: "Failed", value: "failed" },
                        { label: "Refunded", value: "refunded" },
                      ]}
                      name="status"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Name"
                      component={FormikTextInput}
                      name="name"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Username"
                      component={FormikTextInput}
                      name="username"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Email"
                      component={FormikTextInput}
                      name="email"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Field
                      label="Mobile Nummber"
                      component={FormikTextInput}
                      name="monileNumber"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StatusDialoge;
