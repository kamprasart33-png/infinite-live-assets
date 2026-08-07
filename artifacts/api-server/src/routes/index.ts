import { Router, type IRouter } from "express";
import healthRouter from "./health";
import metricsRouter from "./metrics";
import tracksRouter from "./tracks";
import customersRouter from "./customers";
import transactionsRouter from "./transactions";
import astraRouter from "./astra";

const router: IRouter = Router();

router.use(healthRouter);
router.use(metricsRouter);
router.use(tracksRouter);
router.use(customersRouter);
router.use(transactionsRouter);
router.use(astraRouter);

export default router;
