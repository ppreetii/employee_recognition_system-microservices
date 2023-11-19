import { Roles, formatDateIST } from "@reward-sys/common";
import axios from "axios";
import https from "https";

import { TaskAttrs, TaskRec } from "../types/task";
import Task from "../db/models/task";
import { COMMON } from "../constants/common";
import config from "../configs/config";
import { Op } from "sequelize";

const createTask = async (data: TaskAttrs) => {
  try {
    const task = new Task(buildTask(data)); //TODO: make build method of Task model
    await task.save();
    return sanitizeTaskData(task);
  } catch (error) {
    throw error;
  }
};

function buildTask(data: TaskAttrs) {
  const taskData: TaskAttrs = {
    summary: data?.summary,
    projectId: data?.projectId,
  };

  if (data?.description) {
    taskData.description = data.description;
  }
  if (data?.employeeId) {
    taskData.employeeId = data.employeeId; //TODO: Find a way to check if employee still exists.
    taskData.date_assigned = formatDateIST(new Date());
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

async function getEmployee(loginId: string) {
  try {
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    
    const { data } = await instance.get(`${config.employeeURL!}/${loginId}`, {
      headers: {
        "x-api-key": config.apiKey,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
}

export default {
  createTask,
  getAllTasks,
  buildTask,
  sanitizeTaskData,
};
