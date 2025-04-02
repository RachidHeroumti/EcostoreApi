import express from 'express'
import {AddOrder,getOrders,updateOrder,deleteOrder,getOrderCount} from '../controllers/orderController.js'
import { protect ,protectAdmin}from '../middlwares/authMidlware.js'
const route = express.Router()

route.post('/create',AddOrder)
route.get('/find',protect,protectAdmin,getOrders)
route.put('/update/:id',protect,protectAdmin,updateOrder)
route.delete('/delete/:id',protect,protectAdmin,deleteOrder)
route.get('/size',protect,protectAdmin,getOrderCount);

export default route
