import {Router} from "express";
import StandardController from "../controllers/StandardsController.js";

const router = new Router()

router.post('/standard', StandardController.createStandard)
router.get('/standard', StandardController.getStandards)
router.delete('/standard/:id', StandardController.deleteStandard)




export default router