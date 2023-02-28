import {Router} from "express";
import CourseController from "../controllers/CourseController.js";

const router = new Router()

router.post('/course', CourseController.createCourse)
router.get('/course', CourseController.getCourses)
router.get('/course/:id', CourseController.getOneCourse)
router.put('/course/:id', CourseController.updateCourse)
router.delete('/course/:id', CourseController.deleteCourse)

router.get('/course/:id/user', CourseController.getUsersCourse)
router.put('/course/:id/user', CourseController.updateUsersCourse)



export default router