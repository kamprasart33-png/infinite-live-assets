import { Router, type IRouter } from "express";
import healthRouter from "./health";
import metricsRouter from "./metrics";
import tracksRouter from "./tracks";
import customersRouter from "./customers";
import transactionsRouter from "./transactions";
import astraRouter from "./astra";
import checkoutRouter from "./checkout";
import storeRouter from "./store";

const router: IRouter = Router();

router.use(healthRouter);
router.use(metricsRouter);
router.use(tracksRouter);
router.use(customersRouter);
router.use(transactionsRouter);
router.use(astraRouter);
router.use(checkoutRouter);
router.use(storeRouter);

export default router;
