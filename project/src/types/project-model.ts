import mongoose from "mongoose";

//interface describing properties of Project Model
export interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc;
}

//interface describing properties that a Employee document has, one that is returned by Mongo
export interface ProjectDoc extends mongoose.Document {
  name: string;
  client_id: string;
  manager_id: string;
  created_on: string;
  closed_on: string;
  closed_by: string;
  is_active: Number;
}

//interface describing properties needed to create a Project by post request
export interface ProjectAttrs {
  name: string;
  client_id: string;
  manager_id?: string;
  created_on: string;
  closed_on?: string;
  closed_by?: string;
  is_active?: Number; //added for test case
}

//interface describing properties needed to update a project by patch request
export interface UpdateProjectAttrs {
  manager_id?: string;
  closed_on?: string;
  closed_by?: string;
}
