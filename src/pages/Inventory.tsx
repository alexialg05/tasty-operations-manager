
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/ui/custom/Card';
import ChipBadge from '@/components/ui/custom/ChipBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, Package, Plus, Search, Trash2 } from 'lucide-react';
import { Product } from '@/types';

// Mock data
const categories = [
  { id: 'meat', name: 'Meat & Protein' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'grains', name: 'Grains & Bread' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'condiments', name: 'Condiments' },
];

const suppliers = [
  { id: 'supplier1', name: 'Farm Fresh Inc.' },
  { id: 'supplier2', name: 'Global Foods Ltd.' },
  { id: 'supplier3', name: 'City Beverages' },
  { id: 'supplier4', name: 'Premium Meats Co.' },
];

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Tomatoes',
    category: 'vegetables',
    quantity: 8,
    purchasePrice: 2.5,
    sellingPrice: 3.99,
    supplier: 'supplier1',
    minStockLevel: 10,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-10'),
  },
  {
    id: 'p2',
    name: 'Ground Beef',
    category: 'meat',
    quantity: 25,
    purchasePrice: 5.75,
    sellingPrice: 8.99,
    supplier: 'supplier4',
    minStockLevel: 15,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-06-05'),
  },
  {
    id: 'p3',
    name: 'Cheddar Cheese',
    category: 'dairy',
    quantity: 30,
    purchasePrice: 4.25,
    sellingPrice: 6.99,
    supplier: 'supplier2',
    minStockLevel: 20,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-05-28'),
  },
  {
    id: 'p4',
    name: 'Burger Buns',
    category: 'grains',
    quantity: 40,
    purchasePrice: 3.15,
    sellingPrice: 4.99,
    supplier: 'supplier2',
    minStockLevel: 25,
    createdAt: new Date('2023-01-25'),
    updatedAt: new Date('2023-06-12'),
  },
  {
    id: 'p5',
    name: 'Lettuce',
    category: 'vegetables',
    quantity: 12,
    purchasePrice: 1.75,
    sellingPrice: 2.99,
    supplier: 'supplier1',
    minStockLevel: 15,
    createdAt: new Date('2023-02-05'),
    updatedAt: new Date('2023-06-08'),
  },
  {
    id: 'p6',
    name: 'Chicken Breast',
    category: 'meat',
    quantity: 18,
    purchasePrice: 6.50,
    sellingPrice: 9.99,
    supplier: 'supplier4',
    minStockLevel: 12,
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-05-30'),
  },
  {
    id: 'p7',
    name: 'Coca-Cola (24 pack)',
    category: 'beverages',
    quantity: 15,
    purchasePrice: 10.99,
    sellingPrice: 15.99,
    supplier: 'supplier3',
    minStockLevel: 10,
    createdAt: new Date('2023-01-30'),
    updatedAt: new Date('2023-06-02'),
  },
  {
    id: 'p8',
    name: 'Ketchup',
    category: 'condiments',
    quantity: 22,
    purchasePrice: 2.25,
    sellingPrice: 3.49,
    supplier: 'supplier2',
    minStockLevel: 15,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-06-01'),
  },
];

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    supplier: '',
    minStockLevel: 10,
  });

  // Filtered products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories.find(c => c.id === product.category)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suppliers.find(s => s.id === product.supplier)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'all' || 
      activeCategory === 'low-stock' ? 
        (product.quantity <= product.minStockLevel) : 
        product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle input change for new product form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['quantity', 'purchasePrice', 'sellingPrice', 'minStockLevel'];
    
    if (numericFields.includes(name)) {
      setNewProduct({
        ...newProduct,
        [name]: parseFloat(value) || 0
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value
      });
    }
  };

  // Handle select change for new product form
  const handleSelectChange = (name: string, value: string) => {
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  // Handle adding new product
  const handleAddProduct = () => {
    // Simple validation
    if (!newProduct.name || !newProduct.category || !newProduct.supplier) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newProductWithId: Product = {
      id: `p${Date.now()}`,
      ...newProduct,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setProducts([newProductWithId, ...products]);
    toast({
      title: "Product added",
      description: `${newProductWithId.name} has been added to inventory`
    });
    
    // Reset form and close dialog
    setNewProduct({
      name: '',
      category: '',
      quantity: 0,
      purchasePrice: 0,
      sellingPrice: 0,
      supplier: '',
      minStockLevel: 10,
    });
    setNewProductOpen(false);
  };

  // Count low stock items
  const lowStockCount = products.filter(p => p.quantity <= p.minStockLevel).length;

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <ChipBadge variant="primary">Inventory</ChipBadge>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Inventory Management</h1>
          </div>
          
          <div>
            <Dialog open={newProductOpen} onOpenChange={setNewProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your inventory. Fill in all the required fields.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name*</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category*</Label>
                      <Select 
                        value={newProduct.category} 
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity*</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={newProduct.quantity}
                        onChange={handleInputChange}
                        min={0}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minStockLevel">Minimum Stock Level*</Label>
                      <Input
                        id="minStockLevel"
                        name="minStockLevel"
                        type="number"
                        value={newProduct.minStockLevel}
                        onChange={handleInputChange}
                        min={1}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase Price ($)*</Label>
                      <Input
                        id="purchasePrice"
                        name="purchasePrice"
                        type="number"
                        value={newProduct.purchasePrice}
                        onChange={handleInputChange}
                        min={0}
                        step={0.01}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">Selling Price ($)*</Label>
                      <Input
                        id="sellingPrice"
                        name="sellingPrice"
                        type="number"
                        value={newProduct.sellingPrice}
                        onChange={handleInputChange}
                        min={0}
                        step={0.01}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier*</Label>
                    <Select 
                      value={newProduct.supplier} 
                      onValueChange={(value) => handleSelectChange('supplier', value)}
                    >
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setNewProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {lowStockCount > 0 && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Low Stock Alert</AlertTitle>
            <AlertDescription>
              {lowStockCount} {lowStockCount === 1 ? 'product is' : 'products are'} below the minimum stock level and need to be restocked.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="low-stock" className="relative">
                    Low Stock
                    {lowStockCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                        {lowStockCount}
                      </span>
                    )}
                  </TabsTrigger>
                  {categories.map(category => (
                    <TabsTrigger key={category.id} value={category.id} className="hidden md:inline-flex">
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 text-sm font-medium">
                <div className="col-span-4 md:col-span-3">Product</div>
                <div className="col-span-2 md:col-span-2">Category</div>
                <div className="col-span-2 md:col-span-1 text-center">Stock</div>
                <div className="hidden md:block md:col-span-2">Supplier</div>
                <div className="col-span-2 md:col-span-1 text-right">Price</div>
                <div className="col-span-2 md:col-span-2 text-right">Actions</div>
              </div>
              
              <div className="divide-y">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-12 gap-4 p-4 items-center text-sm"
                    >
                      <div className="col-span-4 md:col-span-3 font-medium">
                        {product.name}
                      </div>
                      <div className="col-span-2 md:col-span-2 text-muted-foreground">
                        {categories.find(c => c.id === product.category)?.name}
                      </div>
                      <div className="col-span-2 md:col-span-1 text-center">
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs",
                          product.quantity <= product.minStockLevel 
                            ? "bg-destructive/10 text-destructive" 
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        )}>
                          {product.quantity} {product.quantity <= product.minStockLevel && "⚠️"}
                        </div>
                      </div>
                      <div className="hidden md:block md:col-span-2 text-muted-foreground">
                        {suppliers.find(s => s.id === product.supplier)?.name}
                      </div>
                      <div className="col-span-2 md:col-span-1 text-right font-medium">
                        ${product.sellingPrice.toFixed(2)}
                      </div>
                      <div className="col-span-2 md:col-span-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-semibold">No products found</h3>
                    <p className="text-muted-foreground mt-2">
                      No products match your current filters or search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4 text-muted-foreground">
            <Info className="h-5 w-5" />
            <p className="text-sm">
              Products with stock levels below the minimum threshold are marked and counted in the Low Stock tab.
              You can adjust the minimum stock level for each product when editing.
            </p>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Inventory;
