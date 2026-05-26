import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { addRealtimeNotification } from '../features/notifications/notifications.slice'
import { fetchNotifications } from '../features/notifications/notifications.api'

const SOCKET_SERVER_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:3000'

function useNotificationSocket() {
  const dispatch = useDispatch()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    dispatch(fetchNotifications({ page: 1, limit: 30 }))

    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] })

    socket.on('notification', (notification) => {
      dispatch(addRealtimeNotification(notification))
    })

    return () => {
      socket.disconnect()
      initialized.current = false
    }
  }, [dispatch])
}

export default useNotificationSocket
