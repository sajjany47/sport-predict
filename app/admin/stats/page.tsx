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

const AdminStatsPage = () => {
  const { players, stadiums } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("players");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isStadiumModalOpen, setIsStadiumModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [editingStadium, setEditingStadium] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [playerForm, setPlayerForm] = useState({
    originalName: "",
    publicName: "",
    team: "",
    dob: "",
  });

  const [stadiumForm, setStadiumForm] = useState({
    name: "",
    publicName: "",
    country: "",
    state: "",
  });

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

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingPlayer) {
        const updatedPlayer = {
          ...editingPlayer,
          ...playerForm,
          updatedAt: new Date().toISOString(),
        };
        dispatch(updatePlayer(updatedPlayer));
        toast.success("Player updated successfully!");
      } else {
        const newPlayer = {
          id: Date.now().toString(),
          ...playerForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch(addPlayer(newPlayer));
        toast.success("Player added successfully!");
      }

      setPlayerForm({ originalName: "", publicName: "", team: "", dob: "" });
      setEditingPlayer(null);
      setIsPlayerModalOpen(false);
    } catch (error) {
      toast.error("Failed to save player. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStadiumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingStadium) {
        const updatedStadium = {
          ...editingStadium,
          ...stadiumForm,
          updatedAt: new Date().toISOString(),
        };
        dispatch(updateStadium(updatedStadium));
        toast.success("Stadium updated successfully!");
      } else {
        const newStadium = {
          id: Date.now().toString(),
          ...stadiumForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch(addStadium(newStadium));
        toast.success("Stadium added successfully!");
      }

      setStadiumForm({ name: "", publicName: "", country: "", state: "" });
      setEditingStadium(null);
      setIsStadiumModalOpen(false);
    } catch (error) {
      toast.error("Failed to save stadium. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPlayer = (player: any) => {
    setEditingPlayer(player);
    setPlayerForm({
      originalName: player.originalName,
      publicName: player.publicName,
      team: player.team,
      dob: player.dob,
    });
    setIsPlayerModalOpen(true);
  };

  const handleEditStadium = (stadium: any) => {
    setEditingStadium(stadium);
    setStadiumForm({
      name: stadium.name,
      publicName: stadium.publicName,
      country: stadium.country,
      state: stadium.state,
    });
    setIsStadiumModalOpen(true);
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
                <TabsTrigger value="players">
                  Players ({players.length})
                </TabsTrigger>
                <TabsTrigger value="stadiums">
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
                  {activeTab === "players" ? (
                    <Dialog
                      open={isPlayerModalOpen}
                      onOpenChange={setIsPlayerModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Player
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingPlayer ? "Edit Player" : "Add New Player"}
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handlePlayerSubmit}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="originalName">
                              Original Name *
                            </Label>
                            <Input
                              id="originalName"
                              value={playerForm.originalName}
                              onChange={(e) =>
                                setPlayerForm({
                                  ...playerForm,
                                  originalName: e.target.value,
                                })
                              }
                              placeholder="Enter original name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="publicName">Public Name *</Label>
                            <Input
                              id="publicName"
                              value={playerForm.publicName}
                              onChange={(e) =>
                                setPlayerForm({
                                  ...playerForm,
                                  publicName: e.target.value,
                                })
                              }
                              placeholder="Enter public name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="team">Team *</Label>
                            <Input
                              id="team"
                              value={playerForm.team}
                              onChange={(e) =>
                                setPlayerForm({
                                  ...playerForm,
                                  team: e.target.value,
                                })
                              }
                              placeholder="Enter team name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth *</Label>
                            <Input
                              id="dob"
                              type="date"
                              value={playerForm.dob}
                              onChange={(e) =>
                                setPlayerForm({
                                  ...playerForm,
                                  dob: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                          >
                            {isLoading
                              ? "Saving..."
                              : editingPlayer
                              ? "Update Player"
                              : "Add Player"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Dialog
                      open={isStadiumModalOpen}
                      onOpenChange={setIsStadiumModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Stadium
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {editingStadium
                              ? "Edit Stadium"
                              : "Add New Stadium"}
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleStadiumSubmit}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              value={stadiumForm.name}
                              onChange={(e) =>
                                setStadiumForm({
                                  ...stadiumForm,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter stadium name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="publicName">Public Name *</Label>
                            <Input
                              id="publicName"
                              value={stadiumForm.publicName}
                              onChange={(e) =>
                                setStadiumForm({
                                  ...stadiumForm,
                                  publicName: e.target.value,
                                })
                              }
                              placeholder="Enter public name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country *</Label>
                            <Input
                              id="country"
                              value={stadiumForm.country}
                              onChange={(e) =>
                                setStadiumForm({
                                  ...stadiumForm,
                                  country: e.target.value,
                                })
                              }
                              placeholder="Enter country"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              value={stadiumForm.state}
                              onChange={(e) =>
                                setStadiumForm({
                                  ...stadiumForm,
                                  state: e.target.value,
                                })
                              }
                              placeholder="Enter state"
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                          >
                            {isLoading
                              ? "Saving..."
                              : editingStadium
                              ? "Update Stadium"
                              : "Add Stadium"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>

              <TabsContent value="players" className="space-y-4">
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
                                  onClick={() => handleEditPlayer(player)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Player
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeletePlayer(player.id)}
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

              <TabsContent value="stadiums" className="space-y-4">
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
                                  onClick={() => handleEditStadium(stadium)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Stadium
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteStadium(stadium.id)
                                  }
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
    </AdminLayout>
  );
};

export default AdminStatsPage;
