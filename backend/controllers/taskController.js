const Task = require('../models/Task');
const { ErrorHandler } = require('../utils/errorHandler');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return next(new ErrorHandler('Please provide a title', 400));
    }

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      createdBy: req.user._id,
    });

    await task.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, sortBy = '-createdAt' } = req.query;

    const filter = {};

    if (req.user.role === 'user') {
      filter.createdBy = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .populate('createdBy', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email');

    if (!task) {
      return next(new ErrorHandler('Task not found', 404));
    }

    if (req.user.role === 'user' && task.createdBy._id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler('Not authorized to view this task', 403));
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Task
 * PUT /api/v1/tasks/:id
 */
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ErrorHandler('Task not found', 404));
    }

    // Check authorization
    if (req.user.role === 'user' && task.createdBy.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler('Not authorized to update this task', 403));
    }

    // Update fields
    const { title, description, status, priority } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;

    await task.save();

    // Populate user details
    await task.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Task
 * DELETE /api/v1/tasks/:id
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ErrorHandler('Task not found', 404));
    }

    // Check authorization
    if (req.user.role === 'user' && task.createdBy.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler('Not authorized to delete this task', 403));
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get User Statistics (Admin Only)
 * GET /api/v1/tasks/stats/overview
 */
exports.getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
          },
        },
      },
    ]);

    const tasksPerUser = await Task.aggregate([
      {
        $group: {
          _id: '$createdBy',
          taskCount: { $sum: 1 },
        },
      },
      { $sort: { taskCount: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          taskCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {
          totalTasks: 0,
          completedTasks: 0,
          pendingTasks: 0,
          inProgressTasks: 0,
        },
        tasksPerUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
