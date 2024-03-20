export interface EmpOfDay {
  get_employee_of_the_day: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
}

interface Row {
  dataValues: {
    Employee: Employee | null;
  };
  totalTasks: string;
}

export interface TaskData {
  rows?: Row[];
  count: number;
}

export interface DayEmpObj {
  date: string;
  id: string | null;
  name: string | null;
  email: string | null;
  designation: string | null;
}

export interface WeekEmpObj {
  startDay: string;
  endDay: string;
  id: string | null;
  name: string | null;
  email: string | null;
  designation: string | null;
}

export interface MonthEmpObj {
  month: number;
  year: number;
  id: string | null;
  name: string | null;
  email: string | null;
  designation: string | null;
}
