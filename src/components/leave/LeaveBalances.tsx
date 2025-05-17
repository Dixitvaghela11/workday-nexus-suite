
import { LeaveBalance } from "@/types";
import { LeaveBalanceCard } from "./LeaveBalanceCard";

interface LeaveBalancesProps {
  leaveBalances: LeaveBalance[];
}

export const LeaveBalances = ({ leaveBalances }: LeaveBalancesProps) => {
  if (leaveBalances.length === 0) {
    return null;
  }
  
  return (
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
  );
};
