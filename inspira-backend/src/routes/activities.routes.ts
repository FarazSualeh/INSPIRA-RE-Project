import { Router } from 'express';
import { activityController } from '../controllers/activities.controller';

const router = Router();

// Get available activities for a specific grade and subject
router.get('/', activityController.getActivities);

// Create a new activity
router.post('/', activityController.createActivity);

// Update an existing activity
router.patch('/:id', activityController.updateActivity);

// Delete an activity
router.delete('/:id', activityController.deleteActivity);

export default router;