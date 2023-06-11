/** @format */

import db from '../models';
import data from '../../data/data.json';
import { generrateCode } from '../helpers/fn';

//Register
export const insertData = () =>
  new Promise(async (resolve, reject) => {
    try {
      const categories = Object.keys(data);
      categories.forEach(async (item) => {
        await db.Category.create({
          code: generrateCode(item),
          value: item,
        });
      });
      const dataArr = Object.entries(data);
      dataArr.forEach((item) => {
        item[1]?.map(async (product) => {
          await db.Product.create({
            id: +product.id,
            name: product.name,
            image: product.image,
            price: +product.price,
            description: product.description,
            available: +product.available,
            category_code: generrateCode(item[0]),
          });
        });
      });
      resolve('OK');
    } catch (error) {
      reject(error);
    }
  });
