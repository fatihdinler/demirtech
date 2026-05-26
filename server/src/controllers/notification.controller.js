const asyncHandler = require('express-async-handler')
const { StatusCodes } = require('http-status-codes')
const notificationService = require('../services/notification.service')

const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 30
  const unreadOnly = req.query.unreadOnly === 'true'
  const result = await notificationService.getNotifications({ page, limit, unreadOnly })
  res.status(StatusCodes.OK).json(result)
})

const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params
  const notification = await notificationService.markAsRead(id)
  if (!notification) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Bildirim bulunamadı.' })
    return
  }
  res.status(StatusCodes.OK).json(notification)
})

const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead()
  res.status(StatusCodes.OK).json({ message: 'Tüm bildirimler okundu olarak işaretlendi.' })
})

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount()
  res.status(StatusCodes.OK).json({ count })
})

module.exports = { getNotifications, markAsRead, markAllAsRead, getUnreadCount }
