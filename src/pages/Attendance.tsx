
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockEmployeeProfiles, mockAttendance } from "@/services/mockData";
import { EmployeeProfile, Attendance as AttendanceType, AttendanceStatus } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Search
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Function to get the name of the month
const getMonthName = (month: number): string => {
  return new Date(0, month - 1).toLocaleDateString('default', { month: 'long' });
};

// Format time from ISO string to readable format
const formatTime = (timeString: string | undefined): string => {
  if (!timeString) return "N/A";
  
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return "Invalid time";
  }
};

// Generate calendar weeks
const generateCalendar = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month, 0).getDate();
  
  const calendar = [];
  let week: { date: number; day: string; }[] = [];
  
  // Fill in empty cells for the days before the first of the month
  for (let i = 0; i < firstDay; i++) {
    week.push({ date: 0, day: "" });
  }
  
  // Fill in the days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i);
    week.push({
      date: i,
      day: date.toLocaleDateString('en-US', { weekday: 'short' })
    });
    
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  
  // Fill in empty cells for the days after the end of the month
  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ date: 0, day: "" });
    }
    calendar.push(week);
  }
  
  return calendar;
};

// Status Badge component
const StatusBadge = ({ status }: { status: AttendanceStatus }) => {
  switch (status) {
    case AttendanceStatus.Present:
      return <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">Present</Badge>;
    case AttendanceStatus.Absent:
      return <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700">Absent</Badge>;
    case AttendanceStatus.HalfDay:
      return <Badge variant="outline" className="border-amber-500 bg-amber-50 text-amber-700">Half Day</Badge>;
    case AttendanceStatus.WorkFromHome:
      return <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-700">WFH</Badge>;
    case AttendanceStatus.OnLeave:
      return <Badge variant="outline" className="border-purple-500 bg-purple-50 text-purple-700">Leave</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Calendar Day component
const CalendarDay = ({ 
  day, 
  date, 
  attendance, 
  month, 
  year, 
  currentDate 
}: { 
  day: string;
  date: number;
  attendance: AttendanceType | null;
  month: number;
  year: number;
  currentDate: Date;
}) => {
  const isToday = date > 0 && 
    date === currentDate.getDate() && 
    month === currentDate.getMonth() + 1 && 
    year === currentDate.getFullYear();
  
  const isPast = date > 0 && new Date(year, month - 1, date) < new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  
  const isFuture = date > 0 && new Date(year, month - 1, date) > currentDate;
  
  const isWeekend = day === "Sat" || day === "Sun";
  
  let statusColor = "";
  
  if (attendance) {
    switch (attendance.status) {
      case AttendanceStatus.Present:
        statusColor = "bg-green-500";
        break;
      case AttendanceStatus.Absent:
        statusColor = "bg-red-500";
        break;
      case AttendanceStatus.HalfDay:
        statusColor = "bg-amber-500";
        break;
      case AttendanceStatus.WorkFromHome:
        statusColor = "bg-blue-500";
        break;
      case AttendanceStatus.OnLeave:
        statusColor = "bg-purple-500";
        break;
    }
  }
  
  return (
    <div 
      className={`border p-4 h-24 ${
        date === 0
          ? "bg-gray-50" 
          : isToday
          ? "border-hrms-primary border-2"
          : isWeekend
          ? "bg-gray-50"
          : ""
      }`}
    >
      {date > 0 && (
        <>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isToday ? "font-bold" : ""}`}>
              {date}
            </span>
            <span className="text-xs text-gray-500">{day}</span>
          </div>
          
          {isPast && !attendance && !isWeekend && (
            <div className="mt-2 flex items-center justify-center h-8">
              <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700">
                No data
              </Badge>
            </div>
          )}
          
          {attendance && (
            <div className="mt-2">
              <div className="flex justify-center">
                <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
              </div>
              <div className="text-xs text-center mt-1">
                {attendance.status === AttendanceStatus.Present && attendance.punchInTime && (
                  <span className="block">{formatTime(attendance.punchInTime.toString())}</span>
                )}
                {attendance.status === AttendanceStatus.Present && attendance.punchOutTime && (
                  <span className="block">{formatTime(attendance.punchOutTime.toString())}</span>
                )}
                {attendance.status === AttendanceStatus.HalfDay && attendance.punchInTime && (
                  <span className="block">{formatTime(attendance.punchInTime.toString())}</span>
                )}
                {attendance.status === AttendanceStatus.WorkFromHome && (
                  <span className="block">WFH</span>
                )}
                {attendance.status === AttendanceStatus.OnLeave && (
                  <span className="block">Leave</span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AttendancePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceType[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceType[]>([]);
  const [currentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [searchDate, setSearchDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [calendar, setCalendar] = useState<any[]>([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Find employee profile
      const employeeProfile = mockEmployeeProfiles.find(emp => emp.personalInfo.email === user.email);
      
      if (employeeProfile) {
        setProfile(employeeProfile);
        
        // Get attendance records for this employee
        const records = mockAttendance.filter(record => record.employeeId === employeeProfile.employeeId);
        setAttendanceRecords(records);
        
        // Check if clocked in today
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = records.find(record => {
          const recordDate = typeof record.date === 'string' ? record.date : record.date.toISOString().split('T')[0];
          return recordDate === today && record.punchInTime && !record.punchOutTime;
        });
        
        if (todayRecord && todayRecord.punchInTime) {
          setClockedIn(true);
          setClockInTime(todayRecord.punchInTime.toString());
        }
      }
    }
  }, [user]);

  useEffect(() => {
    // Generate calendar for the selected month
    const calendarData = generateCalendar(selectedYear, selectedMonth);
    setCalendar(calendarData);
    
    // Filter records for the selected month
    filterRecords();
  }, [selectedMonth, selectedYear, statusFilter, searchDate, attendanceRecords]);

  const filterRecords = () => {
    let filtered = [...attendanceRecords];
    
    // Filter by month and year
    filtered = filtered.filter((record) => {
      const recordDate = new Date(typeof record.date === 'string' ? record.date : record.date.toISOString());
      return (
        recordDate.getMonth() + 1 === selectedMonth &&
        recordDate.getFullYear() === selectedYear
      );
    });
    
    // Filter by status if selected
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (record) => record.status === statusFilter
      );
    }
    
    // Filter by date if search date is provided
    if (searchDate) {
      filtered = filtered.filter((record) => {
        const recordDateStr = typeof record.date === 'string' ? 
          record.date : 
          record.date.toISOString().split('T')[0];
        return recordDateStr.includes(searchDate);
      });
    }
    
    setFilteredRecords(filtered);
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleClockIn = () => {
    // In a real app, we would send this to a server
    // For this demo, we'll simulate adding an attendance record
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Check if already has a record for today
    const existingRecord = attendanceRecords.find(record => {
      const recordDate = typeof record.date === 'string' ? record.date : record.date.toISOString().split('T')[0];
      return recordDate === today;
    });
    
    if (existingRecord) {
      toast({
        title: "Already clocked in",
        description: "You have already recorded attendance for today."
      });
      return;
    }
    
    const newRecord: AttendanceType = {
      id: `a-${profile?.employeeId}-${today}`,
      employeeId: profile?.employeeId || "",
      date: today,
      punchInTime: now.toISOString(),
      status: AttendanceStatus.Present
    };
    
    setAttendanceRecords([...attendanceRecords, newRecord]);
    setClockedIn(true);
    setClockInTime(now.toISOString());
    
    toast({
      title: "Clocked In",
      description: `Successfully clocked in at ${formatTime(now.toISOString())}`
    });
  };

  const handleClockOut = () => {
    // In a real app, we would send this to a server
    // For this demo, we'll simulate updating the attendance record
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Find today's record
    const updatedRecords = attendanceRecords.map(record => {
      const recordDate = typeof record.date === 'string' ? record.date : record.date.toISOString().split('T')[0];
      
      if (recordDate === today && record.punchInTime) {
        const punchInTime = new Date(record.punchInTime);
        const timeDiff = now.getTime() - punchInTime.getTime();
        const hours = Math.round(timeDiff / (1000 * 60 * 60) * 10) / 10;
        
        return {
          ...record,
          punchOutTime: now.toISOString(),
          workHours: hours
        };
      }
      return record;
    });
    
    setAttendanceRecords(updatedRecords);
    setClockedIn(false);
    
    toast({
      title: "Clocked Out",
      description: `Successfully clocked out at ${formatTime(now.toISOString())}`
    });
  };

  const getAttendanceForDate = (date: number): AttendanceType | null => {
    if (date === 0) return null;
    
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return filteredRecords.find(record => {
      const recordDate = typeof record.date === 'string' ? record.date : record.date.toISOString().split('T')[0];
      return recordDate === dateStr;
    }) || null;
  };

  if (!profile) {
    return <div className="py-10 text-center">Loading attendance data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Time & Attendance</h1>
          <p className="text-gray-500">Track your daily attendance and working hours</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            className={view === "calendar" ? "bg-hrms-primary hover:bg-hrms-primary/90" : ""}
            onClick={() => setView("calendar")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            className={view === "list" ? "bg-hrms-primary hover:bg-hrms-primary/90" : ""}
            onClick={() => setView("list")}
          >
            <Search className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
      </div>
      
      {/* Clock in/out card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-16 w-16 rounded-full bg-hrms-primary/10 flex items-center justify-center">
                <Clock className="h-8 w-8 text-hrms-primary" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">
                  {new Date().toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>
                <p className="text-gray-500">
                  {new Date().toLocaleTimeString(undefined, { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleClockIn}
                disabled={clockedIn}
                className="bg-green-600 hover:bg-green-700"
              >
                Clock In
              </Button>
              <Button
                onClick={handleClockOut}
                disabled={!clockedIn}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Clock Out
              </Button>
            </div>
          </div>
          
          {clockedIn && clockInTime && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
              <p className="text-sm">
                You clocked in at {formatTime(clockInTime)}. Don't forget to clock out at the end of your workday.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center space-x-2">
          <ChevronLeft 
            className="h-6 w-6 cursor-pointer hover:text-hrms-primary"
            onClick={handlePreviousMonth}
          />
          <span className="font-medium">
            {getMonthName(selectedMonth)} {selectedYear}
          </span>
          <ChevronRight 
            className="h-6 w-6 cursor-pointer hover:text-hrms-primary"
            onClick={handleNextMonth}
          />
        </div>
        
        <div className="flex-1"></div>
        
        <div className="flex space-x-2">
          <Input 
            type="date" 
            placeholder="Filter by date"
            className="w-auto"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={AttendanceStatus.Present}>Present</SelectItem>
              <SelectItem value={AttendanceStatus.Absent}>Absent</SelectItem>
              <SelectItem value={AttendanceStatus.HalfDay}>Half Day</SelectItem>
              <SelectItem value={AttendanceStatus.WorkFromHome}>Work From Home</SelectItem>
              <SelectItem value={AttendanceStatus.OnLeave}>On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Calendar View */}
      {view === "calendar" && (
        <div className="bg-white rounded-lg border">
          {/* Calendar header */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-4 text-center font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar body */}
          {calendar.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="grid grid-cols-7">
              {week.map((day: any, dayIndex: number) => (
                <CalendarDay
                  key={`day-${weekIndex}-${dayIndex}`}
                  day={day.day}
                  date={day.date}
                  attendance={getAttendanceForDate(day.date)}
                  month={selectedMonth}
                  year={selectedYear}
                  currentDate={currentDate}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      
      {/* List View */}
      {view === "list" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {new Date(typeof record.date === 'string' ? record.date : record.date.toISOString()).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>
                        {record.punchInTime ? formatTime(record.punchInTime.toString()) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {record.punchOutTime ? formatTime(record.punchOutTime.toString()) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {record.workHours !== undefined ? `${record.workHours} hrs` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {record.comments || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No attendance records found for the selected filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
          <span className="text-sm">Half Day</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm">Work From Home</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
          <span className="text-sm">Leave</span>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
