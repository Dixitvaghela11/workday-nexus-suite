
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/services/mockData';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('hrmsUser');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('hrmsUser');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Find user by email
        const foundUser = mockUsers.find(u => u.email === email);
        
        if (foundUser && password === 'password') {  // In real app, check hashed password
          setUser(foundUser);
          localStorage.setItem('hrmsUser', JSON.stringify(foundUser));
          toast({
            title: "Login successful",
            description: `Welcome, ${foundUser.name}!`,
          });
          resolve(true);
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive"
          });
          resolve(false);
        }
        setLoading(false);
      }, 1000);
    });
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (existingUser) {
          toast({
            title: "Registration failed",
            description: "User with this email already exists",
            variant: "destructive"
          });
          resolve(false);
        } else {
          // In a real app, this would be done on the server
          const newUser: User = {
            id: `${mockUsers.length + 1}`,
            email,
            name,
            role: UserRole.Employee,
          };
          
          // In a real app, we would add this user to the database
          // For now, we'll just pretend it worked
          setUser(newUser);
          localStorage.setItem('hrmsUser', JSON.stringify(newUser));
          toast({
            title: "Registration successful",
            description: `Welcome, ${name}!`,
          });
          resolve(true);
        }
        setLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrmsUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
