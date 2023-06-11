/** @format */
import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verify_token';
import { isAdmin, isModeratorOrAdmin } from '../middlewares/verify_roles';

const router = express.Router();

router.use(verifyToken);
router.get('/me', controllers.getCurrent);

module.exports = router;
