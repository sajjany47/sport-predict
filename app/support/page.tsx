'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { setComplaints, addComplaint } from '@/store/slices/helpdeskSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Send,
  Ticket,
  Users,
  BookOpen,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { complaints } = useSelector((state: RootState) => state.helpdesk);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  // Mock complaints data
  useEffect(() => {
    const mockComplaints = [
      {
        id: 'TKT-001',
        subject: 'Payment not processed',
        description: 'My payment for Pro plan was deducted but subscription not activated',
        matchId: undefined,
        status: 'in-progress' as const,
        createdAt: '2025-01-10T10:30:00Z',
        updatedAt: '2025-01-11T14:20:00Z',
      },
      {
        id: 'TKT-002',
        subject: 'Prediction accuracy issue',
        description: 'The AI prediction for match IND vs AUS was completely wrong',
        matchId: '123',
        status: 'resolved' as const,
        createdAt: '2025-01-08T16:45:00Z',
        updatedAt: '2025-01-09T09:15:00Z',
      },
      {
        id: 'TKT-003',
        subject: 'Credits not deducted properly',
        description: 'Used prediction but credits were deducted twice',
        matchId: undefined,
        status: 'open' as const,
        createdAt: '2025-01-12T08:20:00Z',
        updatedAt: '2025-01-12T08:20:00Z',
      },
    ];
    
    dispatch(setComplaints(mockComplaints));
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTicketForm({
      ...ticketForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTicket = {
        id: `TKT-${String(complaints.length + 1).padStart(3, '0')}`,
        subject: ticketForm.subject,
        description: ticketForm.description,
        status: 'open' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addComplaint(newTicket));
      setTicketForm({ subject: '', description: '', category: 'general', priority: 'medium' });
      setIsCreateTicketOpen(false);
      toast.success('Support ticket created successfully!');
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeTab === 'all' || complaint.status === activeTab;
    
    return matchesSearch && matchesStatus;
  });

  const openTickets = complaints.filter(c => c.status === 'open').length;
  const inProgressTickets = complaints.filter(c => c.status === 'in-progress').length;
  const resolvedTickets = complaints.filter(c => c.status === 'resolved').length;

  const faqs = [
    {
      question: 'How accurate are the AI predictions?',
      answer: 'Our AI predictions have a 95%+ accuracy rate based on historical data analysis, player form, weather conditions, and 50+ other factors.',
    },
    {
      question: 'How do credits work?',
      answer: 'Each prediction costs 1 credit. Free users get 2 daily credits, Pro users get 50 monthly credits, and Elite users get 150 monthly credits.',
    },
    {
      question: 'Can I get a refund if predictions are wrong?',
      answer: 'We offer credits back for technical issues, but predictions are based on probability and cannot be guaranteed. Please check our refund policy.',
    },
    {
      question: 'How often are player stats updated?',
      answer: 'Player statistics are updated in real-time during matches and within 24 hours after match completion.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use bank-grade encryption and comply with PCI DSS standards. We never store your complete payment details.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Support Center
              </h1>
              <p className="text-xl text-gray-600">
                Get help with your SportPredict experience
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Brief description of your issue"
                        value={ticketForm.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        value={ticketForm.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General</option>
                        <option value="payment">Payment</option>
                        <option value="prediction">Prediction</option>
                        <option value="technical">Technical</option>
                        <option value="account">Account</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        name="priority"
                        value={ticketForm.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Please provide detailed information about your issue"
                        value={ticketForm.description}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Create Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Open Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">{openTickets}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressTickets}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{resolvedTickets}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Response</p>
                  <p className="text-2xl font-bold text-gray-900">2h</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tickets */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Tickets */}
            {isAuthenticated ? (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Ticket className="h-5 w-5 text-blue-600" />
                    <span>My Support Tickets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="all">
                        All ({complaints.length})
                      </TabsTrigger>
                      <TabsTrigger value="open">
                        Open ({openTickets})
                      </TabsTrigger>
                      <TabsTrigger value="in-progress">
                        In Progress ({inProgressTickets})
                      </TabsTrigger>
                      <TabsTrigger value="resolved">
                        Resolved ({resolvedTickets})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="space-y-4">
                      {filteredComplaints.length > 0 ? (
                        <div className="space-y-4">
                          {filteredComplaints.map((ticket) => (
                            <div key={ticket.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <MessageSquare className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                                    <p className="text-sm text-gray-600">Ticket #{ticket.id}</p>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(ticket.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(ticket.status)}
                                    <span className="capitalize">{ticket.status.replace('-', ' ')}</span>
                                  </div>
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-3 line-clamp-2">{ticket.description}</p>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
                          <p className="text-gray-600 mb-6">
                            {searchTerm ? 'Try adjusting your search criteria' : 'You haven\'t created any support tickets yet'}
                          </p>
                          {!searchTerm && (
                            <Button onClick={() => setIsCreateTicketOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Your First Ticket
                            </Button>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-6">Please login to view and manage your support tickets</p>
                  <Button asChild>
                    <a href="/auth/login">Login to Continue</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* FAQ Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-gray-600">support@sportpredict.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Phone Support</p>
                    <p className="text-gray-600">+91 9876543210</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Office Address</p>
                    <p className="text-gray-600">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Support Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Urgent issues are handled 24/7 for Pro and Elite users.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Need Immediate Help?</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Help Articles
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Live Chat Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Request Callback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;