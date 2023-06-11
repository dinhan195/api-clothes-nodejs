/** @format */

import db from '../models';
import bdcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { notAuth } from '../middlewares/handle_error';

//Has password
const hasPassword = (password) =>
  bdcrypt.hashSync(password, bdcrypt.genSaltSync(8));

//Register
export const register = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { email },
        defaults: {
          email,
          password: hasPassword(password),
        },
      });
      const accessToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              email: response[0].email,
              role_code: response[0].role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: '60s' }
          )
        : null;
      // JWT_SECRET_REFRESH_TOKEN
      const refreshToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: '1d' }
          )
        : null;

      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? 'Register is successfully' : 'Email is used',
        access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        refresh_token: refreshToken,
      });
      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response[0].id },
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });

//Login
export const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { email },
        raw: true,
      });

      const isChecked =
        response && bdcrypt.compareSync(password, response.password);
      const accessToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
              email: response.email,
              role_code: response.role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: '60s' }
          )
        : null;
      // JWT_SECRET_REFRESH_TOKEN
      const refreshToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: '1d' }
          )
        : null;
      resolve({
        err: accessToken ? 0 : 1,
        mes: accessToken
          ? 'Login is successfully'
          : response
          ? 'Password is wrong'
          : 'Email has been rigistered',
        access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        refresh_token: refreshToken,
      });

      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response.id },
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });

//refresh token
export const refreshTokenService = (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { refresh_token },
      });
      if (response) {
        jwt.verify(
          refresh_token,
          process.env.JWT_SECRET_REFRESH_TOKEN,
          (err) => {
            if (err) {
              resolve({
                err: 1,
                mes: 'Refresh token expired, Require login',
              });
            } else {
              const accessToken = jwt.sign(
                {
                  id: response.id,
                  email: response.email,
                  role_code: response.role_code,
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
              );

              resolve({
                err: accessToken ? 0 : 1,
                mes: accessToken
                  ? 'OK'
                  : 'Fail to generate new access token. Let try more time',
                access_token: accessToken
                  ? `Bearer ${accessToken}`
                  : accessToken,
                refresh_token: refresh_token,
              });
            }
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });
