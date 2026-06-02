import { Link, useLocation } from 'react-router-dom'
import { routes } from '../../routes'

const Sidebar = ({ isSidebarOpen }) => {
    const location = useLocation()

    return (
        <div
            className="h-full flex flex-col bg-gradient-to-b from-slate-950 to-indigo-950 overflow-hidden transition-all duration-300"
            style={{ width: '100%' }}
        >
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
                {routes.map((route) => {
                    if (!route.isSidebarPage) return null
                    const active = location.pathname === route.to

                    return (
                        <Link
                            to={route.to}
                            key={route.to}
                            className={`
                flex items-center rounded-xl transition-all duration-200 group relative
                ${isSidebarOpen ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'}
                ${active
                                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-900/40'
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                                }
              `}
                        >
                            <span
                                className={`text-xl shrink-0 transition-all duration-200 ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                                    }`}
                            >
                                {route.icon}
                            </span>

                            {isSidebarOpen && (
                                <span className="ml-3 text-sm font-medium truncate">{route.label}</span>
                            )}

                            {active && isSidebarOpen && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                            )}

                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                                    {route.label}
                                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>

            <div className="px-3 py-4 border-t border-white/5">
                <div
                    className={`flex items-center rounded-lg p-2 ${isSidebarOpen ? '' : 'justify-center'
                        }`}
                >
                    {/* GÜNCELLENEN KISIM: Avatar harfi 'T' yapýldý */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">T</span>
                    </div>
                    {isSidebarOpen && (
                        <div className="ml-2.5 min-w-0">
                            {/* GÜNCELLENEN KISIM: Marka adý ThermaSense yapýldý */}
                            <p className="text-xs font-semibold text-white/90 truncate">ThermaSense</p>
                            <p className="text-xs text-slate-500 truncate">Admin Panel</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar