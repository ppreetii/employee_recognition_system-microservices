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

export default {
    createTask
}