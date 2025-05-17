
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, User, Clock, CalendarCheck, FileText, Users, Settings, 
  Menu, LogOut, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/types';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, to, active, onClick }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full py-3 px-4 rounded-md transition-colors ${
        active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    { 
      icon: <Home size={20} />, 
      label: 'Dashboard', 
      to: '/dashboard',
      allowed: [UserRole.Admin, UserRole.HR, UserRole.Employee]
    },
    { 
      icon: <User size={20} />, 
      label: 'Profile', 
      to: '/profile',
      allowed: [UserRole.Admin, UserRole.HR, UserRole.Employee]
    },
    { 
      icon: <Clock size={20} />, 
      label: 'Time & Attendance', 
      to: '/attendance',
      allowed: [UserRole.Admin, UserRole.HR, UserRole.Employee]
    },
    { 
      icon: <CalendarCheck size={20} />, 
      label: 'Leave Management', 
      to: '/leave',
      allowed: [UserRole.Admin, UserRole.HR, UserRole.Employee]
    },
    { 
      icon: <FileText size={20} />, 
      label: 'Payroll', 
      to: '/payroll',
      allowed: [UserRole.Admin, UserRole.HR, UserRole.Employee]
    },
    { 
      icon: <Users size={20} />, 
      label: 'Employee Management', 
      to: '/employees',
      allowed: [UserRole.Admin, UserRole.HR]
    },
    { 
      icon: <Settings size={20} />, 
      label: 'Settings', 
      to: '/settings',
      allowed: [UserRole.Admin]
    }
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(
    item => user && item.allowed.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <button
          className={`fixed z-50 top-4 ${sidebarOpen ? 'left-64' : 'left-4'} bg-hrms-primary text-white p-2 rounded-md`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
      
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative w-64 h-full bg-sidebar transition-transform duration-300 ease-in-out z-40 md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex justify-center">
            <div className="text-white text-2xl font-bold">
              <span className="text-hrms-secondary">HR</span>
              <span>MS</span>
            </div>
          </div>
          
          {/* User info */}
          <div className="px-4 py-2 border-b border-sidebar-border flex items-center mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {user?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 text-white">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs opacity-75 capitalize">{user?.role}</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {filteredMenuItems.map((item) => (
              <SidebarItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname.startsWith(item.to)}
                onClick={() => navigateTo(item.to)}
              />
            ))}
          </nav>
          
          {/* Logout button */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full flex items-center text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={logout}
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {filteredMenuItems.find(item => location.pathname.startsWith(item.to))?.label || 'HR Management System'}
          </h1>
          
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-hrms-primary/20 text-hrms-primary">
                {user?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
