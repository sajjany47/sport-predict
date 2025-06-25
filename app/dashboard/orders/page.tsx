'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { setOrderHistory } from '@/store/slices/subscriptionSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Calendar, 
  Search, 
  Download, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Receipt,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const OrderHistoryPage = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { orderHistory } = useSelector((state: RootState) => state.subscription);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Mock order history data
  useEffect(() => {
    const mockOrderHistory = [
      {
        id: '1',
        plan: 'Pro',
        amount: 299,
        date: '2025-01-10',
        status: 'completed' as const,
      },
      {
        id: '2',
        plan: 'Elite',
        amount: 599,
        date: '2024-12-15',
        status: 'completed' as const,
      },
      {
        id: '3',
        plan: 'Pro',
        amount: 299,
        date: '2024-11-20',
        status: 'completed' as const,
      },
      {
        id: '4',
        plan: 'Elite',
        amount: 599,
        date: '2024-10-25',
        status: 'failed' as const,
      },
      {
        id: '5',
        plan: 'Pro',
        amount: 299,
        date: '2024-09-30',
        status: 'completed' as const,
      },
    ];
    
    dispatch(setOrderHistory(mockOrderHistory));
  }, [dispatch]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orderHistory.filter(order => {
    const matchesSearch = 
      order.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = activeTab === 'all' || order.status === activeTab;
    
    return matchesSearch && matchesStatus;
  });

  const totalSpent = orderHistory
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  const completedOrders = orderHistory.filter(order => order.status === 'completed').length;
  const pendingOrders = orderHistory.filter(order => order.status === 'pending').length;
  const failedOrders = orderHistory.filter(order => order.status === 'failed').length;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Order History
              </h1>
              <p className="text-xl text-gray-600">
                Track all your subscription purchases and payments
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalSpent}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">{failedOrders}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID or plan name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              <span>Transaction History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">
                  All ({orderHistory.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedOrders})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingOrders})
                </TabsTrigger>
                <TabsTrigger value="failed">
                  Failed ({failedOrders})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <CreditCard className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {order.plan} Plan Subscription
                                </h3>
                                <Badge className={getStatusColor(order.status)}>
                                  <div className="flex items-center space-x-1">
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status}</span>
                                  </div>
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Receipt className="h-4 w-4" />
                                  <span>Order #{order.id}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 text-right">
                            <p className="text-2xl font-bold text-gray-900">₹{order.amount}</p>
                            <p className="text-sm text-gray-600">
                              {order.status === 'completed' ? 'Paid' : 
                               order.status === 'pending' ? 'Processing' : 'Failed'}
                            </p>
                          </div>
                        </div>
                        
                        {order.status === 'completed' && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span>Payment successful</span>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {order.status === 'failed' && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-red-600">
                                <XCircle className="h-4 w-4" />
                                <span>Payment failed - Please try again</span>
                              </div>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Retry Payment
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? 'Try adjusting your search criteria' : 'You haven\'t made any purchases yet'}
                    </p>
                    {!searchTerm && (
                      <Button asChild>
                        <a href="/subscription">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Browse Plans
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Need More Credits?</h3>
                  <p className="text-gray-600 text-sm mb-3">Upgrade your plan to get more prediction credits</p>
                  <Button size="sm" asChild>
                    <a href="/subscription">
                      View Plans
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Track Your Wins</h3>
                  <p className="text-gray-600 text-sm mb-3">See how our predictions are helping you win</p>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/dashboard">
                      View Dashboard
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;