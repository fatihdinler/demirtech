const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/auth.middleware')
const notificationController = require('../controllers/notification.controller')

router.get('/', verifyToken, notificationController.getNotifications)
router.get('/unread-count', verifyToken, notificationController.getUnreadCount)
router.put('/mark-all-read', verifyToken, notificationController.markAllAsRead)
router.put('/:id/read', verifyToken, notificationController.markAsRead)

module.exports = router
