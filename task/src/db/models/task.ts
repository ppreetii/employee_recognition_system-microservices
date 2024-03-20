import { DataTypes, Model } from "sequelize";

import { COMMON } from "../../constants/common";
import sequelize from "../connection";
import { TaskAttrs,TaskModel, TaskRec } from "../../types/task";
import Employee from "./employee";

class Task extends Model<TaskModel, TaskAttrs> implements TaskRec{
  public id!: number;
  public employeeId!: string;
  public projectId!: string;
  public summary!: string;
  public description!: string;
  public status!: string;
  public date_assigned!: string;
  public deadline!: string;
  public date_started!: string;
  public date_completed!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.STRING,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(
        COMMON.TASK_STATUS.TODO,
        COMMON.TASK_STATUS.INPROGRESS,
        COMMON.TASK_STATUS.DONE
      ),
      defaultValue: COMMON.TASK_STATUS.TODO,
    },
    date_assigned: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_started: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_completed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelize.getInstance(),
    timestamps: true
  }
);

//defining relationships
Task.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasMany(Task, { foreignKey: "employeeId" });

export default Task;
