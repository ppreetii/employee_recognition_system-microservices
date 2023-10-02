import {
  ForbiddenError,
  NotFoundError,
  Roles,
  formatDateIST,
} from "@reward-sys/common";

import { Project } from "../models/project";
import { ProjectAttrs, ProjectDoc, UpdateProjectAttrs } from "../types/project";
import { COMMON } from "../constants/common";
import { Employee } from "../models/employee";

const createProject = async (data: ProjectAttrs) => {
  try {
    const createdOn = formatDateIST(new Date());
    const manager = await Employee.findOne({
      _id: data.manager_id,
      is_active: 1,
    });

    if (!manager) {
      throw new Error("Manager Not Found");
    }

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

    const projects = await Project.find(filterOptions) //TODO: populate client
      .select("name client_id is_active manager_id")
      .skip((page - 1) * COMMON.PROJECTS_PER_PAGE)
      .limit(COMMON.PROJECTS_PER_PAGE)
      .populate({
        path: "manager_id",
        select: "name -_id",
      });

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

const getProjectById = async (projectId: string) => {
  try {
    const project = await Project.findById(projectId).populate({
      path: "manager_id",
      select: "name email",
    }); //TODO : populate client

    if (!project) {
      throw new NotFoundError();
    }

    return project;
  } catch (error) {
    throw error;
  }
};

const updateProject = async (
  role: string,
  projectId: string,
  data: UpdateProjectAttrs,
  managerId: string | null
) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError();
    }

    if (role === Roles.Organization) {
      updateProjectByOrg(project, data);
    }

    if (role === Roles.Project) {
      if (project.manager_id.toString() !== managerId) {
        throw new ForbiddenError();
      }
      updateProjectByProj(project, data, managerId!);
    }

    await project.save();

    return project;
  } catch (error) {
    throw error;
  }
};

function updateProjectByOrg(project: ProjectDoc, data: UpdateProjectAttrs) {
  if (data.manager_id) {
    if (!project.past_managers.includes(project.manager_id))
      project.past_managers.push(project.manager_id);
    project.manager_id = data.manager_id;
  }
}

function updateProjectByProj(
  project: ProjectDoc,
  data: UpdateProjectAttrs,
  managerId: string
) {
  if (managerId) {
    const index = data.members!.indexOf(managerId);
    const len = data.members!.length;
    if (index !== -1) {
      [data.members![index], data.members![len - 1]] = [
        data.members![len - 1],
        data.members![index],
      ];
      data.members!.pop();
    }
    const map = new Map();
    project.team_members.forEach((member) => {
      if (!map.has(member.toString())) map.set(member.toString(), 1);
    });

    for (let member of data.members!) {
      if (!map.has(member.toString())) {
        project.team_members.push(member);
        map.set(member.toString(), 1);
      }
    }
  }
}

export default {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
};
