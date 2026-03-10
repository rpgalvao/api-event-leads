import { Router } from "express";
import * as AuthController from '../controllers/auth.controller';

const route = Router();

route.post('/users', AuthController.registerUser);
route.post('/login', AuthController.loginUser);

export default route;