import { Router } from "express";
import * as ProductController from "../controllers/product.controller";
import { is } from "../middlewares/ensureAdmin";
const route = Router();

route.post('/', is(['ADMIN']), ProductController.addProduct);
route.get('/', ProductController.listProducts);
route.get('/:id', ProductController.getProduct);
route.put('/:id', is(['ADMIN']), ProductController.updateProduct);
route.delete('/:id', is(['ADMIN']), ProductController.removeProduct);

export default route;