import Employee  from "../../src/db/models/employee";
import empMockData from "../data/employee";
import { EmpAttrs } from "../../src/types/employee";

export const createEmployee = async (is_active?: number, is_manager: boolean = false, is_manager2: boolean = false) => {
    let empData:EmpAttrs = is_manager ? {...empMockData.managerData} : empMockData.empData;
    if(is_manager2){
        empData.projectId?.pop();
    }
    const employee = new Employee(empData);

    if (is_active === 0) {
      employee.is_active = 0;
    }
 
    await employee.save();
  
    return employee;
};
  