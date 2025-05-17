
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockEmployeeProfiles } from "@/services/mockData";
import { EmployeeProfile, PersonalInfo, BankDetails, Qualification, Document } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Trash } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (user) {
      // Find employee profile
      const employeeProfile = mockEmployeeProfiles.find(emp => emp.personalInfo.email === user.email);
      
      if (employeeProfile) {
        setProfile(employeeProfile);
        setPersonalInfo(employeeProfile.personalInfo);
        setBankDetails(employeeProfile.bankDetails || null);
        setQualifications(employeeProfile.qualifications);
        setDocuments(employeeProfile.documents);
      }
    }
  }, [user]);

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    if (!personalInfo) return;
    
    setPersonalInfo({
      ...personalInfo,
      [field]: value
    });
  };

  const handleBankDetailsChange = (field: keyof BankDetails, value: string) => {
    if (!bankDetails) return;
    
    setBankDetails({
      ...bankDetails,
      [field]: value
    });
  };

  const handleQualificationChange = (index: number, field: keyof Qualification, value: string | Date) => {
    const updatedQualifications = [...qualifications];
    
    updatedQualifications[index] = {
      ...updatedQualifications[index],
      [field]: value
    };
    
    setQualifications(updatedQualifications);
  };

  const addQualification = () => {
    setQualifications([
      ...qualifications,
      {
        id: `new-${qualifications.length}`,
        degree: "",
        institution: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: ""
      }
    ]);
  };

  const removeQualification = (index: number) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    setQualifications(updatedQualifications);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, we would upload this file to a server
    // For this demo, we'll simulate adding a document
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      employeeId: profile?.employeeId || "",
      name: file.name,
      type: file.type.split('/').pop() || "",
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    };
    
    setDocuments([...documents, newDocument]);
    
    toast({
      title: "Document uploaded",
      description: `${file.name} has been uploaded successfully.`
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    
    toast({
      title: "Document removed",
      description: "Document has been removed successfully."
    });
  };

  const handleSaveChanges = () => {
    // In a real app, we would send these changes to a server
    // For this demo, we'll just simulate a successful update
    
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
  };

  if (!profile || !personalInfo) {
    return <div className="py-10 text-center">Loading profile data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="mt-4 md:mt-0"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              variant="default"
              className="bg-hrms-primary hover:bg-hrms-primary/90"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile summary card */}
        <Card className="md:w-1/3">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-hrms-primary/20 text-hrms-primary text-2xl">
                  {personalInfo.firstName.charAt(0)}
                  {personalInfo.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">
                {personalInfo.firstName} {personalInfo.lastName}
              </h2>
              <p className="text-gray-500">{profile.designation}</p>
              <div className="mt-4 w-full">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Employee ID</span>
                  <span className="font-medium">{profile.employeeId}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium">{profile.department}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Joining Date</span>
                  <span className="font-medium">
                    {new Date(profile.joiningDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{personalInfo.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{personalInfo.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for profile details */}
        <div className="md:w-2/3">
          <Tabs 
            defaultValue="general" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="bank">Bank Details</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            {/* General Information Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your personal details used across the organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      disabled
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Input
                        id="bloodGroup"
                        value={personalInfo.bloodGroup || ""}
                        onChange={(e) => handlePersonalInfoChange("bloodGroup", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={personalInfo.city}
                        onChange={(e) => handlePersonalInfoChange("city", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={personalInfo.state}
                        onChange={(e) => handlePersonalInfoChange("state", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={personalInfo.zipCode}
                        onChange={(e) => handlePersonalInfoChange("zipCode", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={personalInfo.country}
                      onChange={(e) => handlePersonalInfoChange("country", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="border-t pt-4 mt-6">
                    <h3 className="font-medium mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactName">Name</Label>
                        <Input
                          id="emergencyContactName"
                          value={personalInfo.emergencyContactName || ""}
                          onChange={(e) => handlePersonalInfoChange("emergencyContactName", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactPhone">Phone</Label>
                        <Input
                          id="emergencyContactPhone"
                          value={personalInfo.emergencyContactPhone || ""}
                          onChange={(e) => handlePersonalInfoChange("emergencyContactPhone", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Bank Details Tab */}
            <TabsContent value="bank">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Account Details</CardTitle>
                  <CardDescription>
                    Your bank account information for salary payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bankDetails ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName">Account Holder Name</Label>
                        <Input
                          id="accountHolderName"
                          value={bankDetails.accountHolderName}
                          onChange={(e) => handleBankDetailsChange("accountHolderName", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={bankDetails.bankName}
                            onChange={(e) => handleBankDetailsChange("bankName", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="branchName">Branch Name</Label>
                          <Input
                            id="branchName"
                            value={bankDetails.branchName || ""}
                            onChange={(e) => handleBankDetailsChange("branchName", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={bankDetails.accountNumber}
                          onChange={(e) => handleBankDetailsChange("accountNumber", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          value={bankDetails.ifscCode}
                          onChange={(e) => handleBankDetailsChange("ifscCode", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-gray-500">No bank details available</p>
                      {isEditing && (
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => setBankDetails({
                            accountHolderName: `${personalInfo?.firstName} ${personalInfo?.lastName}`,
                            accountNumber: "",
                            bankName: "",
                            ifscCode: ""
                          })}
                        >
                          Add Bank Details
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Education/Qualifications Tab */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Educational Qualifications</CardTitle>
                  <CardDescription>
                    Your educational background and certifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {qualifications.length > 0 ? (
                    <div className="space-y-6">
                      {qualifications.map((qualification, index) => (
                        <div key={qualification.id} className="border p-4 rounded-md relative">
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 text-destructive"
                              onClick={() => removeQualification(index)}
                            >
                              <Trash size={16} />
                            </Button>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${index}`}>Degree/Certificate</Label>
                              <Input
                                id={`degree-${index}`}
                                value={qualification.degree}
                                onChange={(e) => handleQualificationChange(index, "degree", e.target.value)}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`institution-${index}`}>Institution</Label>
                              <Input
                                id={`institution-${index}`}
                                value={qualification.institution}
                                onChange={(e) => handleQualificationChange(index, "institution", e.target.value)}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <Label htmlFor={`fieldOfStudy-${index}`}>Field of Study</Label>
                            <Input
                              id={`fieldOfStudy-${index}`}
                              value={qualification.fieldOfStudy || ""}
                              onChange={(e) => handleQualificationChange(index, "fieldOfStudy", e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !qualification.startDate && "text-muted-foreground"
                                    )}
                                    disabled={!isEditing}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {qualification.startDate ? (
                                      format(
                                        typeof qualification.startDate === "string" 
                                          ? new Date(qualification.startDate) 
                                          : qualification.startDate, 
                                        "PPP"
                                      )
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={
                                      typeof qualification.startDate === "string"
                                        ? new Date(qualification.startDate)
                                        : qualification.startDate as Date
                                    }
                                    onSelect={(date) => handleQualificationChange(index, "startDate", date || "")}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor={`endDate-${index}`}>End Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !qualification.endDate && "text-muted-foreground"
                                    )}
                                    disabled={!isEditing}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {qualification.endDate ? (
                                      format(
                                        typeof qualification.endDate === "string" 
                                          ? new Date(qualification.endDate) 
                                          : qualification.endDate, 
                                        "PPP"
                                      )
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={
                                      typeof qualification.endDate === "string"
                                        ? new Date(qualification.endDate)
                                        : qualification.endDate as Date
                                    }
                                    onSelect={(date) => handleQualificationChange(index, "endDate", date || "")}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor={`grade-${index}`}>Grade/CGPA</Label>
                              <Input
                                id={`grade-${index}`}
                                value={qualification.grade || ""}
                                onChange={(e) => handleQualificationChange(index, "grade", e.target.value)}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isEditing && (
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-dashed"
                          onClick={addQualification}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Qualification
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-gray-500">No qualifications available</p>
                      {isEditing && (
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={addQualification}
                        >
                          Add Qualification
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Your personal and employment-related documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map((document) => (
                          <div 
                            key={document.id} 
                            className="border p-4 rounded-md flex justify-between items-center"
                          >
                            <div>
                              <h3 className="font-medium">{document.name}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(document.uploadedAt).toLocaleDateString()}
                                {" • "}
                                {document.type.toUpperCase()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              {isEditing && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-destructive"
                                  onClick={() => removeDocument(document.id)}
                                >
                                  <Trash size={16} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {isEditing && (
                        <div className="mt-6">
                          <Label htmlFor="document-upload">Upload New Document</Label>
                          <Input
                            id="document-upload"
                            type="file"
                            className="mt-2"
                            onChange={handleDocumentUpload}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-gray-500">No documents available</p>
                      {isEditing && (
                        <div className="mt-4">
                          <Label htmlFor="document-upload">Upload Document</Label>
                          <Input
                            id="document-upload"
                            type="file"
                            className="mt-2"
                            onChange={handleDocumentUpload}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
