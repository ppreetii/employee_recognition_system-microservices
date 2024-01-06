import mongoose from "mongoose";

const projectId = "65187956ee51d87d8f454181";

const managerData = {
  id: "6547bf6eb39e668f5f8c29cd",
  email: "test@test.com",
  is_active: 1,
  designation: "Product Manager",
  name: "Test Employee",
  projectId: [
    "65187956ee51d87d8f454181",
    "65187a7bd1bed561db93083f",
    "65187057882625797c0f0dbb",
  ],
};

const empData = {
  id: new mongoose.Types.ObjectId().toHexString(),
  email: "test@test.com",
  name: "test employee 1",
  designation: "test designation"
}

export default {
    projectId,
    managerData,
    empData
}
