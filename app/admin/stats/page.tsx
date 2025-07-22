"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setPlayers,
  setStadiums,
  addPlayer,
  updatePlayer,
  deletePlayer,
  addStadium,
  updateStadium,
  deleteStadium,
} from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Database,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Calendar,
  User,
  Building,
  Globe,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { StatsAutoSearch, StatsCreate, StatsUpdate } from "../AdminService";
import { Formik, Form, Field } from "formik";
import {
  statsValidationFrontend,
  statsValidationSchema,
} from "@/app/api/stats/StatsSchema";
import {
  FormikAutoSelectField,
  FormikSelectField,
  FormikTextInput,
} from "@/components/CustomField";

const AdminStatsPage = () => {
  const { players, stadiums } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("player");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockPlayers = [
      {
        id: "1",
        originalName: "Virat Kohli",
        publicName: "V Kohli",
        team: "Royal Challengers Bangalore",
        dob: "1988-11-05",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        originalName: "Rohit Sharma",
        publicName: "R Sharma",
        team: "Mumbai Indians",
        dob: "1987-04-30",
        createdAt: "2024-01-14T15:20:00Z",
        updatedAt: "2024-01-14T15:20:00Z",
      },
      {
        id: "3",
        originalName: "MS Dhoni",
        publicName: "MS Dhoni",
        team: "Chennai Super Kings",
        dob: "1981-07-07",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
      },
      {
        id: "4",
        originalName: "KL Rahul",
        publicName: "KL Rahul",
        team: "Lucknow Super Giants",
        dob: "1992-04-18",
        createdAt: "2024-01-12T14:45:00Z",
        updatedAt: "2024-01-12T14:45:00Z",
      },
      {
        id: "5",
        originalName: "Hardik Pandya",
        publicName: "H Pandya",
        team: "Mumbai Indians",
        dob: "1993-10-11",
        createdAt: "2024-01-11T11:30:00Z",
        updatedAt: "2024-01-11T11:30:00Z",
      },
    ];

    const mockStadiums = [
      {
        id: "1",
        name: "Wankhede Stadium",
        publicName: "Wankhede",
        country: "India",
        state: "Maharashtra",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        name: "M. Chinnaswamy Stadium",
        publicName: "Chinnaswamy",
        country: "India",
        state: "Karnataka",
        createdAt: "2024-01-14T15:20:00Z",
        updatedAt: "2024-01-14T15:20:00Z",
      },
      {
        id: "3",
        name: "Eden Gardens",
        publicName: "Eden Gardens",
        country: "India",
        state: "West Bengal",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
      },
      {
        id: "4",
        name: "Narendra Modi Stadium",
        publicName: "Motera",
        country: "India",
        state: "Gujarat",
        createdAt: "2024-01-12T14:45:00Z",
        updatedAt: "2024-01-12T14:45:00Z",
      },
      {
        id: "5",
        name: "Lord's Cricket Ground",
        publicName: "Lord's",
        country: "England",
        state: "London",
        createdAt: "2024-01-11T11:30:00Z",
        updatedAt: "2024-01-11T11:30:00Z",
      },
    ];

    dispatch(setPlayers(mockPlayers));
    dispatch(setStadiums(mockStadiums));
  }, [dispatch]);

  const fetchAutoSearch = (query: any) => {
    return StatsAutoSearch({ srchValue: query, type: activeTab }).then(
      (res) => {
        return res.data.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.name,
        }));
      }
    );
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm("Are you sure you want to delete this player?")) {
      dispatch(deletePlayer(playerId));
      toast.success("Player deleted successfully!");
    }
  };

  const handleDeleteStadium = (stadiumId: string) => {
    if (confirm("Are you sure you want to delete this stadium?")) {
      dispatch(deleteStadium(stadiumId));
      toast.success("Stadium deleted successfully!");
    }
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.publicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStadiums = stadiums.filter(
    (stadium) =>
      stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.publicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stadium.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const initialValues =
    actionType === "add"
      ? { originalName: "", publicName: "", type: activeTab }
      : { originalName: "", publicName: "", type: activeTab };

  const handelFormSubmit = (value: any) => {
    setIsLoading(true);
    const reqData = {
      originalName: value.originalName.value,
      publicName: value.publicName,
      type: value.type,
    };
    if (actionType === "add") {
      StatsCreate(reqData)
        .then((res) => {
          setIsLoading(false);
          toast.success(res.message);
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(
            err.message || "Failed to save details. Please try again."
          );
        });
    }
    if (actionType === "edit") {
      StatsUpdate(reqData)
        .then((res) => {
          setIsLoading(false);
          toast.success(res.message);
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(
            err.message || "Failed to save details. Please try again."
          );
        });
    }

    setModalOpen(false);
    setActionType("add");
  };

  const handelModal = () => {
    setActionType("add");
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    console.log(item);
  };

  const handleDelete = (item: any) => {
    console.log(item);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Stats Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage players and stadium information
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Players
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {players.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Stadiums
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stadiums.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Countries
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(stadiums.map((s) => s.country)).size}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Teams
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(players.map((p) => p.team)).size}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span>Database Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="player">
                  Players ({players.length})
                </TabsTrigger>
                <TabsTrigger value="stadium">
                  Stadiums ({stadiums.length})
                </TabsTrigger>
              </TabsList>

              {/* Search and Actions */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handelModal}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {`Add ${activeTab === "player" ? "Player" : "Stadium"}`}
                  </Button>
                </div>
              </div>

              <TabsContent value="player" className="space-y-4">
                {filteredPlayers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {player.originalName}
                                </h3>
                                <Badge variant="secondary">
                                  {player.publicName}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4" />
                                  <span>{player.team}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(player.dob).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    Added:{" "}
                                    {new Date(
                                      player.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 lg:mt-0 flex items-center space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(player)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Player
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(player.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Player
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No players found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "Add your first player to get started"}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stadium" className="space-y-4">
                {filteredStadiums.length > 0 ? (
                  <div className="space-y-4">
                    {filteredStadiums.map((stadium) => (
                      <div
                        key={stadium.id}
                        className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <Building className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {stadium.name}
                                </h3>
                                <Badge variant="secondary">
                                  {stadium.publicName}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Globe className="h-4 w-4" />
                                  <span>{stadium.country}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{stadium.state}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    Added:{" "}
                                    {new Date(
                                      stadium.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 lg:mt-0 flex items-center space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(stadium)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Stadium
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(stadium.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Stadium
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No stadiums found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "Add your first stadium to get started"}
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
                ? `Add ${activeTab === "player" ? "Player" : "Stadium"}`
                : `Edit ${activeTab === "player" ? "Player" : "Stadium"}`}
            </DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={initialValues}
            validationSchema={statsValidationFrontend}
            onSubmit={handelFormSubmit}
          >
            {({ handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                  <div className="space-y-2">
                    <Field
                      label="Original Name"
                      component={FormikAutoSelectField}
                      name="originalName"
                      loadOptions={fetchAutoSearch}
                      onChange={(e: any) => setFieldValue("originalName", e)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Field
                      label="Public Name"
                      component={FormikTextInput}
                      name="publicName"
                    />
                  </div>
                  <div className="space-y-2">
                    <Field
                      label="Type"
                      name="type"
                      disabled
                      component={FormikSelectField}
                      options={[
                        { label: "Player", value: "player" },
                        { label: "Stadium", value: "stadium" },
                      ]}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {actionType === "add"
                      ? `Add ${activeTab === "player" ? "Player" : "Stadium"}`
                      : `Update ${
                          activeTab === "player" ? "Player" : "Stadium"
                        }`}
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

export default AdminStatsPage;
