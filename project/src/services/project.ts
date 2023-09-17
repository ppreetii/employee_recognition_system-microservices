import { formatDateIST } from "@reward-sys/common";

import { Project } from "../models/project";
import { ProjectAttrs } from "../types/project-model";

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

export default {
  createProject,
};
