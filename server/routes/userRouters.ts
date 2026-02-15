import express from 'express';
import { createUserProject ,getUserCredits, getUserProject, getUserProjects, purchaseCredits,togglePublish } from '../controllers/userController';
import { protect } from '../middlewares/auth';


const userRouter = express.Router();    

userRouter.get('/credits', protect, getUserCredits);
userRouter.post('/project', protect, createUserProject);
userRouter.get('/project/:projectId', protect, getUserProject);
userRouter.get('/projects', protect, getUserProjects);
userRouter.post('/project-toggle/:projectId', protect, togglePublish);
userRouter.post('/purchase-credits', protect, purchaseCredits); 
module.exports = userRouter;