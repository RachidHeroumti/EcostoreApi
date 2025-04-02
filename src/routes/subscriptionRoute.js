import express from 'express'
import { protect, protectAdmin } from '../middlwares/authMidlware.js'
import { AddSubscriber } from '../controllers/subscriptionController.js'

const route = express.Router()

route.post('/subscribe',protect,protectAdmin,AddSubscriber)

export default route