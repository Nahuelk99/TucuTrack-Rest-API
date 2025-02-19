import { Router } from "express";
import {
  getSchedules,
  getServiceTypesByCompanies,
  getScheduleTypesByCompanies,
} from "../controllers/schedulesControllers.js";
import { getCompanies, getCities } from "../controllers/commonControllers.js";

const router = Router();

router.get("/schedules", getSchedules);
router.get("/companies", getCompanies);
router.get("/cities", getCities);
router.get("/service-types/:idEmpresa", getServiceTypesByCompanies);
router.get("/schedules-types/:idEmpresa", getScheduleTypesByCompanies);

export default router;
