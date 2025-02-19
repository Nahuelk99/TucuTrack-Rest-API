import { Router } from "express";
import { getCompanies, getCities } from "../controllers/commonControllers.js";
import { getTravelTypes, getPrices } from "../controllers/pricesControllers.js";

const router = Router();

router.get("/companies", getCompanies);
router.get("/cities", getCities);
router.get("/travel-types", getTravelTypes);
router.get("/prices", getPrices);

export default router;
