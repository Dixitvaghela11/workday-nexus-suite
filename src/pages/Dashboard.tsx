
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { mockEmployeeProfiles, mockAttendanceSummary, mockLeaveBalances, mockHolidays } from "@/services/mockData";
import { Calendar, Clock, User, CalendarCheck, FileText } from "lucide-react";
import { LeaveType, AttendanceSummary } from "@/types";

const LeaveBalanceCard = ({ leaveType, total, used, pending }: { 
  leaveType: LeaveType; 
  total: number; 
  used: number;
  pending: number;
}) => {
  const balance = total - used;
  const percentage = total > 0 ? (used / total) * 100 : 0;
  
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium capitalize">{leaveType} Leave</h3>
        <Badge variant="outline">{balance} left</Badge>
      </div>
      <Progress value={percentage} className="h-2 mb-2" />
      <div className="flex justify-between text-sm text-gray-500">
        <span>Used: {used}</span>
        <span>Total: {total}</span>
      </div>
      {pending > 0 && (
        <div className="mt-1 text-sm text-amber-600">
          {pending} pending approval
        </div>
      )}
    </div>
  );
};

const AttendanceStatsCard = ({ summary }: { summary: AttendanceSummary }) => {
  const stats = [
    { label: "Present", value: summary.present, color: "bg-green-500" },
    { label: "Absent", value: summary.absent, color: "bg-red-500" },
    { label: "Half Day", value: summary.halfDay, color: "bg-amber-500" },
    { label: "WFH", value: summary.workFromHome, color: "bg-blue-500" },
    { label: "Leave", value: summary.onLeave, color: "bg-purple-500" }
  ];
  
  return (
    <div className="grid grid-cols-5 gap-2 h-full">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center justify-center">
          <div className={`w-10 h-10 rounded-full ${stat.color} text-white flex items-center justify-center text-lg font-medium`}>
            {stat.value}
          </div>
          <div className="mt-2 text-xs text-center">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

const UpcomingHolidayCard = ({ date, name }: { date: string; name: string }) => {
  const holidayDate = new Date(date);
  const now = new Date();
  const diffTime = holidayDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return (
    <div className="flex items-center p-3 border-b last:border-b-0">
      <div className="flex-shrink-0 w-12 h-12 bg-hrms-primary/10 rounded-full flex items-center justify-center">
        <Calendar className="h-6 w-6 text-hrms-primary" />
      </div>
      <div className="ml-4">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric'
          })}
          {diffDays > 0 ? ` • In ${diffDays} day${diffDays === 1 ? '' : 's'}` : ' • Today'}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Find employee data
      const employeeProfile = mockEmployeeProfiles.find(
        emp => emp.personalInfo.email === user.email
      );
      
      if (employeeProfile) {
        setEmployeeData(employeeProfile);
        
        // Get attendance summary
        const summary = mockAttendanceSummary[employeeProfile.employeeId];
        if (summary) {
          setAttendanceSummary(summary);
        }
        
        // Get leave balances
        const balances = mockLeaveBalances[employeeProfile.employeeId];
        if (balances) {
          setLeaveBalances(balances);
        }
      }
      
      // Get upcoming holidays (next 3 from current date)
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const upcoming = mockHolidays
        .filter(h => new Date(h.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      
      setUpcomingHolidays(upcoming);
    }
  }, [user]);

  const menuItems = [
    { 
      icon: <User size={24} className="text-green-500" />, 
      title: "My Profile", 
      description: "View and update your profile information",
      link: "/profile" 
    },
    { 
      icon: <Clock size={24} className="text-blue-500" />, 
      title: "Attendance", 
      description: "Check-in, check-out, and view attendance",
      link: "/attendance" 
    },
    { 
      icon: <CalendarCheck size={24} className="text-purple-500" />, 
      title: "Leave Management", 
      description: "Apply for leave and check status",
      link: "/leave" 
    },
    { 
      icon: <FileText size={24} className="text-amber-500" />, 
      title: "Payroll", 
      description: "View payslips and salary information",
      link: "/payroll" 
    }
  ];

  const currentDate = new Date();
  const greeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6">
      {/* Header with greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{greeting()}, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500">Welcome to your HR Management dashboard</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm text-gray-500">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Quick actions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Card key={item.title} className="hover:border-hrms-primary cursor-pointer transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="rounded-full p-2 bg-gray-100 mr-4">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave balances */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leave Balances</CardTitle>
            <CardDescription>Current leave status and balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {leaveBalances.map((leave) => (
                <LeaveBalanceCard
                  key={leave.leaveType}
                  leaveType={leave.leaveType}
                  total={leave.total}
                  used={leave.used}
                  pending={leave.pending}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming holidays */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
            <CardDescription>Plan your time off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {upcomingHolidays.length > 0 ? (
                upcomingHolidays.map((holiday) => (
                  <UpcomingHolidayCard
                    key={holiday.date}
                    date={holiday.date}
                    name={holiday.name}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming holidays</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly attendance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Attendance</CardTitle>
            <CardDescription>Current month summary</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceSummary ? (
              <AttendanceStatsCard summary={attendanceSummary} />
            ) : (
              <p className="text-gray-500 text-center py-4">No attendance data available</p>
            )}
          </CardContent>
        </Card>

        {/* Employee info card */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Basic employment details</CardDescription>
          </CardHeader>
          <CardContent>
            {employeeData ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Employee ID</span>
                  <span className="font-medium">{employeeData.employeeId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium">{employeeData.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Designation</span>
                  <span className="font-medium">{employeeData.designation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Joining Date</span>
                  <span className="font-medium">
                    {new Date(employeeData.joiningDate).toLocaleDateString()}
                  </span>
                </div>
                {employeeData.reportingManager && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Reporting Manager</span>
                    <span className="font-medium">HR Manager</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      employeeData.status === 'active' 
                        ? 'border-green-500 text-green-500' 
                        : 'border-orange-500 text-orange-500'
                    }`}
                  >
                    {employeeData.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Employee data not available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
