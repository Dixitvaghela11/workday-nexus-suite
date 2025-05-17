
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockEmployeeProfiles } from "@/services/mockData";
import { EmployeeProfile, EmployeeStatus, UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, Search, Filter, UserPlus, Check, ArrowUpDown, 
  Eye, UserCog, FileText, Mail 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Status Badge component
const StatusBadge = ({ status }: { status: EmployeeStatus }) => {
  switch (status) {
    case EmployeeStatus.Active:
      return <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">Active</Badge>;
    case EmployeeStatus.Inactive:
      return <Badge variant="outline" className="border-gray-500 bg-gray-50 text-gray-700">Inactive</Badge>;
    case EmployeeStatus.Resigned:
      return <Badge variant="outline" className="border-amber-500 bg-amber-50 text-amber-700">Resigned</Badge>;
    case EmployeeStatus.Terminated:
      return <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700">Terminated</Badge>;
    case EmployeeStatus.OnNotice:
      return <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-700">On Notice</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Employee Details View component
const EmployeeDetailsView = ({ employee }: { employee: EmployeeProfile }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-hrms-primary text-white text-xl">
            {employee.personalInfo.firstName.substring(0, 1) + employee.personalInfo.lastName.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold">
            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
          </h3>
          <p className="text-gray-500">{employee.designation}</p>
          <StatusBadge status={employee.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Employee ID</p>
          <p className="font-medium">{employee.employeeId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Department</p>
          <p className="font-medium">{employee.department}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{employee.personalInfo.email}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">{employee.personalInfo.phone || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Joining Date</p>
          <p className="font-medium">{new Date(employee.joiningDate).toLocaleDateString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Employment Type</p>
          <p className="font-medium capitalize">{employee.employmentType}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" className="flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
        <Button className="bg-hrms-primary hover:bg-hrms-primary/90 flex items-center">
          <UserCog className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

const EmployeesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Get unique departments for filter dropdown
  const departments = [...new Set(mockEmployeeProfiles.map(emp => emp.department))];

  useEffect(() => {
    // Check user permissions
    if (user && (user.role === UserRole.Admin || user.role === UserRole.HR)) {
      setEmployees(mockEmployeeProfiles);
      setFilteredEmployees(mockEmployeeProfiles);
    }
  }, [user]);

  useEffect(() => {
    // Apply filters and sorting
    filterEmployees();
  }, [searchQuery, statusFilter, departmentFilter, sortField, sortDirection, employees]);

  const filterEmployees = () => {
    let filtered = [...employees];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        emp => 
          emp.personalInfo.firstName.toLowerCase().includes(query) ||
          emp.personalInfo.lastName.toLowerCase().includes(query) ||
          emp.employeeId.toLowerCase().includes(query) ||
          emp.designation.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }
    
    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "name":
          const nameA = `${a.personalInfo.firstName} ${a.personalInfo.lastName}`.toLowerCase();
          const nameB = `${b.personalInfo.firstName} ${b.personalInfo.lastName}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case "id":
          comparison = a.employeeId.localeCompare(b.employeeId);
          break;
        case "department":
          comparison = a.department.localeCompare(b.department);
          break;
        case "joining":
          const dateA = new Date(a.joiningDate).getTime();
          const dateB = new Date(b.joiningDate).getTime();
          comparison = dateA - dateB;
          break;
        default:
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredEmployees(filtered);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewEmployee = (employee: EmployeeProfile) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const handleAddEmployee = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The add employee feature will be available in an upcoming update."
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  if (!user || (user.role !== UserRole.Admin && user.role !== UserRole.HR)) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have permission to access the employee management section.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Users className="h-24 w-24 text-red-500 opacity-50" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <p className="text-gray-500">Manage employee information and records</p>
        </div>
        
        <Button onClick={handleAddEmployee} className="mt-4 md:mt-0 bg-hrms-primary hover:bg-hrms-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search employee..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={EmployeeStatus.Active}>Active</SelectItem>
                <SelectItem value={EmployeeStatus.Inactive}>Inactive</SelectItem>
                <SelectItem value={EmployeeStatus.Resigned}>Resigned</SelectItem>
                <SelectItem value={EmployeeStatus.Terminated}>Terminated</SelectItem>
                <SelectItem value={EmployeeStatus.OnNotice}>On Notice</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(searchQuery || statusFilter !== "all" || departmentFilter !== "all") && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {filteredEmployees.length} of {employees.length} employees
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Employees Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Employee
                    {sortField === "name" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    ID
                    {sortField === "id" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("department")}
                  >
                    Department
                    {sortField === "department" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("joining")}
                  >
                    Joining Date
                    {sortField === "joining" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.employeeId}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-hrms-primary/20 text-hrms-primary">
                            {employee.personalInfo.firstName.substring(0, 1) + employee.personalInfo.lastName.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.personalInfo.firstName} {employee.personalInfo.lastName}</p>
                          <p className="text-xs text-gray-500">{employee.designation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell><StatusBadge status={employee.status} /></TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{new Date(employee.joiningDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No employees found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Employee Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              View detailed information about this employee
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && <EmployeeDetailsView employee={selectedEmployee} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
