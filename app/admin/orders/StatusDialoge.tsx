import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { FormikSelectField, FormikTextArea } from "@/components/CustomField";
import { Button } from "@/components/ui/button";

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
  const StatusValidationSchema = yup.object({
    transactionStatus: yup.string().required("Transaction Status is required"),
    remarks: yup.string().required("Remarks is required"),
  });
  const handelFormSubmit = (values: any) => {
    console.log(values);
  };
  return (
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-12">
                  <Field
                    label="Transaction Status"
                    component={FormikSelectField}
                    options={[
                      { label: "Pending", value: "pending" },
                      { label: "Completed", value: "completed" },
                      { label: "Declined", value: "failed" },
                      { label: "Refunded", value: "refunded" },
                    ]}
                    name="transactionStatus"
                  />
                </div>
                <div className="md:col-span-12">
                  <Field
                    label="Remarks"
                    component={FormikTextArea}
                    name="remarks"
                    size="3"
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
                <Button type="submit">Update Status</Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default StatusDialoge;
