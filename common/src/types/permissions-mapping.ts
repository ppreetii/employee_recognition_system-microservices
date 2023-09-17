import {
  EmployeeActions,
  TaskActions,
  AuthActions,
  ProjectActions,
} from "./permissions";

export const EmployeeMapping = [
  AuthActions.Login,

  EmployeeActions.GetEmployeeById,
  EmployeeActions.UpdateEmployee,

  TaskActions.CreateTask,
  TaskActions.GetTaskById,
  TaskActions.GetTasks,
  TaskActions.DeleteTask,
];

export const ProjectMapping = [
  ...EmployeeMapping,

  ProjectActions.GetAllProjects,
];

export const OrganizationMapping = [
  ...ProjectMapping,

  AuthActions.SignUp,

  EmployeeActions.CreateEmployee,
  EmployeeActions.GetEmployees,
  EmployeeActions.DeleteEmployee,

  ProjectActions.CreateProject,
  ProjectActions.GetProjectById,
  ProjectActions.UpdateProject,
  ProjectActions.CloseProject,
];
