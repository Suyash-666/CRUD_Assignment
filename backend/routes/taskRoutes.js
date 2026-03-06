const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, taskController.createTask);
router.get('/', authMiddleware, taskController.getAllTasks);
router.get('/:id', authMiddleware, taskController.getTask);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

router.get('/stats/overview', authMiddleware, roleMiddleware('admin'), taskController.getTaskStats);

module.exports = router;
