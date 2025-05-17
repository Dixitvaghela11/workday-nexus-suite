
import { LeaveCategory, LeaveBalance } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LeaveBalanceCardProps {
  leaveType: LeaveCategory;
  total: number;
  used: number;
  balance: number;
  pending: number;
}

export const LeaveBalanceCard = ({ leaveType, total, used, balance, pending }: LeaveBalanceCardProps) => {
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
