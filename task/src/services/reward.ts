import { Op } from "sequelize";

import db from "../db/models";
import Task from "../db/models/task";
import Employee from "../db/models/employee";

import { COMMON } from "../constants/common";
import { getMondays } from "../utils/helper";
import {
  DayEmpObj,
  EmpOfDay,
  MonthEmpObj,
  TaskData,
  WeekEmpObj,
} from "../types/reward";

export const getCurrDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStartEndOfMonth = (date: string) => {
  const d = new Date(date);
  const firstDayOfLastMonth = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  const lastDayOfLastMonth = new Date(d.getFullYear(), d.getMonth(), 0);

  const firstDay = `${firstDayOfLastMonth.getFullYear()}-${(
    firstDayOfLastMonth.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-01`;

  const lastDay = `${lastDayOfLastMonth.getFullYear()}-${(
    lastDayOfLastMonth.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${lastDayOfLastMonth
    .getDate()
    .toString()
    .padStart(2, "0")}`;

  return {
    firstDay,
    lastDay,
    month: lastDayOfLastMonth.getMonth(),
    year: lastDayOfLastMonth.getFullYear(),
  };
};

export const getEmpOfDay = async (date: string) => {
  try {
    //@ts-ignore
    const employee: EmpOfDay[] = await db.sequelize.query(
      `SELECT get_employee_of_the_day('${date}')`
    );
    const empObj: DayEmpObj = {
      date,
      id: null,
      name: null,
      email: null,
      designation: null,
    };

    if (Array.isArray(employee[0]) && employee[0].length) {
      const len = employee[0].get_employee_of_the_day.length;
      const [id, name, email, designation] = employee[0].get_employee_of_the_day
        .slice(1, len - 1)
        .split(",");
      empObj.id = id;
      empObj.name = name;
      empObj.email = email;
      empObj.designation = designation;
    }
    return empObj;
  } catch (error) {
    throw error;
  }
};

export const getEmpOfWeek = async (date: string) => {
  try {
    const { lastMonday, nextMonday } = getMondays(date);
    //@ts-ignore
    let employee: TaskData = await Task.findAndCountAll({
      attributes: [
        [
          db.sequelize.fn("COUNT", db.sequelize.col("employeeId")),
          "totalTasks",
        ],
      ],
      where: {
        status: COMMON.TASK_STATUS.DONE,
        date_completed: {
          [Op.between]: [lastMonday, nextMonday],
        },
      },
      include: {
        model: Employee,
        attributes: ["id", "name", "email", "designation"],
      },
      order: [["totalTasks", "DESC"]],
      group: [
        "Employee.id",
        "Employee.name",
        "Employee.email",
        "Employee.designation",
      ],
      limit: 1,
    });

    const empObj: WeekEmpObj = {
      startDay: lastMonday,
      endDay: nextMonday,
      id: null,
      name: null,
      email: null,
      designation: null,
    };

    if (
      employee.count &&
      Array.isArray(employee.rows) &&
      employee.rows.length &&
      employee?.rows[0].dataValues.Employee
    ) {
      empObj.id = employee.rows[0].dataValues.Employee.id;
      empObj.name = employee.rows[0].dataValues.Employee.name;
      empObj.email = employee.rows[0].dataValues.Employee.email;
      empObj.designation = employee.rows[0].dataValues.Employee.designation;
    }

    return empObj;
  } catch (error) {
    throw error;
  }
};

export const getEmpOfMonth = async (date: string) => {
  try {
    const { firstDay, lastDay, month, year } = getStartEndOfMonth(date);
    //@ts-ignore
    const employee: TaskData = await Task.findAndCountAll({
      attributes: [
        [
          db.sequelize.fn("COUNT", db.sequelize.col("employeeId")),
          "totalTasks",
        ],
      ],
      where: {
        status: COMMON.TASK_STATUS.DONE,
        date_completed: {
          [Op.between]: [firstDay, lastDay],
        },
      },
      include: {
        model: Employee,
        attributes: ["id", "name", "email", "designation"],
      },
      order: [["totalTasks", "DESC"]],
      group: [
        "Employee.id",
        "Employee.name",
        "Employee.email",
        "Employee.designation",
      ],
      limit: 1
    });

    const empObj: MonthEmpObj = {
      month,
      year,
      id: null,
      name: null,
      email: null,
      designation: null,
    };

   
    if (
      employee.count &&
      Array.isArray(employee.rows) &&
      employee.rows.length
      && employee?.rows[0].dataValues.Employee
    ) {
      empObj.id = employee?.rows[0].dataValues.Employee.id;
      empObj.name = employee?.rows[0].dataValues.Employee.name;
      empObj.email = employee?.rows[0].dataValues.Employee.email;
      empObj.designation = employee?.rows[0].dataValues.Employee.designation;
    }

    return empObj;
  } catch (error) {
    throw error;
  }
};
