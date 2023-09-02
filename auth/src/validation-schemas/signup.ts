import joi from "joi";
import { Roles } from "@reward-sys/common";

import { VALIDATION } from "../constants/validation";

export const SignupSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(VALIDATION.PSWD_MIN_LEN).required(),
    role: joi.string().valid(...Object.values(Roles)).required()
});

export const LoginSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(VALIDATION.PSWD_MIN_LEN).required(),
});
