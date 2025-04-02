import express from 'express'
import {getAnalytics} from '../controllers/generalCntroller.js'
import { protect ,protectAdmin}from '../middlwares/authMidlware.js'
const route = express.Router()

route.get('/analytics',protect,protectAdmin,getAnalytics);


export default route
