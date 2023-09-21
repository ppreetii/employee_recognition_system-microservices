import mongoose from "mongoose";

import { Project } from "../../src/models/project";
import mockData from "../data/project";
import { formatDateIST } from "@reward-sys/common";

export const createProject = async (managerId?: string) => {
  // we have to do it manually for test cases
  const createdOn = formatDateIST(new Date());
  const {name, client_id, manager_id} = mockData.validRequest;
  const project = Project.build({
    name,
    client_id,
    manager_id: managerId ?? manager_id,
    created_on: createdOn,
  });
  await project.save();
  
  return {
    id: project.id,
    manager_id : project.manager_id
  }
};
