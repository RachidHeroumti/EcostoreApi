
import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/userRouter.js'
import orderRouter from './routes/orderRouter.js'
import productRouter from './routes/productRouter.js'
import mediaRouter from './routes/mediaRoute.js'
import sectionRouter from './routes/sectionRouter.js'
import connectDB from './config/db.js'
import generalRoute from './routes/generaRoute.js'
import shippingRoute from './routes/shippingRoute.js'
import subscriptionRoute from './routes/subscriptionRoute.js'
import webpush from "web-push";
dotenv.config();
const app=express();
 
const PORT=process.env.PORT||5001 ;

app.use(express.json());
app.use(cors({ origin: '*' }));


connectDB();

app.use('/api/users',userRouter)
app.use('/api/products',productRouter)
app.use('/api/orders',orderRouter)
app.use('/api/media',mediaRouter)
app.use('/api/sections',sectionRouter)
app.use('/api',generalRoute)
app.use('/api/shipping',shippingRoute)
app.use('/api',subscriptionRoute)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

//app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));

const VAPID_PUBLIC_KEY = "BFTbUxtdSUUeGXI83bBqKAgsT06nP6IQjdxSA6oaznE6d5UOAKLmNCbW0qVE2g5rz7DUNuYnEqaOqi6ihSbwLdc";
const VAPID_PRIVATE_KEY = "qyhvuTxIn-yBSuw_jHJoy_VVxXVT1L8nZ_WSM_0rWPY";

webpush.setVapidDetails(
  "mailto:shopino.hero@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);




app.listen(PORT,()=>{
    console.log("listening to the port :",PORT);
  })
