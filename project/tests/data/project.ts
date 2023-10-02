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

const validUpdateReq = {
    manager_id : new mongoose.Types.ObjectId().toHexString(),
    members : [
        new mongoose.Types.ObjectId().toHexString(),
        new mongoose.Types.ObjectId().toHexString()
    ]
}

const invalidUpdateReq = {
    manager_id: 25356248,
    members: [
        new mongoose.Types.ObjectId().toHexString(),
        12243546,
        23432748
    ]
}

export default {
    validRequest,
    invalidRequest,
    id,
    invalidUpdateReq,
    validUpdateReq
}