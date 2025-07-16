import express from "express";
import {
  getAllGeneralPlans,
  getAllHealthPlans,
  getGeneralPackagePlans,
  getHealthPackagePlans,
  getGeneralIndividualPlans,
  getHealthIndividualPlans
} from "../controllers/plan.controller.js";

const router = express.Router();

// General Plans
router.get("/general", getAllGeneralPlans);                     
router.get("/general/packages", getGeneralPackagePlans);        
router.get("/general/individuals", getGeneralIndividualPlans);  

// Health Plans
router.get("/health", getAllHealthPlans);                       
router.get("/health/packages", getHealthPackagePlans);          
router.get("/health/individuals", getHealthIndividualPlans);    

export default router;
