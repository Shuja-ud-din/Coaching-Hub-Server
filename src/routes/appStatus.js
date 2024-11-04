import express from 'express';
import { checkStatus, toggleStatus } from '../controller/appStatus.controller.js';

const appStatusRoutes = express.Router();

appStatusRoutes.put('/toggle-status', toggleStatus);

appStatusRoutes.get('/status', checkStatus);

export default appStatusRoutes;
