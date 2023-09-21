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

const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {role, id} = req.currentUser!;
    const projects = await projectService.getAllProjects(role, id!);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export default {
  createProject,
  getAllProjects
};
