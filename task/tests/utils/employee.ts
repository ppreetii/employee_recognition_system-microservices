import mongoose from "mongoose";

import Employee  from "../../src/db/models/employee";

export const createEmployee = async (is_active?: number) => {
    const employee = new Employee({
      id: new mongoose.Types.ObjectId().toHexString(),
      email: "test@test.com",
      name: "test employee 1",
      designation: "test designation"
    });
    
    if (is_active === 0) {
      employee.is_active = 0;
    }
  
    await employee.save();
  
    return employee;
  };
  