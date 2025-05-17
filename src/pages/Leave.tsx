import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockEmployeeProfiles, mockLeaves, mockLeaveBalances } from "@/services/mockData";
import { EmployeeProfile, Leave as LeaveType, LeaveStatus, LeaveType as LeaveCategory, LeaveBalance, UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Clock, Users } from "lucide-react";

const LeaveBalanceCard = ({ leaveType, total, used, balance, pending }: { 
  leaveType: LeaveCategory; 
  total: number; 
  used: number;
  balance: number;
  pending: number;
}) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="capitalize text-lg">{leaveType} Leave</CardTitle>
        <CardDescription>Leaves allocated for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Used: {used}</span>
          <span>Total: {total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-hrms-primary h-2.5 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm font-medium">{balance} remaining</span>
          {pending > 0 && (
            <Badge variant="secondary">{pending} pending</Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: LeaveStatus }) => {
  switch (status) {
    case LeaveStatus.Pending:
      return <Badge variant="outline" className="border-amber-500 bg-amber-50 text-amber-700">Pending</Badge>;
    case LeaveStatus.Approved:
      return <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">Approved</Badge>;
    case LeaveStatus.Rejected:
      return <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700">Rejected</Badge>;
    case LeaveStatus.Cancelled:
      return <Badge variant="outline" className="border-gray-500 bg-gray-50 text-gray-700">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const LeavePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveApplications, setLeaveApplications] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [allEmployees, setAllEmployees] = useState<EmployeeProfile[]>([]);
  
  // New leave application form state
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveCategory | "">("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [leaveReason, setLeaveReason] = useState("");
  const [applicableDays, setApplicableDays] = useState(0);
  
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
        
        // Get leave balances
        const balances = mockLeaveBalances[employeeProfile.employeeId];
        if (balances) {
          setLeaveBalances(balances);
        }
        
        if (user.role === UserRole.Employee) {
          // For regular employees - only show their leave applications
          const leaves = mockLeaves.filter(leave => leave.employeeId === employeeProfile.employeeId);
          setLeaveApplications(leaves);
        } else {
          // For admin/HR - show all leave applications
          setLeaveApplications(mockLeaves);
        }
        
        setLoading(false);
      } else if (user.role === UserRole.Admin || user.role === UserRole.HR) {
        // Fallback for admin/HR without profile
        setLeaveApplications(mockLeaves);
        setLoading(false);
      }
    }
  }, [user]);

  // Calculate applicable days when date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      let days = differenceInDays(dateRange.to, dateRange.from) + 1;
      
      // In a real application, we would exclude weekends and holidays here
      // For this demo, we'll just do a simple calculation
      for (let i = 0; i < days; i++) {
        const date = addDays(dateRange.from, i);
        // Exclude weekends (0 = Sunday, 6 = Saturday)
        if (date.getDay() === 0 || date.getDay() === 6) {
          days--;
        }
      }
      
      setApplicableDays(days);
    } else {
      setApplicableDays(0);
    }
  }, [dateRange]);

  useEffect(() => {
    // If an employee is selected by admin/HR, update the leave balances
    if ((user?.role === UserRole.Admin || user?.role === UserRole.HR) && selectedEmployeeId) {
      const selectedEmpBalances = mockLeaveBalances[selectedEmployeeId];
      if (selectedEmpBalances) {
        setLeaveBalances(selectedEmpBalances);
      } else {
        setLeaveBalances([]);
      }
    }
  }, [selectedEmployeeId, user?.role]);

  const handleLeaveSubmit = () => {
    if (!leaveType || !dateRange.from || !dateRange.to || !leaveReason) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (applicableDays <= 0) {
      toast({
        title: "Invalid date range",
        description: "Please select a valid date range.",
        variant: "destructive"
      });
      return;
    }
    
    // Check leave balance
    const selectedLeaveBalance = leaveBalances.find(balance => balance.leaveType === leaveType);
    
    if (selectedLeaveBalance && applicableDays > selectedLeaveBalance.balance) {
      toast({
        title: "Insufficient leave balance",
        description: `You only have ${selectedLeaveBalance.balance} ${leaveType} leaves available.`,
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would send this to a server
    // For this demo, we'll simulate adding a leave application
    const newLeave: LeaveType = {
      id: `leave-${Date.now()}`,
      employeeId: profile?.employeeId || "",
      leaveType: leaveType as LeaveCategory,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      reason: leaveReason,
      status: LeaveStatus.Pending,
      appliedOn: new Date().toISOString()
    };
    
    setLeaveApplications([newLeave, ...leaveApplications]);
    
    // Update leave balance
    const updatedLeaveBalances = leaveBalances.map(balance => {
      if (balance.leaveType === leaveType) {
        return {
          ...balance,
          pending: balance.pending + applicableDays
        };
      }
      return balance;
    });
    
    setLeaveBalances(updatedLeaveBalances);
    
    // Reset form
    setLeaveType("");
    setDateRange({ from: undefined, to: undefined });
    setLeaveReason("");
    setLeaveDialogOpen(false);
    
    toast({
      title: "Leave application submitted",
      description: "Your leave request has been submitted for approval."
    });
  };

  const cancelLeave = (leaveId: string) => {
    // Find the leave to cancel
    const leaveToCancel = leaveApplications.find(leave => leave.id === leaveId);
    
    if (!leaveToCancel || leaveToCancel.status !== LeaveStatus.Pending) {
      toast({
        title: "Cannot cancel leave",
        description: "Only pending leave requests can be cancelled.",
        variant: "destructive"
      });
      return;
    }
    
    // Update the leave status
    const updatedLeaves = leaveApplications.map(leave => {
      if (leave.id === leaveId) {
        return {
          ...leave,
          status: LeaveStatus.Cancelled
        };
      }
      return leave;
    });
    
    setLeaveApplications(updatedLeaves);
    
    // Update leave balance
    const daysBetween = differenceInDays(
      new Date(leaveToCancel.endDate), 
      new Date(leaveToCancel.startDate)
    ) + 1;
    
    const updatedLeaveBalances = leaveBalances.map(balance => {
      if (balance.leaveType === leaveToCancel.leaveType) {
        return {
          ...balance,
          pending: Math.max(0, balance.pending - daysBetween)
        };
      }
      return balance;
    });
    
    setLeaveBalances(updatedLeaveBalances);
    
    toast({
      title: "Leave cancelled",
      description: "Your leave request has been cancelled."
    });
  };

  const handleLeaveStatusChange = (leaveId: string, newStatus: LeaveStatus) => {
    if (!user || (user.role !== UserRole.Admin && user.role !== UserRole.HR)) {
      return;
    }
    
    // Update the leave status
    const updatedLeaves = leaveApplications.map(leave => {
      if (leave.id === leaveId) {
        return {
          ...leave,
          status: newStatus,
          approvedBy: newStatus === LeaveStatus.Approved ? user.id : undefined,
          rejectedBy: newStatus === LeaveStatus.Rejected ? user.id : undefined
        };
      }
      return leave;
    });
    
    setLeaveApplications(updatedLeaves);
    
    // Update leave balance if approved or rejected
    if (newStatus === LeaveStatus.Approved || newStatus === LeaveStatus.Rejected) {
      const leaveToUpdate = leaveApplications.find(leave => leave.id === leaveId);
      
      if (leaveToUpdate) {
        const daysBetween = differenceInDays(
          new Date(leaveToUpdate.endDate), 
          new Date(leaveToUpdate.startDate)
        ) + 1;
        
        // Only update balance if we're looking at the employee's own leaves
        if (selectedEmployeeId === leaveToUpdate.employeeId || (!selectedEmployeeId && user.role === UserRole.Employee)) {
          const updatedLeaveBalances = leaveBalances.map(balance => {
            if (balance.leaveType === leaveToUpdate.leaveType) {
              return {
                ...balance,
                pending: Math.max(0, balance.pending - daysBetween),
                used: newStatus === LeaveStatus.Approved ? balance.used + daysBetween : balance.used,
                balance: newStatus === LeaveStatus.Approved ? balance.balance - daysBetween : balance.balance
              };
            }
            return balance;
          });
          
          setLeaveBalances(updatedLeaveBalances);
        }
      }
    }
    
    toast({
      title: `Leave ${newStatus === LeaveStatus.Approved ? 'approved' : 'rejected'}`,
      description: `The leave request has been ${newStatus === LeaveStatus.Approved ? 'approved' : 'rejected'}.`
    });
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployeeProfiles.find(emp => emp.employeeId === employeeId);
    return employee ? employee.personalInfo.name : "Unknown";
  };
  
  // Filter leave applications based on selected employee for admin/HR
  const filteredLeaveApplications = user?.role !== UserRole.Employee && selectedEmployeeId 
    ? leaveApplications.filter(leave => leave.employeeId === selectedEmployeeId) 
    : leaveApplications;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Clock className="animate-spin h-10 w-10 text-hrms-primary mx-auto mb-4" />
          <p className="text-xl font-medium">Loading leave data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-gray-500">Apply for leaves and check leave balances</p>
        </div>
        
        {/* Show Apply for Leave button for employees or when an employee is selected by admin/HR */}
        {(user?.role === UserRole.Employee || selectedEmployeeId) && (
          <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-hrms-primary hover:bg-hrms-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select value={leaveType} onValueChange={(value) => setLeaveType(value as LeaveCategory)}>
                    <SelectTrigger id="leaveType">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveBalances.map((balance) => (
                        <SelectItem 
                          key={balance.leaveType} 
                          value={balance.leaveType}
                          disabled={balance.balance <= 0}
                        >
                          {balance.leaveType.charAt(0).toUpperCase() + balance.leaveType.slice(1)} Leave ({balance.balance} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className={cn("grid gap-2", leaveBalances.length > 0 ? "grid-cols-2" : "grid-cols-1")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="start-date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            format(dateRange.from, "PPP")
                          ) : (
                            <span>Start date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => 
                            setDateRange({ 
                              from: date, 
                              to: dateRange.to && date && date > dateRange.to ? date : dateRange.to 
                            })
                          }
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="end-date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? (
                            format(dateRange.to, "PPP")
                          ) : (
                            <span>End date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => 
                            setDateRange({ 
                              from: dateRange.from, 
                              to: date 
                            })
                          }
                          disabled={(date) => 
                            !dateRange.from || 
                            date < dateRange.from || 
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {dateRange.from && dateRange.to && (
                    <p className="text-sm text-muted-foreground">
                      {applicableDays} working day{applicableDays !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    placeholder="Provide a reason for your leave request"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="h-24"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleLeaveSubmit} className="bg-hrms-primary hover:bg-hrms-primary/90">Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Employee selector for admin/HR */}
      {(user?.role === UserRole.Admin || user?.role === UserRole.HR) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Employee Selection</CardTitle>
            <CardDescription>Select an employee to view their leave details</CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedEmployeeId} 
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Employees</SelectItem>
                {allEmployees.map((emp) => (
                  <SelectItem key={emp.employeeId} value={emp.employeeId}>
                    {emp.personalInfo.name} ({emp.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
      
      {/* Leave Balances - only show when viewing a specific employee */}
      {(user?.role === UserRole.Employee || selectedEmployeeId) && leaveBalances.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {leaveBalances.map((balance) => (
            <LeaveBalanceCard
              key={balance.leaveType}
              leaveType={balance.leaveType}
              total={balance.total}
              used={balance.used}
              balance={balance.balance}
              pending={balance.pending}
            />
          ))}
        </div>
      )}
      
      {/* Leave Applications */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {tab === "all" ? "All Leave Applications" : `${tab} Leaves`}
                </CardTitle>
                <CardDescription>
                  View and manage leave applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {(user?.role === UserRole.Admin || user?.role === UserRole.HR) && !selectedEmployeeId && (
                        <TableHead>Employee</TableHead>
                      )}
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Applied On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaveApplications
                      .filter(leave => 
                        tab === "all" || 
                        leave.status.toLowerCase() === tab.toLowerCase()
                      )
                      .map((leave) => {
                        const startDate = new Date(leave.startDate);
                        const endDate = new Date(leave.endDate);
                        const days = differenceInDays(endDate, startDate) + 1;
                        
                        return (
                          <TableRow key={leave.id}>
                            {(user?.role === UserRole.Admin || user?.role === UserRole.HR) && !selectedEmployeeId && (
                              <TableCell>{getEmployeeName(leave.employeeId)}</TableCell>
                            )}
                            <TableCell className="capitalize">{leave.leaveType}</TableCell>
                            <TableCell>{format(startDate, "dd MMM yyyy")}</TableCell>
                            <TableCell>{format(endDate, "dd MMM yyyy")}</TableCell>
                            <TableCell>{days}</TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate" title={leave.reason}>
                                {leave.reason}
                              </div>
                            </TableCell>
                            <TableCell>{format(new Date(leave.appliedOn), "dd MMM yyyy")}</TableCell>
                            <TableCell>
                              <StatusBadge status={leave.status} />
                            </TableCell>
                            <TableCell>
                              {leave.status === LeaveStatus.Pending && user?.role === UserRole.Employee && leave.employeeId === profile?.employeeId && (
                                <Button 
                                  variant="outline" 
                                  className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => cancelLeave(leave.id)}
                                >
                                  Cancel
                                </Button>
                              )}
                              
                              {/* Admin/HR actions for pending leaves */}
                              {leave.status === LeaveStatus.Pending && (user?.role === UserRole.Admin || user?.role === UserRole.HR) && (
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleLeaveStatusChange(leave.id, LeaveStatus.Approved)}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleLeaveStatusChange(leave.id, LeaveStatus.Rejected)}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                              
                              {leave.status === LeaveStatus.Approved && (
                                <span className="text-sm text-green-600">
                                  {leave.approvedBy ? `Approved by HR` : ''}
                                </span>
                              )}
                              {leave.status === LeaveStatus.Rejected && (
                                <span className="text-sm text-destructive">
                                  {leave.rejectedBy ? `Rejected by HR` : ''}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    
                    {filteredLeaveApplications.filter(leave => 
                      tab === "all" || 
                      leave.status.toLowerCase() === tab.toLowerCase()
                    ).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={(user?.role === UserRole.Admin || user?.role === UserRole.HR) && !selectedEmployeeId ? 9 : 8} className="text-center py-4">
                          No {tab === "all" ? "" : tab} leave applications found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LeavePage;
