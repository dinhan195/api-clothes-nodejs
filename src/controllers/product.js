/** @format */

import * as services from '../services';
import { badRequest, internalServerError } from '../middlewares/handle_error';
import {
  name,
  price,
  category_code,
  available,
  image,
  description,
  productId,
  productIds,
  filename,
} from '../helpers/joi_schema';
import joi from 'joi';
const cloudinary = require('cloudinary').v2;

// GET product
export const getProducts = async (req, res) => {
  try {
    const response = await services.getProducts(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

//create new product
export const createProduct = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi
      .object({
        name,
        price,
        category_code,
        available,
        description,
        image,
      })
      .validate({ ...req.body, image: fileData?.path });

    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return badRequest(error.details[0].message, res);
    }
    const response = await services.createNewProduct(req.body, fileData);

    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const fileData = req.file;

    const { error } = joi
      .object({ productId })
      .validate({ productId: req.body.productId });

    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return badRequest(error.details[0].message, res);
    }
    const response = await services.updateProduct(req.body, fileData);

    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const { error } = joi.object({ productIds, filename }).validate(req.query);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await services.deleteProducts(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
