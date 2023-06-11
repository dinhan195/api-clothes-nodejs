/** @format */

import joi from 'joi';

export const email = joi.string().pattern(new RegExp('@gmail.com$')).required();
export const password = joi.string().min(6).max(20).required();
export const name = joi.string().required();
export const price = joi.number().required();
export const available = joi.number().required();
export const category_code = joi.string().alphanum().required();
export const image = joi.string().required();
export const description = joi.string();
export const productId = joi.number().required();
export const productIds = joi.array().required();
export const filename = joi.array().required();
export const refreshToken = joi.string().required();
