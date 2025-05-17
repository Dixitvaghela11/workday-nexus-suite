
import { useState, useEffect } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { LeaveBalance, LeaveCategory, LeaveType as LeaveTypeEnum } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LeaveApplicationFormProps {
  leaveBalances: LeaveBalance[];
  onSubmit: (leaveData: {
    leaveType: LeaveCategory;
    dateRange: { from: Date; to: Date };
    reason: string;
    applicableDays: number;
  }) => void;
  onCancel: () => void;
}

export const LeaveApplicationForm = ({ 
  leaveBalances, 
  onSubmit, 
  onCancel 
}: LeaveApplicationFormProps) => {
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

  const handleSubmit = () => {
    if (leaveType && dateRange.from && dateRange.to) {
      onSubmit({
        leaveType: leaveType as LeaveCategory,
        dateRange: { from: dateRange.from, to: dateRange.to },
        reason: leaveReason,
        applicableDays,
      });
    }
  };

  return (
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

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} className="bg-hrms-primary hover:bg-hrms-primary/90">Submit Request</Button>
      </div>
    </div>
  );
};
