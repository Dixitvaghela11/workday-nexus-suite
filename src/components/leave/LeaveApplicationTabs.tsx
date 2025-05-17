
import { Leave as LeaveType, LeaveStatus, UserRole } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveTable } from "./LeaveTable";

interface LeaveApplicationTabsProps {
  leaves: LeaveType[];
  showEmployeeColumn: boolean;
  userRole?: UserRole;
  currentEmployeeId?: string;
  onCancelLeave: (leaveId: string) => void;
  onStatusChange: (leaveId: string, status: LeaveStatus) => void;
  getEmployeeName: (employeeId: string) => string;
}

export const LeaveApplicationTabs = ({ 
  leaves, 
  showEmployeeColumn,
  userRole,
  currentEmployeeId,
  onCancelLeave,
  onStatusChange,
  getEmployeeName
}: LeaveApplicationTabsProps) => {
  return (
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
              <LeaveTable 
                leaves={leaves.filter(leave => 
                  tab === "all" || 
                  leave.status.toLowerCase() === tab.toLowerCase()
                )}
                showEmployeeColumn={showEmployeeColumn}
                userRole={userRole}
                currentEmployeeId={currentEmployeeId}
                onCancelLeave={onCancelLeave}
                onStatusChange={onStatusChange}
                getEmployeeName={getEmployeeName}
              />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
