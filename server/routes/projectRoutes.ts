import express from 'express';

import { deleteProject, getProjectById, getProjectPreview, getPublishedProjects } from '../controllers/projectController';

const projectRouter = express.Router();
import { protect } from '../middlewares/auth';
import { makeRevision, rollbackToVersion, saveProjectCode } from '../controllers/projectController';
projectRouter.post('/revision/:projectId', protect, makeRevision)
projectRouter.put('/save/:projectId', protect, saveProjectCode)
projectRouter.post('/rollback/:projectId', protect, rollbackToVersion)
projectRouter.delete('/:projectId', protect, deleteProject)
projectRouter.get('/preview/:projectId', protect, getProjectPreview)
projectRouter.get('/published', getPublishedProjects)
projectRouter.get('/published/:projectId', getProjectById)

module.exports = projectRouter

