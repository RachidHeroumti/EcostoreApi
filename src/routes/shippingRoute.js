import express from 'express';
import { 
    createShipping, 
    updateShipping, 
    setDefaultShipping, 
    deleteShipping, 
    getAllShipping, 
    getShippingById 
} from '../controllers/shippingController.js';

const route = express.Router();

route.post('/create', createShipping);
route.get('/', getAllShipping);
route.get('/:id', getShippingById);
route.put('/update/:id', updateShipping);
route.delete('/delete/:id', deleteShipping);
route.put('/set-default/:id', setDefaultShipping);

export default route;
