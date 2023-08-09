import joi from "joi";

import { VALIDATION } from "../constants/validation";

export const signupLoginSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(VALIDATION.PSWD_MIN_LEN).max(VALIDATION.PSWD_MAX_LEN).required()
});
