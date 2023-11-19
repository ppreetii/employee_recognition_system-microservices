import mongoose from "mongoose";

const validRequest = {
  name: "Employee 1",
  contact: "1234567890",
  personal_email: "test@test.com",
  email: "emp1@peaksoft.com",
  birthDate: "1995-03-31",
  address: "Radhe Society, BudhNagar, Mohali, Punjab",
  projectId: [new mongoose.Types.ObjectId().toHexString()],
  departmentId: new mongoose.Types.ObjectId().toHexString(),
  designation: "QA Engineer",
};

const invalidRequest = {
  name: 1244,
  contact: "123456",
  personal_email: "test",
  email: "emp1",
  birthDate: "31-03-1995",
  address: 12.3,
  designation: true,
};

const updateValidReq = {
  contact: "0123456789",
  personal_email: "update@test.com",
  address: "ShreeRam Niwas, NH-15, Near Rajwadi Hall, Pune, Maharashtra",
  projectId: [new mongoose.Types.ObjectId().toHexString()],
  departmentId: new mongoose.Types.ObjectId().toHexString(),
  designation: "Sr. Manager",
};

const invalidUpdateReq = {
  contact: "0123456",
  personal_email: "update",
  address: 2435425647,
  projectId: 52345,
  departmentId: true,
  designation: 57.13,
};

const id = new mongoose.Types.ObjectId().toHexString();

export default {
  validRequest,
  invalidRequest,
  id,
  updateValidReq,
  invalidUpdateReq
};
