import express from 'express'
import {getAnalytics ,ExportData} from '../controllers/generalCntroller.js'
import { protect ,protectAdmin}from '../middlwares/authMidlware.js'
const route = express.Router()

route.get('/analytics',protect,protectAdmin,getAnalytics);

route.get('/exportdata',ExportData);


export default route
