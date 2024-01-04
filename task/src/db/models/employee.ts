import { DataTypes, Model } from "sequelize";
import mongoose from "mongoose";

import sequelize from "../connection";
import { EmpAttrs, EmpModel, EmpRec } from "../../types/employee";

class Employee extends Model<EmpModel, EmpAttrs> implements EmpRec {
  public id!: mongoose.Types.ObjectId;
  public name!: string;
  public email!: string;
  public designation!: string;
  public is_active!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Employee.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.NUMBER,
      defaultValue: 1,
    },
  },
  {
    sequelize: sequelize.getInstance(),
    timestamps: true,
  }
);

export default Employee;
