
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import Card from '@/components/ui/custom/Card';
import ChipBadge from '@/components/ui/custom/ChipBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, startOfWeek, addDays, addHours } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Plus, Search, User, UserPlus, Users } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Employee, Schedule } from '@/types';

// Mock data
const positions = [
  { id: 'manager', name: 'Manager' },
  { id: 'chef', name: 'Chef' },
  { id: 'waiter', name: 'Waiter/Waitress' },
  { id: 'bartender', name: 'Bartender' },
  { id: 'host', name: 'Host/Hostess' },
  { id: 'cashier', name: 'Cashier' },
  { id: 'kitchen', name: 'Kitchen Staff' },
  { id: 'delivery', name: 'Delivery' },
];

// Mock employees data
const mockEmployees: Employee[] = [
  {
    id: 'e1',
    name: 'Juan Pérez',
    position: 'manager',
    email: 'juan@restaurant.com',
    phone: '555-123-4567',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=0D8ABC&color=fff',
    schedules: [
      {
        id: 's1',
        employeeId: 'e1',
        startTime: addHours(new Date(), 2),
        endTime: addHours(new Date(), 10),
      },
      {
        id: 's2',
        employeeId: 'e1',
        startTime: addHours(addDays(new Date(), 1), 2),
        endTime: addHours(addDays(new Date(), 1), 10),
      },
    ],
    createdAt: new Date('2022-05-10'),
    updatedAt: new Date('2023-02-15'),
  },
  {
    id: 'e2',
    name: 'María Rodríguez',
    position: 'chef',
    email: 'maria@restaurant.com',
    phone: '555-234-5678',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=0D8ABC&color=fff',
    schedules: [
      {
        id: 's3',
        employeeId: 'e2',
        startTime: addHours(new Date(), 4),
        endTime: addHours(new Date(), 12),
      },
      {
        id: 's4',
        employeeId: 'e2',
        startTime: addHours(addDays(new Date(), 2), 4),
        endTime: addHours(addDays(new Date(), 2), 12),
      },
    ],
    createdAt: new Date('2022-06-15'),
    updatedAt: new Date('2023-01-20'),
  },
  {
    id: 'e3',
    name: 'Carlos López',
    position: 'waiter',
    email: 'carlos@restaurant.com',
    phone: '555-345-6789',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=0D8ABC&color=fff',
    schedules: [
      {
        id: 's5',
        employeeId: 'e3',
        startTime: addHours(addDays(new Date(), 1), 6),
        endTime: addHours(addDays(new Date(), 1), 14),
      },
    ],
    createdAt: new Date('2022-07-05'),
    updatedAt: new Date('2023-03-10'),
  },
  {
    id: 'e4',
    name: 'Ana Martínez',
    position: 'bartender',
    email: 'ana@restaurant.com',
    phone: '555-456-7890',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=0D8ABC&color=fff',
    schedules: [
      {
        id: 's6',
        employeeId: 'e4',
        startTime: addHours(new Date(), 8),
        endTime: addHours(new Date(), 16),
      },
    ],
    createdAt: new Date('2022-08-12'),
    updatedAt: new Date('2023-04-05'),
  },
  {
    id: 'e5',
    name: 'Javier Sánchez',
    position: 'kitchen',
    email: 'javier@restaurant.com',
    phone: '555-567-8901',
    avatar: 'https://ui-avatars.com/api/?name=Javier+Sanchez&background=0D8ABC&color=fff',
    schedules: [
      {
        id: 's7',
        employeeId: 'e5',
        startTime: addHours(addDays(new Date(), 2), 10),
        endTime: addHours(addDays(new Date(), 2), 18),
      },
    ],
    createdAt: new Date('2022-09-20'),
    updatedAt: new Date('2023-02-28'),
  },
];

// Generate time slots for the schedule
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 8; i < 24; i++) {
    slots.push(`${i}:00`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Generate days of the week
const generateWeekDays = (startDate: Date) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
};

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [newEmployeeOpen, setNewEmployeeOpen] = useState(false);
  const [newScheduleOpen, setNewScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date()));
  const [scheduleEmployee, setScheduleEmployee] = useState<Employee | null>(null);
  const [scheduleStart, setScheduleStart] = useState<string>('');
  const [scheduleEnd, setScheduleEnd] = useState<string>('');
  const { toast } = useToast();

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
  });

  // Week days for the schedule view
  const weekDays = generateWeekDays(weekStartDate);

  // Filtered employees based on search and position
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      searchQuery === '' || 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      positions.find(p => p.id === employee.position)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPosition = 
      selectedPosition === null || 
      employee.position === selectedPosition;
    
    return matchesSearch && matchesPosition;
  });

  // Handle input change for new employee form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };

  // Handle select change for new employee form
  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };

  // Handle adding new employee
  const handleAddEmployee = () => {
    // Simple validation
    if (!newEmployee.name || !newEmployee.position || !newEmployee.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newEmployeeWithId: Employee = {
      id: `e${Date.now()}`,
      ...newEmployee,
      avatar: `https://ui-avatars.com/api/?name=${newEmployee.name.replace(' ', '+')}&background=0D8ABC&color=fff`,
      schedules: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setEmployees([newEmployeeWithId, ...employees]);
    toast({
      title: "Employee added",
      description: `${newEmployeeWithId.name} has been added to the team`
    });
    
    // Reset form and close dialog
    setNewEmployee({
      name: '',
      position: '',
      email: '',
      phone: '',
    });
    setNewEmployeeOpen(false);
  };

  // Handle adding new schedule
  const handleAddSchedule = () => {
    if (!scheduleEmployee || !scheduleStart || !scheduleEnd || !selectedDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all schedule details",
        variant: "destructive"
      });
      return;
    }

    // Parse times and create date objects
    const [startHour] = scheduleStart.split(':').map(Number);
    const [endHour] = scheduleEnd.split(':').map(Number);
    
    const startTime = new Date(selectedDate);
    startTime.setHours(startHour, 0, 0, 0);
    
    const endTime = new Date(selectedDate);
    endTime.setHours(endHour, 0, 0, 0);
    
    if (startTime >= endTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    const newSchedule: Schedule = {
      id: `s${Date.now()}`,
      employeeId: scheduleEmployee.id,
      startTime,
      endTime,
    };

    // Add schedule to employee
    const updatedEmployees = employees.map(emp => {
      if (emp.id === scheduleEmployee.id) {
        return {
          ...emp,
          schedules: [...emp.schedules, newSchedule],
          updatedAt: new Date()
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    toast({
      title: "Schedule added",
      description: `New schedule for ${scheduleEmployee.name} has been added`
    });
    
    // Reset form and close dialog
    setScheduleEmployee(null);
    setScheduleStart('');
    setScheduleEnd('');
    setNewScheduleOpen(false);
  };

  // Get schedules for a specific day
  const getSchedulesForDay = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const schedules: Array<Schedule & { employee: Employee }> = [];
    
    employees.forEach(employee => {
      employee.schedules.forEach(schedule => {
        if (schedule.startTime >= dayStart && schedule.startTime <= dayEnd) {
          schedules.push({
            ...schedule,
            employee,
          });
        }
      });
    });
    
    return schedules;
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <ChipBadge variant="primary">Employees</ChipBadge>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Employee Management</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={newEmployeeOpen} onOpenChange={setNewEmployeeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Add a new employee to the restaurant staff.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name*</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newEmployee.name}
                        onChange={handleInputChange}
                        placeholder="Enter employee name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Position*</Label>
                      <Select 
                        value={newEmployee.position} 
                        onValueChange={(value) => handleSelectChange('position', value)}
                      >
                        <SelectTrigger id="position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map(position => (
                            <SelectItem key={position.id} value={position.id}>
                              {position.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newEmployee.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setNewEmployeeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>
                    Add Employee
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={newScheduleOpen} onOpenChange={setNewScheduleOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Schedule</DialogTitle>
                  <DialogDescription>
                    Create a new work schedule for an employee.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee*</Label>
                    <Select 
                      value={scheduleEmployee?.id || ''} 
                      onValueChange={(value) => {
                        const selected = employees.find(emp => emp.id === value) || null;
                        setScheduleEmployee(selected);
                      }}
                    >
                      <SelectTrigger id="employee">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name} ({positions.find(p => p.id === employee.position)?.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Schedule Date*</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time*</Label>
                      <Select 
                        value={scheduleStart} 
                        onValueChange={setScheduleStart}
                      >
                        <SelectTrigger id="startTime">
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(slot => (
                            <SelectItem key={`start-${slot}`} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time*</Label>
                      <Select 
                        value={scheduleEnd} 
                        onValueChange={setScheduleEnd}
                      >
                        <SelectTrigger id="endTime">
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(slot => (
                            <SelectItem key={`end-${slot}`} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setNewScheduleOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSchedule}>
                    Add Schedule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="list">
                <Users className="h-4 w-4 mr-2" />
                Employee List
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="list" className="mt-0">
            <Card className="overflow-hidden">
              <div className="p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Button 
                    variant={selectedPosition === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedPosition(null)}
                  >
                    All Positions
                  </Button>
                  
                  {positions.map(position => (
                    <Button
                      key={position.id}
                      variant={selectedPosition === position.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPosition(position.id)}
                    >
                      {position.name}
                    </Button>
                  ))}
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 text-sm font-medium">
                    <div className="col-span-4 sm:col-span-3">Employee</div>
                    <div className="col-span-3 sm:col-span-2">Position</div>
                    <div className="hidden sm:block sm:col-span-3">Contact</div>
                    <div className="col-span-3 sm:col-span-2">Scheduled</div>
                    <div className="col-span-2 sm:col-span-2 text-right">Actions</div>
                  </div>
                  
                  <div className="divide-y">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee, index) => (
                        <motion.div
                          key={employee.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="grid grid-cols-12 gap-4 p-4 items-center text-sm"
                        >
                          <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">{employee.email}</p>
                            </div>
                          </div>
                          
                          <div className="col-span-3 sm:col-span-2">
                            <ChipBadge size="sm">
                              {positions.find(p => p.id === employee.position)?.name}
                            </ChipBadge>
                          </div>
                          
                          <div className="hidden sm:block sm:col-span-3 text-muted-foreground">
                            <p>{employee.phone || "No phone"}</p>
                          </div>
                          
                          <div className="col-span-3 sm:col-span-2">
                            <p className="text-sm font-medium">{employee.schedules.length} shifts</p>
                            {employee.schedules.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Next: {format(employee.schedules[0].startTime, "MMM dd, HH:mm")}
                              </p>
                            )}
                          </div>
                          
                          <div className="col-span-2 sm:col-span-2 flex justify-end gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-semibold">No employees found</h3>
                        <p className="text-muted-foreground mt-2">
                          No employees match your current filters or search criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-0">
            <Card className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setWeekStartDate(addDays(weekStartDate, -7))}>
                      Previous Week
                    </Button>
                    <Button variant="outline" onClick={() => setWeekStartDate(startOfWeek(new Date()))}>
                      Current Week
                    </Button>
                    <Button variant="outline" onClick={() => setWeekStartDate(addDays(weekStartDate, 7))}>
                      Next Week
                    </Button>
                  </div>
                  <div className="text-sm font-medium">
                    {format(weekDays[0], 'MMM dd')} - {format(weekDays[6], 'MMM dd, yyyy')}
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="font-medium text-sm mb-1">
                        {format(day, 'EEE')}
                      </div>
                      <div className="text-sm">
                        {format(day, 'MMM dd')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {weekDays.map((day, dayIndex) => {
                    const daySchedules = getSchedulesForDay(day);
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className="border rounded-md min-h-[150px] p-2 bg-background"
                      >
                        {daySchedules.length > 0 ? (
                          <div className="space-y-2">
                            {daySchedules.map((schedule, scheduleIndex) => (
                              <motion.div
                                key={schedule.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: scheduleIndex * 0.1 }}
                                className="bg-primary/10 rounded-md p-2 text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                              >
                                <div className="font-medium truncate">{schedule.employee.name}</div>
                                <div className="text-muted-foreground">
                                  {format(schedule.startTime, 'HH:mm')} - {format(schedule.endTime, 'HH:mm')}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                            No schedules
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Employees;
