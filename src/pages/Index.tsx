
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <span className="text-hrms-primary">HR</span>
          <span className="text-hrms-secondary">MS</span>
        </div>
        <div className="space-x-2">
          {user ? (
            <Button asChild className="bg-hrms-primary hover:bg-hrms-primary/90">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-hrms-primary hover:bg-hrms-primary/90">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </header>
      
      {/* Hero section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Modern HR Management System
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Streamline your HR operations with our comprehensive HRMS solution. 
                Manage employee data, attendance, leave, and payroll in one place.
              </p>
              <div className="space-x-4">
                <Button asChild size="lg" className="bg-hrms-primary hover:bg-hrms-primary/90">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://source.unsplash.com/random/800x600/?office,team" 
                alt="Office team" 
                className="rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive HR Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our HRMS offers a complete suite of tools to manage your workforce effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
              <p className="text-gray-600">
                Store and manage comprehensive employee profiles with all important documents and information.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
              <p className="text-gray-600">
                Track employee attendance with easy clock-in/out functionality and detailed reports.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Leave Management</h3>
              <p className="text-gray-600">
                Simplify leave applications, approvals, and balance tracking for different leave types.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Payroll Processing</h3>
              <p className="text-gray-600">
                Generate and manage payslips with detailed salary breakdowns and tax calculations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-hrms-primary text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your HR processes?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of companies using our HRMS to manage their workforce efficiently.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Sign Up Now</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-hrms-secondary">HR</span>
                <span className="text-white">MS</span>
              </div>
              <p className="text-gray-300 mb-4">
                A comprehensive human resource management solution for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/login" className="hover:text-hrms-secondary">Login</Link></li>
                <li><Link to="/register" className="hover:text-hrms-secondary">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300">
                support@hrms-example.com<br />
                +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} HRMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
