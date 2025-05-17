import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockAttendanceData, mockEmployeeProfiles } from "@/services/mockData";
import { AttendanceRecord, EmployeeProfile, UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, Search, Filter, UserPlus, Check, ArrowUpDown, 
  Eye, UserCog, FileText, Mail, Clock, X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns"

const AttendanceDetailsView = ({ record }: { record: AttendanceRecord }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Employee</p>
          <p className="font-medium">{record.employee.firstName} {record.employee.lastName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Employee ID</p>
          <p className="font-medium">{record.employeeId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium capitalize">{record.status}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Clock In Time</p>
          <p className="font-medium">{record.clockInTime}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Clock Out Time</p>
          <p className="font-medium">{record.clockOutTime || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Total Hours</p>
          <p className="font-medium">{record.totalHours || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Notes</p>
          <p className="font-medium">{record.notes || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

const AddAttendanceDialog = ({ open, setOpen, onAdd }: { 
  open: boolean; 
  setOpen: (open: boolean) => void; 
  onAdd: (record: AttendanceRecord) => void;
}) => {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState("present");
  const [clockInTime, setClockInTime] = useState("");
  const [clockOutTime, setClockOutTime] = useState("");
  const [notes, setNotes] = useState("");
  const [employee, setEmployee] = useState<EmployeeProfile | undefined>(undefined);
  const employees = mockEmployeeProfiles;

  useEffect(() => {
    if (employeeId) {
      const foundEmployee = employees.find(emp => emp.employeeId === employeeId);
      setEmployee(foundEmployee);
    } else {
      setEmployee(undefined);
    }
  }, [employeeId, employees]);

  const handleAdd = () => {
    if (!employeeId || !date || !status || !clockInTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `temp-${Date.now()}`,
      employeeId: employeeId,
      employee: employee!,
      date: date.toISOString(),
      status: status,
      clockInTime: clockInTime,
      clockOutTime: clockOutTime,
      totalHours: clockOutTime ? calculateTotalHours(clockInTime, clockOutTime) : null,
      notes: notes,
    };

    onAdd(newRecord);
    setOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setEmployeeId("");
    setDate(undefined);
    setStatus("present");
    setClockInTime("");
    setClockOutTime("");
    setNotes("");
  };

  const calculateTotalHours = (clockIn: string, clockOut: string): string => {
    const [clockInHours, clockInMinutes] = clockIn.split(":").map(Number);
    const [clockOutHours, clockOutMinutes] = clockOut.split(":").map(Number);

    const clockInTotalMinutes = clockInHours * 60 + clockInMinutes;
    const clockOutTotalMinutes = clockOutHours * 60 + clockOutMinutes;

    const diffMinutes = clockOutTotalMinutes - clockInTotalMinutes;
    const totalHours = diffMinutes / 60;

    return totalHours.toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Attendance Record</DialogTitle>
          <DialogDescription>
            Add a new attendance record for an employee
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="employeeId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Employee
            </label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.employeeId} value={employee.employeeId}>
                    {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : (
                    <span>Pick a date</span>
                  )}
                  {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="excused">Excused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="clockInTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Clock In Time
            </label>
            <Input
              type="time"
              id="clockInTime"
              value={clockInTime}
              onChange={(e) => setClockInTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="clockOutTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Clock Out Time
            </label>
            <Input
              type="time"
              id="clockOutTime"
              value={clockOutTime}
              onChange={(e) => setClockOutTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Notes
            </label>
            <Input
              type="text"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAdd} className="bg-hrms-primary hover:bg-hrms-primary/90">
            Add Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmployeesAttendancePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allEmployees, setAllEmployees] = useState<EmployeeProfile[]>([]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      
      // Set all employees data for admin/HR
      if (user.role === UserRole.Admin || user.role === UserRole.HR) {
        setAllEmployees(mockEmployeeProfiles);
      }
      
      // Set attendance data
      const initialData = mockAttendanceData.map(record => ({
        ...record,
        employee: mockEmployeeProfiles.find(emp => emp.employeeId === record.employeeId)!,
      }));
      setAttendanceData(initialData);
      setFilteredAttendanceData(initialData);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    filterAttendanceData();
  }, [searchQuery, dateFilter, employeeFilter, sortField, sortDirection, attendanceData]);

  const filterAttendanceData = () => {
    let filtered = [...attendanceData];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        record => 
          record.employee.firstName.toLowerCase().includes(query) ||
          record.employee.lastName.toLowerCase().includes(query) ||
          record.employeeId.toLowerCase().includes(query)
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDate = dateFilter.toISOString().split('T')[0];
      filtered = filtered.filter(record => record.date.split('T')[0] === filterDate);
    }
    
    // Apply employee filter
    if (employeeFilter !== "all") {
      filtered = filtered.filter(record => record.employeeId === employeeFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "employee":
          const nameA = `${a.employee.firstName} ${a.employee.lastName}`.toLowerCase();
          const nameB = `${b.employee.firstName} ${b.employee.lastName}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
        case "id":
          comparison = a.employeeId.localeCompare(b.employeeId);
          break;
        case "date":
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          comparison = dateA - dateB;
          break;
        default:
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredAttendanceData(filtered);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const handleAddRecord = (record: AttendanceRecord) => {
    setAttendanceData([...attendanceData, record]);
    setFilteredAttendanceData([...filteredAttendanceData, record]);
    toast({
      title: "Attendance Record Added",
      description: "The attendance record has been successfully added."
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDateFilter(undefined);
    setEmployeeFilter("all");
  };

  if (!user || (user.role !== UserRole.Admin && user.role !== UserRole.HR)) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have permission to access the attendance management section.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Clock className="h-24 w-24 text-red-500 opacity-50" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Clock className="animate-spin h-10 w-10 text-hrms-primary mx-auto mb-4" />
          <p className="text-xl font-medium">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-gray-500">Manage employee attendance records</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4 md:mt-0 bg-hrms-primary hover:bg-hrms-primary/90">
          <Clock className="mr-2 h-4 w-4" />
          Add Attendance
        </Button>
      </div>
      
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search employee..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  {dateFilter ? format(dateFilter, "PPP") : (
                    <span>Filter by date</span>
                  )}
                   <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {allEmployees.map((employee) => (
                  <SelectItem key={employee.employeeId} value={employee.employeeId}>
                    {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(searchQuery || dateFilter || employeeFilter !== "all") && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {filteredAttendanceData.length} of {attendanceData.length} records
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("employee")}
                  >
                    Employee
                    {sortField === "employee" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    ID
                    {sortField === "id" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortField === "date" && (
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendanceData.length > 0 ? (
                filteredAttendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-hrms-primary/20 text-hrms-primary">
                            {record.employee.firstName.substring(0, 1) + record.employee.lastName.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{record.employee.firstName} {record.employee.lastName}</p>
                          <p className="text-xs text-gray-500">{record.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{record.employeeId}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{record.status}</TableCell>
                    <TableCell>{record.clockInTime}</TableCell>
                    <TableCell>{record.clockOutTime || "N/A"}</TableCell>
                    <TableCell>{record.totalHours || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewRecord(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No attendance records found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Attendance Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attendance Record Details</DialogTitle>
            <DialogDescription>
              View detailed information about this attendance record
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && <AttendanceDetailsView record={selectedRecord} />}
        </DialogContent>
      </Dialog>
      
      {/* Add Attendance Dialog */}
      <AddAttendanceDialog open={isAddDialogOpen} setOpen={setIsAddDialogOpen} onAdd={handleAddRecord} />
    </div>
  );
};

export default EmployeesAttendancePage;
