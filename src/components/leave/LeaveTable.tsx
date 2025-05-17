
import { format, differenceInDays } from "date-fns";
import { Leave as LeaveType, LeaveStatus, UserRole } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";

interface LeaveTableProps {
  leaves: LeaveType[];
  showEmployeeColumn: boolean;
  userRole?: UserRole;
  currentEmployeeId?: string;
  onCancelLeave: (leaveId: string) => void;
  onStatusChange: (leaveId: string, status: LeaveStatus) => void;
  getEmployeeName: (employeeId: string) => string;
}

export const LeaveTable = ({ 
  leaves, 
  showEmployeeColumn, 
  userRole,
  currentEmployeeId,
  onCancelLeave, 
  onStatusChange,
  getEmployeeName
}: LeaveTableProps) => {
  if (leaves.length === 0) {
    return (
      <div className="text-center py-4">No leave applications found</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showEmployeeColumn && <TableHead>Employee</TableHead>}
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
        {leaves.map((leave) => {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          const days = differenceInDays(endDate, startDate) + 1;
          
          return (
            <TableRow key={leave.id}>
              {showEmployeeColumn && (
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
                {leave.status === LeaveStatus.Pending && 
                userRole === UserRole.Employee && 
                leave.employeeId === currentEmployeeId && (
                  <Button 
                    variant="outline" 
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onCancelLeave(leave.id)}
                  >
                    Cancel
                  </Button>
                )}
                
                {/* Admin/HR actions for pending leaves */}
                {leave.status === LeaveStatus.Pending && 
                (userRole === UserRole.Admin || userRole === UserRole.HR) && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onStatusChange(leave.id, LeaveStatus.Approved)}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onStatusChange(leave.id, LeaveStatus.Rejected)}
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
      </TableBody>
    </Table>
  );
};
