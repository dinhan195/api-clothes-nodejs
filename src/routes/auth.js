/** @format */
import * as controllers from '../controllers';
import express from 'express';

const router = express.Router();

router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.post('/refesh-token', controllers.refreshTokenController);

module.exports = router;
