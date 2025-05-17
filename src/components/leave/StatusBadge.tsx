
import { LeaveStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: LeaveStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
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
