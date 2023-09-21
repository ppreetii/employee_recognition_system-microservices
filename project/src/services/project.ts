import { Roles, formatDateIST } from "@reward-sys/common";

import { Project } from "../models/project";
import { ProjectAttrs } from "../types/project-model";
import { COMMON } from "../constants/common";

const createProject = async (data: ProjectAttrs) => {
  try {
    const createdOn = formatDateIST(new Date());
    const project = Project.build({
      name: data.name,
      client_id: data.client_id,
      manager_id: data.manager_id,
      created_on: createdOn,
    });
    await project.save();

    return project;
  } catch (error) {
    throw error;
  }
};

const getAllProjects = async (
  role: string,
  manager_id: string,
  page: number = 1
) => {
  try {
    const filterOptions: any = {};
    if (role === Roles.Project) filterOptions.manager_id = manager_id;

    const count = await Project.find(filterOptions).countDocuments();

    const projects = await Project.find(filterOptions)
      .skip((page - 1) * COMMON.PROJECTS_PER_PAGE)
      .limit(COMMON.PROJECTS_PER_PAGE);

    const lastPage = Math.ceil(count / COMMON.PROJECTS_PER_PAGE);

    return {
      total: count,
      currentPage: page,
      nextPage: page + 1 <= lastPage ? page + 1 : lastPage,
      previousPage: page - 1 >= 1 ? page - 1 : 1,
      lastPage,
      data: projects,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  createProject,
  getAllProjects,
};
