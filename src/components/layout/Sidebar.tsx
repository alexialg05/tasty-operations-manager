
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Sidebar as SidebarPrimitive, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart3, Calendar, ChevronLeft, LogOut, Package, ShoppingCart, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center group px-3 py-2 rounded-md transition-colors duration-200',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
        )
      }
    >
      <div className="mr-3 text-xl">{icon}</div>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

interface SidebarWrapperProps {
  children: React.ReactNode;
}

export const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarPrimitive defaultCollapsed={isCollapsed} className="transition-all duration-300">
          <SidebarHeader className="border-b border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-display font-semibold"
                  >
                    Restaurant Manager
                  </motion.div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleCollapse} 
                className="h-8 w-8"
              >
                <ChevronLeft 
                  className={cn("h-4 w-4 transition-transform", 
                    isCollapsed ? "rotate-180" : ""
                  )} 
                />
              </Button>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="pt-4">
            <div className="px-4 pb-8">
              <div className="flex items-center justify-center mb-6">
                <Avatar className={cn(
                  "transition-all duration-300",
                  isCollapsed ? "h-10 w-10" : "h-16 w-16"
                )}>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </motion.div>
              )}
            </div>
            
            <nav className="space-y-1 px-2">
              <SidebarLink to="/dashboard" icon={<BarChart3 size={18} />} label="Dashboard" isCollapsed={isCollapsed} />
              <SidebarLink to="/sales" icon={<ShoppingCart size={18} />} label="Sales" isCollapsed={isCollapsed} />
              <SidebarLink to="/inventory" icon={<Package size={18} />} label="Inventory" isCollapsed={isCollapsed} />
              <SidebarLink to="/employees" icon={<Users size={18} />} label="Employees" isCollapsed={isCollapsed} />
              <SidebarLink to="/profile" icon={<User size={18} />} label="Profile" isCollapsed={isCollapsed} />
            </nav>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-border/50 p-4">
            <Button 
              variant="ghost" 
              onClick={logout} 
              className={cn(
                "w-full justify-start",
                isCollapsed ? "px-2" : ""
              )}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Log out</span>}
            </Button>
          </SidebarFooter>
        </SidebarPrimitive>

        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>
      <SidebarTrigger className="fixed right-4 bottom-4 md:hidden" />
    </SidebarProvider>
  );
};

export default SidebarWrapper;
