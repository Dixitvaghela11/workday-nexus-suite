import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockEmployeeProfiles, mockPayrollItems } from "@/services/mockData";
import { EmployeeProfile, PayrollItem, UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  Users,
  Clock
} from "lucide-react";

const PayslipDetails = ({ payroll }: { payroll: PayrollItem }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="font-bold text-xl">{monthNames[payroll.month - 1]} {payroll.year} Payslip</h2>
          <p className="text-gray-500">Generated on: {new Date(payroll.generatedOn).toLocaleDateString()}</p>
        </div>
        <div>
          <Badge variant={payroll.status === "paid" ? "outline" : "secondary"} className={
            payroll.status === "paid" 
              ? "border-green-500 bg-green-50 text-green-700" 
              : ""
          }>
            {payroll.status === "paid" ? "Paid" : "Generated"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-medium mb-2">Employee Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span>{payroll.employee.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Employee ID</span>
              <span>{payroll.employee.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span>{payroll.employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Designation</span>
              <span>{payroll.employee.designation}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Payment Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Period</span>
              <span>{monthNames[payroll.month - 1]} {payroll.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status</span>
              <span className="capitalize">{payroll.status}</span>
            </div>
            {payroll.paidOn && (
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Date</span>
                <span>{new Date(payroll.paidOn).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span className="text-gray-500">Net Payable</span>
              <span>₹{payroll.netPayable.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Earnings</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Basic Salary</TableCell>
                <TableCell className="text-right">{payroll.basicSalary.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>House Rent Allowance (HRA)</TableCell>
                <TableCell className="text-right">{payroll.hra.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Conveyance Allowance</TableCell>
                <TableCell className="text-right">{payroll.conveyanceAllowance.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Medical Allowance</TableCell>
                <TableCell className="text-right">{payroll.medicalAllowance.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Special Allowance</TableCell>
                <TableCell className="text-right">{payroll.specialAllowance.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell>Total Earnings</TableCell>
                <TableCell className="text-right">{payroll.totalEarnings.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="font-medium mb-4">Deductions</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Provident Fund</TableCell>
                <TableCell className="text-right">{payroll.providentFund.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Professional Tax</TableCell>
                <TableCell className="text-right">{payroll.professionalTax.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Income Tax</TableCell>
                <TableCell className="text-right">{payroll.incomeTax.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Deductions</TableCell>
                <TableCell className="text-right">{payroll.otherDeductions.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell>Total Deductions</TableCell>
                <TableCell className="text-right">{payroll.totalDeductions.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Net Payable</span>
            <span>₹{payroll.netPayable.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </>
  );
};

const PayrollPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [payrollItems, setPayrollItems] = useState<PayrollItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PayrollItem[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollItem | null>(null);
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [allEmployees, setAllEmployees] = useState<EmployeeProfile[]>([]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      
      // Set all employees data for admin/HR
      if (user.role === UserRole.Admin || user.role === UserRole.HR) {
        setAllEmployees(mockEmployeeProfiles);
      }
      
      // Find employee profile
      const employeeProfile = mockEmployeeProfiles.find(emp => emp.personalInfo.email === user.email);
      
      if (employeeProfile) {
        setProfile(employeeProfile);
        
        // For regular employees - only show their payroll
        if (user.role === UserRole.Employee) {
          const items = mockPayrollItems.filter(item => item.employeeId === employeeProfile.employeeId);
          setPayrollItems(items);
          setFilteredItems(items);
        } else {
          // For admin/HR - show all payroll items by default
          setPayrollItems(mockPayrollItems);
          setFilteredItems(mockPayrollItems);
        }
        setLoading(false);
      } else if (user.role === UserRole.Admin || user.role === UserRole.HR) {
        // Fallback for admin/HR without profile
        setPayrollItems(mockPayrollItems);
        setFilteredItems(mockPayrollItems);
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...payrollItems];
    
    // Apply employee filter
    if (selectedEmployeeId) {
      filtered = filtered.filter(item => item.employeeId === selectedEmployeeId);
    }
    
    // Apply year filter
    if (yearFilter !== "all") {
      filtered = filtered.filter(item => item.year.toString() === yearFilter);
    }
    
    // Apply month filter
    if (monthFilter !== "all") {
      filtered = filtered.filter(item => item.month.toString() === monthFilter);
    }
    
    setFilteredItems(filtered);
  }, [yearFilter, monthFilter, selectedEmployeeId, payrollItems]);

  const viewPayslip = (payroll: PayrollItem) => {
    setSelectedPayslip(payroll);
    setPayslipDialogOpen(true);
  };

  const downloadPayslip = (payroll: PayrollItem) => {
    // In a real app, this would generate a PDF
    // For this demo, we'll just show a message
    alert(`Downloading payslip for ${getMonthName(payroll.month)} ${payroll.year}`);
  };

  // Function to get unique years from payroll items
  const getUniqueYears = () => {
    const years = payrollItems.map(item => item.year);
    return [...new Set(years)].sort((a, b) => b - a); // Sort in descending order
  };

  // Function to get unique months from payroll items
  const getUniqueMonths = () => {
    const months = payrollItems.map(item => item.month);
    return [...new Set(months)].sort((a, b) => a - b); // Sort in ascending order
  };

  // Function to get month name
  const getMonthName = (month: number) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month - 1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Clock className="animate-spin h-10 w-10 text-hrms-primary mx-auto mb-4" />
          <p className="text-xl font-medium">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="py-10 text-center">Loading payroll data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Payroll</h1>
          <p className="text-gray-500">View your salary statements and payslips</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Employee filter for admin/HR */}
          {(user?.role === UserRole.Admin || user?.role === UserRole.HR) && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Employees</SelectItem>
                  {allEmployees.map(emp => (
                    <SelectItem key={emp.employeeId} value={emp.employeeId}>
                      {emp.personalInfo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {getUniqueYears().map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {getUniqueMonths().map(month => (
                  <SelectItem key={month} value={month.toString()}>
                    {getMonthName(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Salary Statements</CardTitle>
          <CardDescription>
            {user?.role === UserRole.Employee ? "Your salary statements for all pay periods" : "Salary statements for all employees"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {(user?.role === UserRole.Admin || user?.role === UserRole.HR) && !selectedEmployeeId && (
                  <TableHead>Employee</TableHead>
                )}
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead className="text-right">Net Payable</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((payroll) => {
                  const employeeName = (user?.role === UserRole.Admin || user?.role === UserRole.HR) && !selectedEmployeeId
                    ? mockEmployeeProfiles.find(emp => emp.employeeId === payroll.employeeId)?.personalInfo.name || "Unknown"
                    : "";
                    
                  return (
                    <TableRow key={payroll.id}>
                      {(user?.role === UserRole.Admin || user?.role === UserRole.HR) && !selectedEmployeeId && (
                        <TableCell>{employeeName}</TableCell>
                      )}
                      <TableCell>{getMonthName(payroll.month)}</TableCell>
                      <TableCell>{payroll.year}</TableCell>
                      <TableCell>₹{payroll.basicSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        ₹{(payroll.hra + payroll.conveyanceAllowance + 
                           payroll.medicalAllowance + payroll.specialAllowance).toLocaleString()}
                      </TableCell>
                      <TableCell>₹{payroll.totalDeductions.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">₹{payroll.netPayable.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={payroll.status === "paid" ? "outline" : "secondary"} className={
                          payroll.status === "paid" 
                            ? "border-green-500 bg-green-50 text-green-700" 
                            : ""
                        }>
                          {payroll.status === "paid" ? "Paid" : "Generated"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewPayslip(payroll)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadPayslip(payroll)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={(user?.role === UserRole.Admin || user?.role === UserRole.HR) && !selectedEmployeeId ? 9 : 8} className="text-center py-4">
                    No payroll items found for the selected filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={payslipDialogOpen} onOpenChange={setPayslipDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payslip Details</DialogTitle>
          </DialogHeader>
          {selectedPayslip && <PayslipDetails payroll={selectedPayslip} />}
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setPayslipDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => downloadPayslip(selectedPayslip!)}
              className="bg-hrms-primary hover:bg-hrms-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Yearly Summary</CardTitle>
          <CardDescription>
            Overview of your earnings for the current fiscal year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-blue-50">
              <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                ₹{filteredItems
                  .reduce((sum, item) => sum + item.totalEarnings, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-green-50">
              <h3 className="text-sm font-medium text-gray-500">Net Paid</h3>
              <p className="text-2xl font-bold text-green-700 mt-1">
                ₹{filteredItems
                  .filter(item => item.status === "paid")
                  .reduce((sum, item) => sum + item.netPayable, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-amber-50">
              <h3 className="text-sm font-medium text-gray-500">Tax Deducted</h3>
              <p className="text-2xl font-bold text-amber-700 mt-1">
                ₹{filteredItems
                  .reduce((sum, item) => sum + item.incomeTax, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-purple-50">
              <h3 className="text-sm font-medium text-gray-500">PF Contribution</h3>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                ₹{filteredItems
                  .reduce((sum, item) => sum + item.providentFund, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 text-sm text-gray-500">
          <p>
            Note: This summary adjusts based on your selected filters. For tax documents or detailed reports, please contact the HR department.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PayrollPage;
