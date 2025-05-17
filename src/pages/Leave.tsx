import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockEmployeeProfiles, mockLeaves, mockLeaveBalances } from "@/services/mockData";
import { EmployeeProfile, Leave as LeaveType, LeaveStatus, LeaveType as LeaveCategory, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Plus } from "lucide-react";
import { differenceInDays } from "date-fns";

// Import refactored components
import { LeaveBalances } from "@/components/leave/LeaveBalances";
import { LeaveApplicationForm } from "@/components/leave/LeaveApplicationForm";
import { LeaveApplicationTabs } from "@/components/leave/LeaveApplicationTabs";
import { EmployeeSelector } from "@/components/leave/EmployeeSelector";

const LeavePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveType[]>([]);
  const [leaveApplications, setLeaveApplications] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [allEmployees, setAllEmployees] = useState<EmployeeProfile[]>([]);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  
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

  useEffect(() => {
    // If an employee is selected by admin/HR, update the leave balances
    if (user && (user.role === UserRole.Admin || user.role === UserRole.HR) && selectedEmployeeId) {
      const selectedEmpBalances = mockLeaveBalances[selectedEmployeeId];
      if (selectedEmpBalances) {
        setLeaveBalances(selectedEmpBalances);
      } else {
        setLeaveBalances([]);
      }
    }
  }, [selectedEmployeeId, user?.role]);

  const handleLeaveSubmit = ({ leaveType, dateRange, reason, applicableDays }) => {
    if (!leaveType || !dateRange.from || !dateRange.to || !reason) {
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
      reason: reason,
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
    
    // Reset form and close dialog
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
    return employee ? employee.personalInfo.firstName + " " + employee.personalInfo.lastName : "Unknown";
  };
  
  // Fix the type comparison issue by using proper role checking
  const filteredLeaveApplications = (() => {
    if (!user) {
      return leaveApplications;
    }
    
    if (user.role === UserRole.Employee) {
      // For employees, show only their leave applications
      return leaveApplications;
    }
    
    // Now we're dealing with Admin or HR roles
    if (selectedEmployeeId) {
      // If an employee is selected, filter by that employee
      return leaveApplications.filter(leave => leave.employeeId === selectedEmployeeId);
    }
    
    // Otherwise show all leave applications for Admin/HR
    return leaveApplications;
  })();

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
              
              <LeaveApplicationForm 
                leaveBalances={leaveBalances}
                onSubmit={handleLeaveSubmit}
                onCancel={() => setLeaveDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Employee selector for admin/HR */}
      {(user?.role === UserRole.Admin || user?.role === UserRole.HR) && (
        <EmployeeSelector 
          employees={allEmployees}
          selectedEmployeeId={selectedEmployeeId}
          onChange={setSelectedEmployeeId}
        />
      )}
      
      {/* Leave Balances - only show when viewing a specific employee */}
      {(user?.role === UserRole.Employee || selectedEmployeeId) && (
        <LeaveBalances leaveBalances={leaveBalances} />
      )}
      
      {/* Leave Applications */}
      <LeaveApplicationTabs 
        leaves={filteredLeaveApplications}
        showEmployeeColumn={(user?.role === UserRole.Admin || user?.role === UserRole.HR) && !selectedEmployeeId}
        userRole={user?.role}
        currentEmployeeId={profile?.employeeId}
        onCancelLeave={cancelLeave}
        onStatusChange={handleLeaveStatusChange}
        getEmployeeName={getEmployeeName}
      />
    </div>
  );
};

export default LeavePage;
