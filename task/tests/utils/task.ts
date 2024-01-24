import mongoose from "mongoose";

import Task from "../../src/db/models/task";

export const createTask = async (data?: any) => {
  const task = new Task({
    summary: "Test Task",
    description: "Test Description",
    employeeId: data?.employeeId ?? new mongoose.Types.ObjectId().toHexString(),
    projectId: data?.projectId ?? new mongoose.Types.ObjectId().toHexString(),
  });
  await task.save();
  return {
    id: task.id,
    employeeId: task.employeeId,
    projectId: task.projectId,
  };
};

export const getTask = async (id: number) => {
  const task = await Task.findByPk(id);
  return task;
};
