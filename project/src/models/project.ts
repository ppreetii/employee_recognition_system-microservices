import mongoose from "mongoose";

import { ProjectModel, ProjectDoc, ProjectAttrs } from "../types/project-model";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    client_id: {
      type: String,
      required: true,
    },
    manager_id: {
      type: String,
    },
    created_on: {
      type: String,
    },
    closed_on: {
      type: String,
    },
    closed_by: {
      type: String,
    },
    is_active: {
      type: Number,
      default: 1,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

projectSchema.statics.build = (attrs: ProjectAttrs) => {
    return new Project(attrs);
  };

const Project = mongoose.model<ProjectDoc, ProjectModel>("project", projectSchema);

export {Project};
