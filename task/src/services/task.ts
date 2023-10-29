import { formatDateIST } from "@reward-sys/common";

import { TaskAttrs, TaskRec } from "../types/task";
import Task from "../db/models/task";
import { COMMON } from "../constants/common";

const createTask = async (data: TaskAttrs) => {
  try {
    const task = new Task(build(data));
    await task.save();
    return sanitizeTaskData(task);
  } catch (error) {
    throw error;
  }
};

function build(data: TaskAttrs) {
  const taskData: TaskAttrs = {
    summary: data?.summary,
  };

  if (data?.description) {
    taskData.description = data.description;
  }
  if (data?.employeeId) {
    taskData.employeeId = data.employeeId;
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
    employeeId: task.employeeId,
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

export default {
  createTask,
};
