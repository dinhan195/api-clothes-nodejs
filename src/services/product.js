/** @format */

import { productId } from '../helpers/joi_schema';
import db from '../models';

import { Op } from 'sequelize';
const cloudinary = require('cloudinary').v2;
//Get products
export const getProducts = ({
  page,
  limit,
  order,
  name,
  available,
  ...query
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_PRODUCT;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.name = { [Op.substring]: name };
      if (available) query.available = { [Op.between]: available };
      const response = await db.Product.findAndCountAll({
        where: query,
        ...queries,
        attributes: {
          exclude: ['category_code'],
        },
        include: [
          {
            model: db.Category,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            as: 'categoryData',
          },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        mes: response ? 'Got' : 'Cannot found products',
        productData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

//ADD Product

export const createNewProduct = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.findOrCreate({
        where: { name: body?.name },
        defaults: {
          ...body,
          image: fileData?.path,
          filename: fileData?.filename,
        },
      });

      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? 'Created' : 'Cannot create new product',
      });
      if (fileData && !response[1])
        cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });

//UPPDATE PRODUCT
export const updateProduct = ({ productId, ...body }, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) body.image = fileData?.path;
      const response = await db.Product.update(body, {
        where: { id: productId },
      });

      resolve({
        err: response[0] > 0 ? 0 : 1,
        mes:
          response[0] > 0
            ? `${response[0]} product updated`
            : 'Cannot update product / product id notfound',
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
      reject(error);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });

//DELETE PRODUCT
//[id1, id2]
export const deleteProducts = ({ productIds, filename }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Product.destroy({
        where: { id: productIds },
      });
      resolve({
        err: response > 0 ? 0 : 1,
        mes: `${response} product(s) deleted`,
      });
      // cloudinary.api.delete_resources(filename)
      if (filename) cloudinary.api.delete_resources(filename);
    } catch (error) {
      reject(error);
    }
  });
