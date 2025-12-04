import express from 'express';
import { recommendDoctor } from '../controllers/AIModuleController.js'; // Import the controller

const router = express.Router();

// Define the route for doctor recommendations
router.post("/recommend-doctor", recommendDoctor);

export default router;
