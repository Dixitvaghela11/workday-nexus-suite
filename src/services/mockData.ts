
import { 
  User, UserRole, LeaveStatus, LeaveType, EmployeeStatus, AttendanceStatus, 
  EmployeeProfile, Leave, LeaveBalance, Attendance, AttendanceSummary, PayrollItem 
} from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@hrms.com",
    name: "Admin User",
    role: UserRole.Admin,
    profileImage: "https://source.unsplash.com/random/200x200/?person=1"
  },
  {
    id: "2",
    email: "hr@hrms.com",
    name: "HR Manager",
    role: UserRole.HR,
    profileImage: "https://source.unsplash.com/random/200x200/?person=2"
  },
  {
    id: "3",
    email: "john.doe@hrms.com",
    name: "John Doe",
    role: UserRole.Employee,
    profileImage: "https://source.unsplash.com/random/200x200/?person=3"
  },
  {
    id: "4",
    email: "jane.smith@hrms.com",
    name: "Jane Smith",
    role: UserRole.Employee,
    profileImage: "https://source.unsplash.com/random/200x200/?person=4"
  }
];

// Mock Employee Profiles
export const mockEmployeeProfiles: EmployeeProfile[] = [
  {
    id: "1",
    userId: "3", // John Doe
    employeeId: "EMP001",
    joiningDate: "2022-01-15",
    birthDate: "1990-05-20",
    anniversaryDate: "2018-11-10",
    department: "Engineering",
    designation: "Senior Developer",
    reportingManager: "2", // HR Manager
    employmentType: "Full-time",
    status: EmployeeStatus.Active,
    pfNumber: "PF12345678",
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@hrms.com",
      phone: "9876543210",
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
      emergencyContactName: "Jane Doe",
      emergencyContactPhone: "9876543211",
      bloodGroup: "O+"
    },
    bankDetails: {
      accountHolderName: "John Doe",
      accountNumber: "1234567890",
      bankName: "HDFC Bank",
      branchName: "Mumbai Branch",
      ifscCode: "HDFC0001234"
    },
    qualifications: [
      {
        id: "q1",
        degree: "B.Tech",
        institution: "Mumbai University",
        fieldOfStudy: "Computer Science",
        startDate: "2008-08-01",
        endDate: "2012-05-30",
        grade: "First Class"
      },
      {
        id: "q2",
        degree: "M.Tech",
        institution: "IIT Mumbai",
        fieldOfStudy: "Software Engineering",
        startDate: "2012-08-01",
        endDate: "2014-05-30",
        grade: "Distinction"
      }
    ],
    documents: [
      {
        id: "d1",
        employeeId: "EMP001",
        name: "Resume",
        type: "pdf",
        fileUrl: "/documents/resume.pdf",
        uploadedAt: "2022-01-10"
      },
      {
        id: "d2",
        employeeId: "EMP001",
        name: "Aadhar Card",
        type: "jpg",
        fileUrl: "/documents/aadhar.jpg",
        uploadedAt: "2022-01-10"
      },
      {
        id: "d3",
        employeeId: "EMP001",
        name: "PAN Card",
        type: "jpg",
        fileUrl: "/documents/pan.jpg",
        uploadedAt: "2022-01-10"
      }
    ]
  },
  {
    id: "2",
    userId: "4", // Jane Smith
    employeeId: "EMP002",
    joiningDate: "2021-03-10",
    birthDate: "1992-07-15",
    department: "Marketing",
    designation: "Marketing Specialist",
    reportingManager: "2", // HR Manager
    employmentType: "Full-time",
    status: EmployeeStatus.Active,
    pfNumber: "PF12345679",
    personalInfo: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@hrms.com",
      phone: "9876543212",
      address: "456 Park Avenue",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
      emergencyContactName: "John Smith",
      emergencyContactPhone: "9876543213",
      bloodGroup: "A+"
    },
    bankDetails: {
      accountHolderName: "Jane Smith",
      accountNumber: "0987654321",
      bankName: "ICICI Bank",
      branchName: "Bangalore Branch",
      ifscCode: "ICICI0001234"
    },
    qualifications: [
      {
        id: "q3",
        degree: "BBA",
        institution: "Bangalore University",
        fieldOfStudy: "Marketing",
        startDate: "2010-08-01",
        endDate: "2013-05-30",
        grade: "First Class"
      },
      {
        id: "q4",
        degree: "MBA",
        institution: "IIM Bangalore",
        fieldOfStudy: "Marketing",
        startDate: "2014-08-01",
        endDate: "2016-05-30",
        grade: "Distinction"
      }
    ],
    documents: [
      {
        id: "d4",
        employeeId: "EMP002",
        name: "Resume",
        type: "pdf",
        fileUrl: "/documents/resume_jane.pdf",
        uploadedAt: "2021-03-05"
      },
      {
        id: "d5",
        employeeId: "EMP002",
        name: "Aadhar Card",
        type: "jpg",
        fileUrl: "/documents/aadhar_jane.jpg",
        uploadedAt: "2021-03-05"
      },
      {
        id: "d6",
        employeeId: "EMP002",
        name: "PAN Card",
        type: "jpg",
        fileUrl: "/documents/pan_jane.jpg",
        uploadedAt: "2021-03-05"
      }
    ]
  }
];

// Generate leave balances for employees
export const mockLeaveBalances: Record<string, LeaveBalance[]> = {
  "EMP001": [
    {
      leaveType: LeaveType.Sick,
      total: 12,
      used: 3,
      balance: 9,
      pending: 0
    },
    {
      leaveType: LeaveType.Casual,
      total: 6,
      used: 2,
      balance: 4,
      pending: 0
    },
    {
      leaveType: LeaveType.Paid,
      total: 15,
      used: 5,
      balance: 10,
      pending: 2
    }
  ],
  "EMP002": [
    {
      leaveType: LeaveType.Sick,
      total: 12,
      used: 1,
      balance: 11,
      pending: 0
    },
    {
      leaveType: LeaveType.Casual,
      total: 6,
      used: 0,
      balance: 6,
      pending: 1
    },
    {
      leaveType: LeaveType.Paid,
      total: 15,
      used: 2,
      balance: 13,
      pending: 0
    }
  ]
};

// Generate leaves for employees
export const mockLeaves: Leave[] = [
  {
    id: "l1",
    employeeId: "EMP001",
    leaveType: LeaveType.Sick,
    startDate: "2023-05-10",
    endDate: "2023-05-11",
    reason: "Fever",
    status: LeaveStatus.Approved,
    appliedOn: "2023-05-08",
    approvedBy: "2", // HR Manager
    approvedOn: "2023-05-09"
  },
  {
    id: "l2",
    employeeId: "EMP001",
    leaveType: LeaveType.Paid,
    startDate: "2023-06-20",
    endDate: "2023-06-23",
    reason: "Family vacation",
    status: LeaveStatus.Approved,
    appliedOn: "2023-06-10",
    approvedBy: "2", // HR Manager
    approvedOn: "2023-06-12"
  },
  {
    id: "l3",
    employeeId: "EMP001",
    leaveType: LeaveType.Paid,
    startDate: "2023-08-15",
    endDate: "2023-08-16",
    reason: "Personal work",
    status: LeaveStatus.Pending,
    appliedOn: "2023-08-10"
  },
  {
    id: "l4",
    employeeId: "EMP002",
    leaveType: LeaveType.Sick,
    startDate: "2023-04-05",
    endDate: "2023-04-05",
    reason: "Not feeling well",
    status: LeaveStatus.Approved,
    appliedOn: "2023-04-04",
    approvedBy: "2", // HR Manager
    approvedOn: "2023-04-04"
  },
  {
    id: "l5",
    employeeId: "EMP002",
    leaveType: LeaveType.Casual,
    startDate: "2023-07-07",
    endDate: "2023-07-07",
    reason: "Family function",
    status: LeaveStatus.Pending,
    appliedOn: "2023-07-01"
  }
];

// Generate attendance records for the current month
const generateAttendanceForMonth = (employeeId: string, month: number, year: number): Attendance[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const attendanceRecords: Attendance[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    
    // Check if this day is in the future
    if (date > new Date()) {
      continue;
    }
    
    // Random status generation
    const randomNum = Math.random();
    let status: AttendanceStatus;
    let punchInTime: Date | undefined;
    let punchOutTime: Date | undefined;
    let workHours: number | undefined;
    
    if (randomNum > 0.9) {
      status = AttendanceStatus.Absent;
    } else if (randomNum > 0.8) {
      status = AttendanceStatus.HalfDay;
      punchInTime = new Date(year, month - 1, day, 9, 0, 0);
      punchOutTime = new Date(year, month - 1, day, 13, 0, 0);
      workHours = 4;
    } else if (randomNum > 0.7) {
      status = AttendanceStatus.WorkFromHome;
      punchInTime = new Date(year, month - 1, day, 9, 0, 0);
      punchOutTime = new Date(year, month - 1, day, 18, 0, 0);
      workHours = 9;
    } else if (randomNum > 0.6) {
      status = AttendanceStatus.OnLeave;
    } else {
      status = AttendanceStatus.Present;
      punchInTime = new Date(year, month - 1, day, 9, 0, 0);
      punchOutTime = new Date(year, month - 1, day, 18, 0, 0);
      workHours = 9;
    }
    
    attendanceRecords.push({
      id: `a-${employeeId}-${year}-${month}-${day}`,
      employeeId,
      date: date.toISOString().split('T')[0],
      punchInTime: punchInTime?.toISOString(),
      punchOutTime: punchOutTime?.toISOString(),
      status,
      workHours,
      comments: status === AttendanceStatus.OnLeave ? "Approved leave" : undefined
    });
  }
  
  return attendanceRecords;
};

// Generate attendance for both employees for the current and previous month
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();
const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

export const mockAttendance: Attendance[] = [
  ...generateAttendanceForMonth("EMP001", currentMonth, currentYear),
  ...generateAttendanceForMonth("EMP001", previousMonth, previousYear === currentYear ? currentYear : previousYear),
  ...generateAttendanceForMonth("EMP002", currentMonth, currentYear),
  ...generateAttendanceForMonth("EMP002", previousMonth, previousYear === currentYear ? currentYear : previousYear)
];

// Generate attendance summary
export const mockAttendanceSummary: Record<string, AttendanceSummary> = {
  "EMP001": {
    present: 18,
    absent: 2,
    halfDay: 1,
    workFromHome: 2,
    onLeave: 3,
    total: 26
  },
  "EMP002": {
    present: 20,
    absent: 1,
    halfDay: 0,
    workFromHome: 3,
    onLeave: 2,
    total: 26
  }
};

// Generate payroll items
export const mockPayrollItems: PayrollItem[] = [
  {
    id: "p1",
    employeeId: "EMP001",
    employee: {
      name: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      designation: "Senior Developer"
    },
    month: 7,
    year: 2023,
    basicSalary: 50000,
    hra: 20000,
    conveyanceAllowance: 3000,
    medicalAllowance: 2000,
    specialAllowance: 10000,
    providentFund: 5000,
    professionalTax: 200,
    incomeTax: 8000,
    otherDeductions: 0,
    totalEarnings: 85000,
    totalDeductions: 13200,
    netPayable: 71800,
    status: 'paid',
    generatedOn: "2023-07-28",
    paidOn: "2023-07-31"
  },
  {
    id: "p2",
    employeeId: "EMP002",
    employee: {
      name: "Jane Smith",
      employeeId: "EMP002",
      department: "Marketing",
      designation: "Marketing Specialist"
    },
    month: 7,
    year: 2023,
    basicSalary: 45000,
    hra: 18000,
    conveyanceAllowance: 3000,
    medicalAllowance: 2000,
    specialAllowance: 8000,
    providentFund: 4500,
    professionalTax: 200,
    incomeTax: 7000,
    otherDeductions: 0,
    totalEarnings: 76000,
    totalDeductions: 11700,
    netPayable: 64300,
    status: 'paid',
    generatedOn: "2023-07-28",
    paidOn: "2023-07-31"
  },
  {
    id: "p3",
    employeeId: "EMP001",
    employee: {
      name: "John Doe",
      employeeId: "EMP001",
      department: "Engineering",
      designation: "Senior Developer"
    },
    month: 8,
    year: 2023,
    basicSalary: 50000,
    hra: 20000,
    conveyanceAllowance: 3000,
    medicalAllowance: 2000,
    specialAllowance: 10000,
    providentFund: 5000,
    professionalTax: 200,
    incomeTax: 8000,
    otherDeductions: 0,
    totalEarnings: 85000,
    totalDeductions: 13200,
    netPayable: 71800,
    status: 'generated',
    generatedOn: "2023-08-28"
  },
  {
    id: "p4",
    employeeId: "EMP002",
    employee: {
      name: "Jane Smith",
      employeeId: "EMP002",
      department: "Marketing",
      designation: "Marketing Specialist"
    },
    month: 8,
    year: 2023,
    basicSalary: 45000,
    hra: 18000,
    conveyanceAllowance: 3000,
    medicalAllowance: 2000,
    specialAllowance: 8000,
    providentFund: 4500,
    professionalTax: 200,
    incomeTax: 7000,
    otherDeductions: 0,
    totalEarnings: 76000,
    totalDeductions: 11700,
    netPayable: 64300,
    status: 'generated',
    generatedOn: "2023-08-28"
  }
];

// Holidays list
export const mockHolidays = [
  { date: "2023-01-26", name: "Republic Day" },
  { date: "2023-03-08", name: "Holi" },
  { date: "2023-04-07", name: "Good Friday" },
  { date: "2023-05-01", name: "Labour Day" },
  { date: "2023-08-15", name: "Independence Day" },
  { date: "2023-09-19", name: "Ganesh Chaturthi" },
  { date: "2023-10-02", name: "Gandhi Jayanti" },
  { date: "2023-10-24", name: "Dussehra" },
  { date: "2023-11-12", name: "Diwali" },
  { date: "2023-12-25", name: "Christmas" }
];
