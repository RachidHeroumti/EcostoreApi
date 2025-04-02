import express from 'express'
import {createProduct,updateProduct,deleteProduct ,getProducts,getProductCount} from '../controllers/productController.js'
import { protect ,protectAdmin}from '../middlwares/authMidlware.js'
const route = express.Router()

route.post('/create',protect,protectAdmin,createProduct)
route.get('/find',getProducts)
route.put('/update/:id',protect,protectAdmin,updateProduct)
route.delete('/delete/:id',protect,protectAdmin,deleteProduct)
route.get('/size',getProductCount)
export default route