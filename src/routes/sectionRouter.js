import express from 'express'
import { protect ,protectAdmin}from '../middlwares/authMidlware.js'
import { CreateSection ,getSections,deleteSection } from '../controllers/sectionController.js'
const route = express.Router()

route.post('/create',protect,protectAdmin,CreateSection)
route.get('/find',getSections)
route.delete('/delete/:id',protect,protectAdmin,deleteSection)

export default route