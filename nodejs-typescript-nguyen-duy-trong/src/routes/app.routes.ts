import { Router } from "express";
import hotelRouter from "./hotel.routes.js";

const appRouter: Router = Router();

appRouter.use('/hotels', hotelRouter);

export default appRouter;