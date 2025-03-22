
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/custom/Card';
import ChipBadge from '@/components/ui/custom/ChipBadge';
import { ArrowRight, BarChart3, Package, ShoppingCart, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const featureCards = [
    {
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
      title: 'Sales Management',
      description: 'Track orders, manage transactions, and generate sales reports with ease.',
      buttonText: 'Explore Sales',
      path: '/sales'
    },
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      title: 'Inventory Control',
      description: 'Monitor stock levels, track ingredients, and get low inventory alerts.',
      buttonText: 'Manage Inventory',
      path: '/inventory'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Employee Scheduling',
      description: 'Create staff schedules, track hours, and manage employee information.',
      buttonText: 'View Schedules',
      path: '/employees'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Analytics Dashboard',
      description: 'Visualize key metrics and insights to make data-driven decisions.',
      buttonText: 'See Dashboard',
      path: '/dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <div className="flex flex-col items-center justify-center pt-20 pb-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <ChipBadge variant="primary" className="mb-4">Restaurant Management System</ChipBadge>
        </motion.div>
        
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          Streamline Your Restaurant Operations
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          An intuitive system to manage sales, inventory, and staff scheduling all in one place.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="px-8"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/dashboard')}
            className="px-8"
          >
            View Demo
          </Button>
        </motion.div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {featureCards.map((feature, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="h-full p-8" variant="elevated">
              <div className="mb-6">{feature.icon}</div>
              <h2 className="text-2xl font-bold mb-3">{feature.title}</h2>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              <div className="mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(feature.path)}
                >
                  {feature.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="bg-muted py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Restaurant Management System • Designed with care • © 2023
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
