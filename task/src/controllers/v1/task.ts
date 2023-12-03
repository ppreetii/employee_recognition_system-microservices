import { Request, Response, NextFunction } from "express";

import taskService from "../../services/task";

const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;  
      const task = await taskService.createTask(data);
  
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
};

const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.currentUser?.role!;
    const id = req.currentUser?.id!;
    const page = req.query?.page ?? 1;
    const tasks = await taskService.getAllTasks(role, id!, +page);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.currentUser?.role!;
    const id = req.currentUser?.id!;
    const taskId = req.params.taskId;
    const task = await taskService.getTask(role, id!, taskId);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.currentUser?.role!;
    const id = req.currentUser?.id!;
    const taskId = req.params.taskId;
    await taskService.deleteTask(role, id!, taskId);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};

export default {
    createTask,
    getAllTasks,
    getTask,
    deleteTask
}