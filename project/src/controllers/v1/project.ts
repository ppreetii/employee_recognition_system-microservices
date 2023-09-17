import { Request, Response, NextFunction } from "express";

import projectService from "../../services/project";

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export default {
  createProject,
};
