import mongoose from "mongoose";
import { Roles } from "@reward-sys/common";

import { Password } from "../utils/password";

//interface describing properties needed to create auth record
interface AuthAttrs {
  email: string;
  password: string;
  role: Roles
}

//interface describing properties of Auth Model
interface AuthModel extends mongoose.Model<AuthDoc> {
  build(attrs: AuthAttrs): AuthDoc;
}

//interface describing properties that a Auth document has, one that is returned by Mongo
interface AuthDoc extends mongoose.Document {
  email: string;
  password: string;
  role: Roles;
  employeeId: string;
  is_active: Number;
}

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String
  },
  is_active: {
    type: Number,
    default: 1
  }
}, {
  toJSON: {
    transform(doc,ret){
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

authSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

authSchema.statics.build = (attrs: AuthAttrs) => {
  return new Auth(attrs);
};

const Auth = mongoose.model<AuthDoc, AuthModel>("Auth", authSchema);

export { Auth };