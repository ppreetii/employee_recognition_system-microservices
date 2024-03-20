//interface that describes attributes we give to Employee Model to create record
export interface EmpAttrs {
  id: string;
  name: string;
  email: string;
  designation: string;
  projectId?: string[];
}

//interface that describes attributes Employee Model has
export interface EmpModel {
  id: string;
  name: string;
  email: string;
  designation: string;
  projectId: string[];
  is_active: number;
  createdAt?: Date;
  updatedAt?: Date;
}

//interface that describes attributes of Employee record returned upon query
export interface EmpRec {
  id: string;
  name: string;
  email: string;
  designation: string;
  projectId: string[];
  is_active: number;
}
