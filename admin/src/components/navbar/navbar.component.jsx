import { useState, useRef, useEffect } from 'react'
import {
    FaBell,
    FaUserCircle,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationTriangle,
    FaExclamationCircle,
    FaChartLine,
    FaBolt,
    FaCheckDouble,
    FaThermometerHalf,
    FaTint,
    FaInfoCircle,
} from 'react-icons/fa'
// YENİ EKLENEN: ThermaSense logosu importu
import ThermasenseLogo from '../../assets/thermasense-logo.png'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/auth.api'
import { markNotificationRead, markAllNotificationsRead } from '../../features/notifications/notifications.api'
import useNotificationSocket from '../../hooks/notification-socket.hook'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

const severityConfig = {
    critical: {
        icon: FaExclamationCircle,
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },
    warning: {
        icon: FaExclamationTriangle,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },
}

const typeIcons = {
    threshold_exceeded: FaThermometerHalf,
    prediction_alert: FaChartLine,
    anomaly_detected: FaBolt,
}

const formatTimeAgo = (dateStr) => {
    try {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr })
    } catch {
        return ''
    }
}

const NotificationItem = ({ notification, onRead }) => {
    const severity = severityConfig[notification.severity] || severityConfig.warning
    const TypeIcon = typeIcons[notification.type] || FaBell
    const isTemp = notification.measurementType?.toUpperCase() === 'TEMPERATURE'

    return (
        <button
            onClick={() => !notification.isRead && onRead(notification.id)}
            className={`
        w-full text-left px-4 py-3 flex gap-3 transition-colors duration-150
        ${notification.isRead ? 'bg-white' : severity.bg}
        hover:bg-slate-50 border-b border-slate-100 last:border-b-0
      `}
        >
            <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-slate-100' : severity.bg} ${notification.isRead ? 'border-slate-200' : severity.border} border`}>
                <TypeIcon size={13} className={notification.isRead ? 'text-slate-400' : severity.color} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`text-xs font-bold truncate ${notification.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                        {notification.title}
                    </p>
                    {!notification.isRead && (
                        <span className={`shrink-0 w-2 h-2 rounded-full ${severity.dot}`} />
                    )}
                </div>
                <p className={`text-[11px] mt-0.5 line-clamp-2 ${notification.isRead ? 'text-slate-400' : 'text-slate-600'}`}>
                    {notification.message}
                </p>
                {notification.cause?.title && (
                    <div className={`flex items-start gap-1.5 mt-1.5 px-2 py-1.5 rounded-md ${notification.isRead ? 'bg-slate-50' : 'bg-indigo-50/70'}`}>
                        <FaInfoCircle size={10} className={`shrink-0 mt-0.5 ${notification.isRead ? 'text-slate-400' : 'text-indigo-500'}`} />
                        <div className="min-w-0">
                            <p className={`text-[10px] font-semibold leading-tight ${notification.isRead ? 'text-slate-500' : 'text-indigo-700'}`}>
                                {notification.cause.title}
                            </p>
                            {notification.cause.description && (
                                <p className={`text-[9px] mt-0.5 line-clamp-2 leading-snug ${notification.isRead ? 'text-slate-400' : 'text-indigo-600/70'}`}>
                                    {notification.cause.description}
                                </p>
                            )}
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        {isTemp ? <FaThermometerHalf size={9} /> : <FaTint size={9} />}
                        {notification.deviceName}
                    </span>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400">{formatTimeAgo(notification.createdAt)}</span>
                </div>
            </div>
        </button>
    )
}

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth.api)
    const { items: notifications, unreadCount } = useSelector((state) => state.notifications)

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const dropdownRef = useRef(null)
    const notifRef = useRef(null)

    useNotificationSocket()

    const logoutFromApplication = () => {
        dispatch(logout())
        navigate('/login')
    }

    const handleMarkRead = (id) => {
        dispatch(markNotificationRead(id))
    }

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead())
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="h-full px-4 flex items-center justify-between">
            <button
                onClick={toggleSidebar}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
            >
                {isSidebarOpen ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
            </button>

            {/* GÜNCELLENEN KISIM: Logo kaynağı ve alt metni ThermaSense yapıldı */}
            <img
                src={ThermasenseLogo}
                alt="ThermaSense"
                className="absolute left-1/2 -translate-x-1/2 h-9 object-contain"
            />

            <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setNotifOpen(o => !o)}
                        className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                    >
                        <FaBell size={17} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white px-1">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 animate-fadeSlideIn overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-slate-800">Bildirimler</h3>
                                    {unreadCount > 0 && (
                                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-full">
                                            {unreadCount} yeni
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="flex items-center gap-1 text-[11px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
                                    >
                                        <FaCheckDouble size={10} />
                                        Tümünü oku
                                    </button>
                                )}
                            </div>

                            {/* Notification List */}
                            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                                        <FaBell size={24} className="text-slate-300" />
                                        <p className="text-xs font-medium">Henüz bildirim yok</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <NotificationItem
                                            key={n.id || n._id}
                                            notification={n}
                                            onRead={handleMarkRead}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                    >
                        <FaUserCircle size={26} className="text-slate-400" />
                        <span className="hidden sm:block text-sm font-medium text-slate-700">
                            {user?.name} {user?.surname}
                        </span>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fadeSlideIn">
                            <button
                                onClick={logoutFromApplication}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                            >
                                <FaSignOutAlt size={14} className="text-red-400" />
                                Çıkış Yap
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar