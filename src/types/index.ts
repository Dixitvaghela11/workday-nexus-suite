
export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
};

export enum UserRole {
  Admin = 'admin',
  HR = 'hr',
  Employee = 'employee'
}

export enum LeaveStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Cancelled = 'cancelled'
}

export enum LeaveType {
  Sick = 'sick',
  Casual = 'casual',
  Paid = 'paid',
  Unpaid = 'unpaid',
  Compensatory = 'compensatory'
}

export enum EmployeeStatus {
  Active = 'active',
  Inactive = 'inactive',
  Resigned = 'resigned',
  Terminated = 'terminated',
  OnNotice = 'on_notice'
}

export enum AttendanceStatus {
  Present = 'present',
  Absent = 'absent',
  HalfDay = 'half_day',
  WorkFromHome = 'work_from_home',
  OnLeave = 'on_leave'
}

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
};

export type BankDetails = {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName?: string;
  ifscCode: string;
};

export type Qualification = {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: Date | string;
  endDate: Date | string;
  grade?: string;
};

export type Document = {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  fileUrl: string;
  uploadedAt: Date | string;
};

export type EmployeeProfile = {
  id: string;
  userId: string;
  employeeId: string;
  joiningDate: Date | string;
  birthDate?: Date | string;
  anniversaryDate?: Date | string;
  department: string;
  designation: string;
  reportingManager?: string;
  employmentType: string;
  status: EmployeeStatus;
  pfNumber?: string;
  personalInfo: PersonalInfo;
  bankDetails?: BankDetails;
  qualifications: Qualification[];
  documents: Document[];
};

export type Leave = {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: Date | string;
  endDate: Date | string;
  reason: string;
  status: LeaveStatus;
  appliedOn: Date | string;
  approvedBy?: string;
  approvedOn?: Date | string;
  rejectedBy?: string;
  rejectedOn?: Date | string;
  comments?: string;
};

export type LeaveBalance = {
  leaveType: LeaveType;
  total: number;
  used: number;
  balance: number;
  pending: number;
};

export type Attendance = {
  id: string;
  employeeId: string;
  date: Date | string;
  punchInTime?: Date | string;
  punchOutTime?: Date | string;
  status: AttendanceStatus;
  workHours?: number;
  comments?: string;
};

export type AttendanceSummary = {
  present: number;
  absent: number;
  halfDay: number;
  workFromHome: number;
  onLeave: number;
  total: number;
};

export type PayrollItem = {
  id: string;
  employeeId: string;
  employee: {
    name: string;
    employeeId: string;
    department: string;
    designation: string;
  };
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
  totalEarnings: number;
  totalDeductions: number;
  netPayable: number;
  status: 'generated' | 'paid';
  generatedOn: Date | string;
  paidOn?: Date | string;
};
