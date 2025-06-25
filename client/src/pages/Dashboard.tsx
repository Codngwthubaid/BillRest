import React, { useState, useEffect } from 'react';
import { FileText, Package, DollarSign, Calendar, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { getInvoices } from '@/services/invoiceService';
import { getSalesReport } from '@/services/reportService';
import { getProducts } from '@/services/productService';
import OnboardingModal from '@/components/OnboardingModel';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Product {
  name: string;
  quantity: number;
  totalSales: number;
}

interface SalesReport {
  totalSales: number;
  count: number;
  topProducts: Product[];
}

const Dashboard: React.FC = () => {
  const { user, token, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [productsCount, setProductsCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.isOnboarded && user.role === 'customer') {
      setShowOnboarding(true);
    }

    const fetchData = async () => {
      if (!token || !user) return;
      setLoading(true);
      try {
        // Fetch invoices
        const invoicesData = await getInvoices();
        setInvoices(invoicesData.slice(0, 4)); // Limit to 4 recent invoices

        // Fetch sales report (custom range for last 30 days)
        const today = new Date();
        const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const salesData = await getSalesReport('custom', startDate.toISOString(), today.toISOString());
        setSalesReport(salesData);

        // Fetch products count
        if (user.role === 'master' || user.role === 'customer') {
          const productsData = await getProducts();
          setProductsCount(productsData.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const dashboardStats = [
    {
      title: 'Total Sales',
      value: salesReport ? `₹${salesReport.totalSales.toLocaleString('en-IN')}` : '₹0',
      icon: DollarSign,
      color: 'bg-green-500',
      roles: ['master', 'customer'],
    },
    {
      title: 'Invoices',
      value: salesReport ? salesReport.count.toString() : '0',
      icon: FileText,
      color: 'bg-blue-500',
      roles: ['master', 'customer', 'support'],
    },
    {
      title: 'Products',
      value: productsCount.toString(),
      icon: Package,
      color: 'bg-purple-500',
      roles: ['master', 'customer'],
    },
  ];

  const filteredStats = dashboardStats.filter(stat =>
    user && stat.roles.includes(user.role)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          filteredStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Invoices</CardTitle>
              <Link to="/invoices" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading invoices...</p>
            ) : invoices.length === 0 ? (
              <p>No invoices found.</p>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">{invoice.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{invoice.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        {(user?.role === 'master' || user?.role === 'customer') && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Products</CardTitle>
                <Link to="/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading products...</p>
              ) : salesReport?.topProducts.length === 0 ? (
                <p>No products found.</p>
              ) : (
                <div className="space-y-4">
                  {salesReport?.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{product.totalSales.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="flex items-center justify-center space-x-3">
              <Link to="/invoices/create">
                <FileText className="w-5 h-5" />
                <span>Create Invoice</span>
              </Link>
            </Button>
            {(user?.role === 'master' || user?.role === 'customer') && (
              <Button asChild className="flex items-center justify-center space-x-3">
                <Link to="/products/create">
                  <Package className="w-5 h-5" />
                  <span>Add Product</span>
                </Link>
              </Button>
            )}
            <Button asChild className="flex items-center justify-center space-x-3">
              <Link to="/customers/create">
                <Package className="w-5 h-5" />
                <span>Add Customer</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
};

export default Dashboard;