import mongoose from "mongoose";

import { ProjectModel, ProjectDoc, ProjectAttrs } from "../types/project";

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee"
    },
    past_managers: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee"
      }],
      default: [],
    },
    team_members: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee"
      }],
      default: [],
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
        ret.manager = ret.manager_id;
        delete ret._id;
        delete ret.__v;
        delete ret.manager_id
      },
    },
  }
);

projectSchema.statics.build = (attrs: ProjectAttrs) => {
  return new Project(attrs);
};

const Project = mongoose.model<ProjectDoc, ProjectModel>(
  "project",
  projectSchema
);

export { Project };
