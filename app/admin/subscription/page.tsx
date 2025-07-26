"use client";
import React, { useState } from "react";
import { subscriptionValidationSchema } from "@/app/api/subscription/AubscriptionSchema";
import { SubscriptionList } from "@/app/MainService";
import AdminLayout from "@/components/admin/AdminLayout";
import { FormikRadioGroup, FormikTextInput } from "@/components/CustomField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { Plus, Search, Star, Check, X } from "lucide-react";

const AdminSubscription = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [actionType, setActionType] = useState("add");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>({});

  const { data: subscriptionPlans = [], isLoading } = useQuery({
    queryKey: ["subscription-list"],
    queryFn: async () => {
      const response = await SubscriptionList();
      return response.data;
    },
  });

  const activeSubscription = subscriptionPlans.filter(
    (plan: any) => plan.isActive
  ).length;
  const inactiveSubscription = subscriptionPlans.filter(
    (plan: any) => !plan.isActive
  ).length;

  const filteredPlans = subscriptionPlans.filter((plan: any) => {
    // Filter by search term
    const matchesSearch = plan.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by active tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return plan.isActive && matchesSearch;
    if (activeTab === "suspended") return !plan.isActive && matchesSearch;

    return matchesSearch;
  });

  const initialValues = {
    name: selectedPlan?.name || "",
    price: selectedPlan?.price || 0,
    credits: selectedPlan?.credits || 1,
    features: selectedPlan?.features || ["yes"],
    popular: selectedPlan?.popular || "false",
    isActive: selectedPlan?.isActive ?? "true",
  };

  const handelFormSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subscription Plans
            </h1>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              type="button"
              onClick={() => {
                setModalOpen(true);
                setActionType("add");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by plan name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription List */}
        <Card className="border-0 shadow-lg">
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">
                  All ({subscriptionPlans.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activeSubscription})
                </TabsTrigger>
                <TabsTrigger value="suspended">
                  Inactive ({inactiveSubscription})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredPlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan: any) => (
                      <Card
                        key={plan._id}
                        className="hover:shadow-xl transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col h-full">
                            {/* Plan header */}
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold text-gray-900">
                                {plan.name}
                              </h3>
                              {plan.popular && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </span>
                              )}
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                              <span className="text-3xl font-bold text-gray-900">
                                ${plan.price}
                              </span>
                              <span className="text-gray-500">/month</span>
                            </div>

                            {/* Credits */}
                            <div className="mb-6">
                              <div className="flex items-center text-gray-700 mb-2">
                                <span className="font-medium">
                                  {plan.credits} Credits
                                </span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="flex-1 mb-6">
                              <ul className="space-y-2">
                                {plan.features.map(
                                  (feature: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                      <span className="text-gray-700">
                                        {feature}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            {/* Status and actions */}
                            <div className="mt-auto">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    plan.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {plan.isActive ? (
                                    <>
                                      <Check className="h-3 w-3 mr-1" />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <X className="h-3 w-3 mr-1" />
                                      Inactive
                                    </>
                                  )}
                                </span>

                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 text-gray-400 mx-auto mb-4">
                      <Search className="h-full w-full" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No plans found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "No plans match the selected filter"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={() => {
          setModalOpen(false);
          setActionType("add");
        }}
      >
        <DialogContent className="max-w">
          <DialogHeader>
            <DialogTitle>
              {actionType === "add"
                ? "Edit Subscription Plan"
                : "Add New Subscription Plan"}
            </DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={subscriptionValidationSchema}
            onSubmit={handelFormSubmit}
          >
            {({ handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                  <div className="space-y-2">
                    <Field
                      label="Name"
                      component={FormikTextInput}
                      name="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Field
                      label="Price"
                      component={FormikTextInput}
                      name="price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Field
                      label="Credits"
                      component={FormikTextInput}
                      name="credits"
                    />
                  </div>
                  <div className="space-y-2">
                    <Field
                      label="Features"
                      component={FormikTextInput}
                      name="features"
                    />
                  </div>
                  <div className="space-y-2">
                    <Field
                      label="Popular"
                      component={FormikRadioGroup}
                      name="popular"
                      options={[
                        { label: "Yes", value: "true" },
                        { label: "No", value: "false" },
                      ]}
                      onValueChange={(e: any) => setFieldValue("popular", e)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Field
                      label="Active"
                      component={FormikRadioGroup}
                      name="isActive"
                      options={[
                        { label: "Yes", value: "true" },
                        { label: "No", value: "false" },
                      ]}
                      onValueChange={(e: any) => setFieldValue("isActive", e)}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {actionType === "add"
                      ? "Add Subscription"
                      : "Update Subscription"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSubscription;
