import {
  EmployeeActions,
  TaskActions,
  AuthActions,
  ProjectActions,
} from "./permissions";
import { removePermission } from "../utils/permission";

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
  ProjectActions.UpdateProject,
];

export const OrganizationMapping = [
  ...removePermission(ProjectMapping, Object.values(TaskActions)),

  AuthActions.SignUp,

  EmployeeActions.CreateEmployee,
  EmployeeActions.GetEmployees,
  EmployeeActions.DeleteEmployee,

  ProjectActions.CreateProject,
  ProjectActions.GetProjectById,
  ProjectActions.CloseProject,
];
