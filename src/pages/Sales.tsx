
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/ui/custom/Card';
import ChipBadge from '@/components/ui/custom/ChipBadge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, FileDown, FileUp, Plus, Search, ShoppingCart } from 'lucide-react';
import { Sale, SaleItem } from '@/types';

// Mock data
const mockSales: Sale[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `sale-${i + 1}`,
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  items: [
    {
      productId: 'p1',
      productName: 'Burger',
      quantity: Math.floor(Math.random() * 3) + 1,
      unitPrice: 9.99,
      total: 9.99 * (Math.floor(Math.random() * 3) + 1)
    },
    {
      productId: 'p2',
      productName: 'Fries',
      quantity: Math.floor(Math.random() * 2) + 1,
      unitPrice: 3.99,
      total: 3.99 * (Math.floor(Math.random() * 2) + 1)
    }
  ],
  totalAmount: (9.99 * (Math.floor(Math.random() * 3) + 1)) + (3.99 * (Math.floor(Math.random() * 2) + 1)),
  paymentMethod: i % 2 === 0 ? 'cash' : 'card',
  cashierId: 'user-1',
  notes: i % 3 === 0 ? 'Customer requested extra sauce' : undefined
}));

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash' },
  { id: 'card', name: 'Credit/Debit Card' },
  { id: 'transfer', name: 'Bank Transfer' }
];

const PRODUCTS = [
  { id: 'p1', name: 'Burger', price: 9.99 },
  { id: 'p2', name: 'Fries', price: 3.99 },
  { id: 'p3', name: 'Pizza', price: 12.99 },
  { id: 'p4', name: 'Salad', price: 7.99 },
  { id: 'p5', name: 'Soda', price: 1.99 },
  { id: 'p6', name: 'Pasta', price: 11.99 },
  { id: 'p7', name: 'Dessert', price: 5.99 }
];

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newSaleOpen, setNewSaleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  // Filtered sales based on search and tab
  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      searchQuery === '' || 
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'today' && isSameDay(sale.date, new Date())) ||
      (activeTab === 'week' && isThisWeek(sale.date)) ||
      (activeTab === 'month' && isThisMonth(sale.date));
    
    return matchesSearch && matchesTab;
  });

  // Helper functions
  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  function isThisWeek(date: Date): boolean {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return date >= weekStart && date < weekEnd;
  }

  function isThisMonth(date: Date): boolean {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  // Handle adding product to sale
  const addItemToSale = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItemIndex = saleItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Increment quantity if product already in cart
      const updatedItems = [...saleItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total = 
        updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;
      setSaleItems(updatedItems);
    } else {
      // Add new item
      setSaleItems([...saleItems, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      }]);
    }
  };

  // Handle removing item from sale
  const removeItemFromSale = (productId: string) => {
    setSaleItems(saleItems.filter(item => item.productId !== productId));
  };

  // Handle changing item quantity
  const changeItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromSale(productId);
      return;
    }

    setSaleItems(saleItems.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity,
          total: quantity * item.unitPrice
        };
      }
      return item;
    }));
  };

  // Calculate total
  const calculateTotal = () => {
    return saleItems.reduce((acc, item) => acc + item.total, 0);
  };

  // Handle submitting new sale
  const handleSubmitSale = () => {
    if (saleItems.length === 0) {
      toast({
        title: "Empty sale",
        description: "Please add at least one product to the sale",
        variant: "destructive"
      });
      return;
    }

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      date: selectedDate || new Date(),
      items: [...saleItems],
      totalAmount: calculateTotal(),
      paymentMethod,
      cashierId: 'user-1', // In a real app, this would be the logged in user
      notes: notes.trim() || undefined
    };

    setSales([newSale, ...sales]);
    toast({
      title: "Sale completed",
      description: `Sale #${newSale.id} for $${newSale.totalAmount.toFixed(2)} has been registered`,
    });
    
    // Reset form
    setSaleItems([]);
    setPaymentMethod('cash');
    setNotes('');
    setNewSaleOpen(false);
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <ChipBadge variant="primary">Sales</ChipBadge>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Sales Management</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={newSaleOpen} onOpenChange={setNewSaleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Register New Sale</DialogTitle>
                  <DialogDescription>
                    Create a new sale record with the selected products.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="space-y-2 flex-1">
                        <Label>Sale Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? (
                                format(selectedDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <Label>Payment Method</Label>
                        <Select 
                          value={paymentMethod} 
                          onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card' | 'transfer')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_METHODS.map(method => (
                              <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Products</Label>
                      <Select onValueChange={addItemToSale}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCTS.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {saleItems.length > 0 && (
                      <div className="border rounded-md overflow-hidden">
                        <div className="p-3 bg-secondary text-sm font-medium grid grid-cols-12 gap-2">
                          <div className="col-span-5">Product</div>
                          <div className="col-span-2 text-center">Price</div>
                          <div className="col-span-2 text-center">Qty</div>
                          <div className="col-span-2 text-center">Total</div>
                          <div className="col-span-1"></div>
                        </div>
                        <div className="divide-y">
                          {saleItems.map((item) => (
                            <div key={item.productId} className="p-3 grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-5 font-medium">{item.productName}</div>
                              <div className="col-span-2 text-center">${item.unitPrice.toFixed(2)}</div>
                              <div className="col-span-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => changeItemQuantity(item.productId, item.quantity - 1)}
                                  >
                                    -
                                  </Button>
                                  <span className="w-6 text-center">{item.quantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => changeItemQuantity(item.productId, item.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <div className="col-span-2 text-center font-medium">${item.total.toFixed(2)}</div>
                              <div className="col-span-1 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeItemFromSale(item.productId)}
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-secondary flex justify-between items-center font-medium">
                          <span>Total</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Input
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any notes about this sale"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setNewSaleOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitSale}>
                      Complete Sale
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex gap-2">
              <Button variant="outline" className="sm:w-auto">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
              
              <Button variant="outline" className="sm:w-auto">
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Sales</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sales..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 text-sm font-medium">
                <div className="col-span-4 sm:col-span-3 md:col-span-2">Sale ID</div>
                <div className="col-span-4 sm:col-span-3 md:col-span-2">Date</div>
                <div className="hidden md:block md:col-span-3">Items</div>
                <div className="col-span-4 sm:col-span-3 md:col-span-2 text-right">Total</div>
                <div className="hidden sm:block sm:col-span-3 md:col-span-2">Payment</div>
                <div className="hidden md:block md:col-span-1 text-right">Action</div>
              </div>
              
              <div className="divide-y">
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale, index) => (
                    <motion.div
                      key={sale.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-12 gap-4 p-4 items-center text-sm"
                    >
                      <div className="col-span-4 sm:col-span-3 md:col-span-2 font-medium">
                        {sale.id}
                      </div>
                      <div className="col-span-4 sm:col-span-3 md:col-span-2 text-muted-foreground">
                        {format(sale.date, 'MMM dd, yyyy')}
                      </div>
                      <div className="hidden md:block md:col-span-3">
                        {sale.items.map(item => (
                          <div key={item.productId} className="flex items-center">
                            <span className="font-medium">{item.quantity}×</span>
                            <span className="ml-1.5">{item.productName}</span>
                          </div>
                        ))}
                      </div>
                      <div className="col-span-4 sm:col-span-3 md:col-span-2 text-right font-medium">
                        ${sale.totalAmount.toFixed(2)}
                      </div>
                      <div className="hidden sm:block sm:col-span-3 md:col-span-2">
                        <ChipBadge
                          variant={sale.paymentMethod === 'cash' ? 'success' : 'primary'}
                          size="sm"
                        >
                          {sale.paymentMethod === 'cash' ? 'Cash' : sale.paymentMethod === 'card' ? 'Card' : 'Transfer'}
                        </ChipBadge>
                      </div>
                      <div className="hidden md:flex md:col-span-1 justify-end">
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-semibold">No sales found</h3>
                    <p className="text-muted-foreground mt-2">
                      No sales match your current filters or search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Sales;
