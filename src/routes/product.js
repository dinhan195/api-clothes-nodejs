/** @format */
import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verify_token';
import { isAdmin, isCreatorOrAdmin } from '../middlewares/verify_roles';
import uploadCloud from '../middlewares/uploader';

const router = express.Router();

//PUBLISH ROUTER
router.get('/', controllers.getProducts);

//PRIVATE ROUTEEEEEEER
router.use(verifyToken);
router.use(isCreatorOrAdmin);
router.post('/', uploadCloud.single('image'), controllers.createProduct);
router.put('/', uploadCloud.single('image'), controllers.updateProduct);
router.delete('/', controllers.deleteProduct);

module.exports = router;
