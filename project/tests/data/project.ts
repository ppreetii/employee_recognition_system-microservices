import mongoose from "mongoose";

const id = new mongoose.Types.ObjectId().toHexString();

const validRequest = {
    name: "Test Project 1",
    client_id: new mongoose.Types.ObjectId().toHexString(),
    manager_id: new mongoose.Types.ObjectId().toHexString()
}

const invalidRequest = {
    name: 12344,
    client_id: true,
    manager_id: 12.46
}

export default {
    validRequest,
    invalidRequest,
    id
}