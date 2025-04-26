import express from 'express'
import { Register ,login,updateUserRoleByCeo,getUsers,getTokenEmailVerification,deleteUser ,updateUserByCeo, getUser } from '../controllers/userController.js'
import { protect, protectCeo } from '../middlwares/authMidlware.js'

const route = express.Router()

route.post('/create',Register)
route.post('/login',login)
route.get('/find',protect,protectCeo,getUsers,)
route.get('/find/:id',protect,protectCeo,getUser)
route.put('/update/:id',protect,protectCeo,updateUserByCeo)
route.delete('/delete/:id',protect,protectCeo,deleteUser)
route.get('/verify-email/:token',getTokenEmailVerification)


export default route