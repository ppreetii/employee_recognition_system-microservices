import { EmployeeActions, TaskActions, AuthActions } from "./permissions";

export const OrganizationMapping = [
  AuthActions.SignUp,
  AuthActions.Login,

  EmployeeActions.CreateEmployee,
  EmployeeActions.GetEmployees,
  EmployeeActions.GetEmployeeById,
  EmployeeActions.UpdateEmployee,
  EmployeeActions.DeleteEmployee,

  TaskActions.CreateTask,
  TaskActions.GetTaskById,
  TaskActions.GetTasks,
  TaskActions.DeleteTask,
];

export const EmployeeMapping = [
  AuthActions.Login,

  EmployeeActions.GetEmployeeById,

  TaskActions.CreateTask,
  TaskActions.GetTaskById,
  TaskActions.GetTasks,
  TaskActions.DeleteTask,
];

export const ProjectMapping = [
  AuthActions.Login,
  
  EmployeeActions.GetEmployeeById,

  TaskActions.CreateTask,
  TaskActions.GetTaskById,
  TaskActions.GetTasks,
  TaskActions.DeleteTask,
];

