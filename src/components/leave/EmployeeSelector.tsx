
import { EmployeeProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmployeeSelectorProps {
  employees: EmployeeProfile[];
  selectedEmployeeId: string;
  onChange: (employeeId: string) => void;
}

export const EmployeeSelector = ({ 
  employees, 
  selectedEmployeeId, 
  onChange 
}: EmployeeSelectorProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Employee Selection</CardTitle>
        <CardDescription>Select an employee to view their leave details</CardDescription>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedEmployeeId} 
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Employees</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.employeeId} value={emp.employeeId}>
                {emp.personalInfo.firstName + " " + emp.personalInfo.lastName} ({emp.employeeId})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
