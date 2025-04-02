import express from 'express'
import { Register ,login,updateUserRoleByCeo,getUsers,getTokenEmailVerification,deleteUser ,updateUserByCeo } from '../controllers/userController.js'
import { protect, protectCeo } from '../middlwares/authMidlware.js'

const route = express.Router()

route.post('/create',Register)
route.post('/login',login)
route.get('/find',protect,protectCeo,getUsers,)
route.put('/update/:id',protect,protectCeo,updateUserByCeo)
route.delete('/delete/:id',protect,protectCeo,deleteUser)
route.get('/verify-email/:token',getTokenEmailVerification)


export default route