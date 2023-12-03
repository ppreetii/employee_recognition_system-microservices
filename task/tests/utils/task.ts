import mongoose from "mongoose";

import taskSrv from "../../src/services/task";
import Task from "../../src/db/models/task";
import { TaskAttrs } from "../../src/types/task";

export const createTask = async (data?:any) => {
  const task = new Task(
    taskSrv.buildTask(getTaskObject(data))
  );
  await task.save();
  return {
    id: task.id,
    employeeId: task.employeeId,
    projectId: task.projectId
  }
};

function getTaskObject(data:any){
    const task: TaskAttrs = {
      summary: "Test Task",
      description: "Test Description",
      employeeId: data?.employeeId ?? new mongoose.Types.ObjectId().toHexString(),
      projectId: data?.projectId ?? new mongoose.Types.ObjectId().toHexString(),
    }

    return task;
}