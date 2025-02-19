import { Router } from "express";
import { getStops, getStop } from "../controllers/stopsControllers.js";

const router = Router();

router.get("/stops", getStops);

router.get("/stops/:IdParada", getStop);

export default router;
