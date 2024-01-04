//interface that describes attributes we give to Task Model to create record
export interface TaskAttrs{
  summary: string;
  description?: string;
  employeeId?: string;
  projectId: string;
  status?: string;
  date_assigned?: string;
  deadline?: string;
  date_started?: string;
  date_completed?: string;
}

//interface that describes attributes Task Model has
export interface TaskModel {
  id: number,
  summary: string;
  description?: string;
  employeeId?: string;
  projectId: string;
  status?: string;
  date_assigned?: string;
  deadline?: string;
  date_started?: string;
  date_completed?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

//interface that describes attributes of Task record returned upon query
export interface TaskRec {
  id: number,
  summary: string;
  description: string;
  employeeId: string;
  projectId: string;
  status: string;
  date_assigned: string;
  deadline: string;
  date_started: string;
  date_completed: string;
}

export interface TaskUpdateAttrs {
  summary: string;
  description: string;
  status: string;
  employeeId?: string;
  deadline?: string;
}