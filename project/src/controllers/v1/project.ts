import { Request, Response, NextFunction } from "express";

import projectService from "../../services/project";
import { Roles } from "@reward-sys/common";

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
    const { role, id } = req.currentUser!;
    const page = req.query?.page ?? 1;
    const projects = await projectService.getAllProjects(role, id!, +page);
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pid = req.params.pid;
    const project = await projectService.getProjectById(pid);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pid = req.params.pid;
    const role = req.currentUser!.role;
    let managerId = null;
    if (role === Roles.Project) managerId = req.currentUser!.id;
    const data = req.body;

    const project = await projectService.updateProject(
      role,
      pid,
      data,
      managerId
    );

    res.json(project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pid = req.params.pid;
    const empId = req.currentUser!.id;
    const project = await projectService.deleteProject(pid, empId);

    res.status(204).json(project);
  } catch (error) {
    next(error);
  }
};

export default {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
