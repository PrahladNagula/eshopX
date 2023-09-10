const express = require('express');

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();
//The route here is basically /admin/products type , the /admin part is added in app.js THEREFORE no need of adding it here
router.get('/products', adminController.getProducts); // /admin/products

router.get('/products/new', adminController.getNewProduct);
//We are adding the image upload middleware here created , this will take care of the image upload location, filename
//and storage
router.post('/products', imageUploadMiddleware, adminController.createNewProduct);

router.get('/products/:id', adminController.getUpdateProduct);

router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);

router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;