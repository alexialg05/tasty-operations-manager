
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/ui/custom/Card';
import ChipBadge from '@/components/ui/custom/ChipBadge';
import { useToast } from '@/hooks/use-toast';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { DashboardStats, Sale, Product, Employee } from '@/types';

// Mock data
const mockSalesData = [
  { date: 'Mon', sales: 4000 },
  { date: 'Tue', sales: 3000 },
  { date: 'Wed', sales: 5000 },
  { date: 'Thu', sales: 2780 },
  { date: 'Fri', sales: 6890 },
  { date: 'Sat', sales: 8390 },
  { date: 'Sun', sales: 4490 },
];

const mockProductsData = [
  { name: 'Burger', sales: 400 },
  { name: 'Pizza', sales: 300 },
  { name: 'Salad', sales: 200 },
  { name: 'Pasta', sales: 170 },
  { name: 'Steak', sales: 150 },
];

const mockStats: DashboardStats = {
  totalSalesToday: 2560,
  totalSalesWeek: 15670,
  totalSalesMonth: 68420,
  lowStockItems: 5,
  activeEmployees: 12,
  topProducts: [
    { productName: 'Burger', quantity: 42, total: 420 },
    { productName: 'Pizza', quantity: 38, total: 570 },
    { productName: 'Steak', quantity: 25, total: 625 },
  ]
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-secondary rounded-md"></div>
          <div className="h-64 w-full max-w-4xl bg-secondary rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <ChipBadge variant="primary">Dashboard</ChipBadge>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Restaurant Overview</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Today's Sales</p>
                <h3 className="text-2xl font-bold">${stats?.totalSalesToday.toLocaleString()}</h3>
                <p className="text-xs text-muted-foreground mt-1">+4.5% from yesterday</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign size={20} />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Weekly Sales</p>
                <h3 className="text-2xl font-bold">${stats?.totalSalesWeek.toLocaleString()}</h3>
                <p className="text-xs text-muted-foreground mt-1">+2.1% from last week</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingCart size={20} />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Low Stock Items</p>
                <h3 className="text-2xl font-bold">{stats?.lowStockItems}</h3>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 dark:bg-amber-900/30 dark:text-amber-500">
                <Package size={20} />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Employees</p>
                <h3 className="text-2xl font-bold">{stats?.activeEmployees}</h3>
                <p className="text-xs text-muted-foreground mt-1">Working today</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users size={20} />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-4 sm:p-6 col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Weekly Sales</h3>
              <ChipBadge variant="success" size="sm">+18% from last week</ChipBadge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockSalesData}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value: number) => [`$${value}`, 'Sales']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Top Products</h3>
              <ChipBadge variant="secondary" size="sm">This Week</ChipBadge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockProductsData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    type="number" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value: number) => [`${value} units`, 'Sold']}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Latest Activity */}
        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <ChipBadge variant="secondary" size="sm">Today</ChipBadge>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {i % 3 === 0 && <ShoppingCart size={18} />}
                  {i % 3 === 1 && <Package size={18} />}
                  {i % 3 === 2 && <Users size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {i % 3 === 0 && 'New sale completed'}
                    {i % 3 === 1 && 'Inventory item running low'}
                    {i % 3 === 2 && 'New employee shift started'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {i % 3 === 0 && 'Order #1234 - $89.99'}
                    {i % 3 === 1 && 'Tomatoes (3 units remaining)'}
                    {i % 3 === 2 && 'Juan Pérez - Waiter (8:00 AM - 4:00 PM)'}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {Math.floor(Math.random() * 50) + 10}m ago
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
