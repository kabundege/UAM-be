import Joi from '@hapi/joi';
import { enumToArray } from '../helpers/enumtoArray';

enum MaritalStatus { SINGLE, MARRIED, DIVORCED, WIDOWED }

export const SignIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const GetObject = Joi.object({
    key: Joi.string().required(),
});

export const CreateObject = Joi.object({
    type: Joi.string().required(),
});

export const ForgotPass = Joi.object({
    email: Joi.string().email().required(),
});


export const ResetPass = Joi.object({
    password: Joi.string().required(),
});

export const SignUp = Joi.object({
    profilePhoto: Joi.string().required(),
    name: Joi.string().pattern(/^[a-zA-Z0-9 *]{3,25}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    gender: Joi.string().required(),
    age: Joi.string().required(),
    national_id: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    document: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    maritalStatus: Joi.string().valid(...enumToArray(MaritalStatus)).required(),
    nationality: Joi.string().required(),
});
