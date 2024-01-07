import {
  ForbiddenError,
  NotFoundError,
  Roles,
  formatDateIST,
} from "@reward-sys/common";

import { TaskAttrs, TaskRec, TaskUpdateAttrs } from "../types/task";
import Task from "../db/models/task";
import Employee from "../db/models/employee";
import { COMMON } from "../constants/common";
import { Op } from "sequelize";

const createTask = async (data: TaskAttrs) => {
  try {
    const taskData = await buildTask(data);
    const task = new Task(taskData);
    await task.save();
    return sanitizeTaskData(task);
  } catch (error) {
    throw error;
  }
};

const getAllTasks = async (role: string, id: string, page: number) => {
  try {
    const filterOptions: any = {};
    if (role === Roles.Employee) filterOptions.employeeId = id;
    if (role === Roles.Project) {
      const manager = await getEmployee(id);
      filterOptions.projectId = {
        [Op.in]: manager?.projectId || [],
      };
    }

    const limit = COMMON.LIMIT;
    const offset = (page - 1) * limit;

    const { count, rows } = await Task.findAndCountAll({
      where: filterOptions,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / COMMON.LIMIT);
    const data = rows.map((task) => sanitizeTaskData(task));

    return {
      totalRecords: count,
      currentPage: page,
      nextPage: page + 1 < totalPages ? page + 1 : totalPages,
      previousPage: page > 1 ? page - 1 : 1,
      totalPages,
      data,
    };
  } catch (error) {
    throw error;
  }
};

const getTask = async (role: string, id: string, taskId: string) => {
  try {
    const filterOptions: any = {
      id: taskId,
    };
    if (role === Roles.Employee) filterOptions.employeeId = id;

    const task = await Task.findOne({
      where: {
        ...filterOptions,
      },
    });

    if (!task) {
      throw new NotFoundError("Task Not Found");
    }

    if (role === Roles.Project) {
      const manager = await isManager(id, task.projectId);
      if (!manager) {
        throw new ForbiddenError();
      }
    }

    return sanitizeTaskData(task);
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (role: string, id: string, taskId: string) => {
  try {
    const filterOptions: any = {
      id: taskId,
    };
    if (role === Roles.Employee) filterOptions.employeeId = id;

    const task = await Task.findOne({
      where: {
        ...filterOptions,
      },
    });

    if (!task) {
      throw new NotFoundError("Task Not Found");
    }

    if (role === Roles.Project) {
      const manager = await isManager(id, task.projectId);
      if (!manager) {
        throw new ForbiddenError();
      }
    }

    await task.destroy();
  } catch (error) {
    throw error;
  }
};

const updateTask = async (
  //TODO: there is change in design, this function will be completed after that
  role: string,
  id: string,
  taskId: string,
  taskData: TaskUpdateAttrs
) => {
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new NotFoundError("Task Not Found");
    }

    task.summary = taskData.summary;
    task.description = taskData.description;
    if (task.status !== taskData.status) {
      updateTaskDatesByStatus(taskData.status, task);
    }

    if (role === Roles.Project) {
      updateByProject(taskData, task);
    }

    await task.save();

    return sanitizeTaskData(task);
  } catch (error) {
    throw error;
  }
};

async function buildTask(data: TaskAttrs) {
  const taskData: TaskAttrs = {
    summary: data?.summary,
    projectId: data?.projectId,
  };

  if (data?.employeeId) {
    const employee = await Employee.findByPk(data.employeeId);
    if (!employee) {
      throw new NotFoundError("Employee Not Found");
    }
    taskData.employeeId = data.employeeId;
    taskData.date_assigned = formatDateIST(new Date());
  }

  if (data?.description) {
    taskData.description = data.description;
  }

  if (data?.deadline) {
    taskData.deadline = data.deadline;
  }

  if (data?.status) {
    setDate(data.status, taskData);
  }

  return taskData;
}

function setDate(
  status: string = COMMON.TASK_STATUS.TODO,
  taskData: TaskAttrs
) {
  let date = formatDateIST(new Date());
  switch (status) {
    case COMMON.TASK_STATUS.INPROGRESS:
      taskData.date_started = date;
      break;

    case COMMON.TASK_STATUS.DONE:
      taskData.date_completed = date;
      break;
  }

  taskData.status = status;
}

function sanitizeTaskData(task: TaskRec) {
  return {
    id: task.id,
    summary: task.summary,
    description: task.description,
    status: task.status,
    employeeId: task.employeeId ?? null,
    projectId: task.projectId ?? null,
    deadline: task.deadline ? formatDateIST(task.deadline) : null,
    date_assigned: task.date_assigned
      ? formatDateIST(task.date_assigned)
      : null,
    date_started: task.date_started ? formatDateIST(task.date_started) : null,
    date_completed: task.date_completed
      ? formatDateIST(task.date_completed)
      : null,
  };
}

async function getEmployee(empId: string) {
  try {
    const employee = await Employee.findByPk(empId);
    if (!employee) {
      throw new NotFoundError("Employee Not Found");
    }

    return employee;
  } catch (error) {
    throw error;
  }
}

async function isManager(managerId: string, taskProjectId: string) {
  try {
    const manager = await getEmployee(managerId);
    return manager?.projectId.includes(taskProjectId);
  } catch (error) {
    throw error;
  }
}

function updateTaskDatesByStatus(status: string, task: TaskRec) {
  task.status = status;
  switch (status) {
    case COMMON.TASK_STATUS.INPROGRESS:
      task.date_started = formatDateIST(new Date());
      break;

    case COMMON.TASK_STATUS.DONE:
      task.date_completed = formatDateIST(new Date());
      break;

    default:
      task.status = COMMON.TASK_STATUS.TODO;
  }
}

async function updateByProject( //TODO: there is change in design, this function will be completed after that
  taskData: TaskUpdateAttrs,
  task: TaskRec,
  loginId?: string
) {
  try {
    if (taskData.deadline) {
      task.deadline = taskData.deadline;
    }
    if (taskData.employeeId) {
      const employee = await getEmployee(taskData.employeeId);

      if (employee) task.employeeId = taskData.employeeId;
    }
  } catch (error) {
    throw error;
  }
}

export default {
  createTask,
  getAllTasks,
  getTask,
  deleteTask,
  buildTask,
  sanitizeTaskData,
  updateTask,
};
