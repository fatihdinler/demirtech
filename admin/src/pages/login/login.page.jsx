import { useDispatch, useSelector } from 'react-redux'
import { login, clearState } from '../../features/auth/auth.api'
import { setEmail, setPassword } from '../../features/login/login.state'
import DemirtechLogo from '../../assets/demirtek-logo-secondary.png'
import { retrieveErrorMessage } from './login.messager'

const Login = () => {
  const dispatch = useDispatch()
  const { error } = useSelector((state) => state.auth.api)
  const { email, password } = useSelector((state) => state.login)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
    retrieveErrorMessage(error)
    dispatch(clearState())
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 flex-col items-center justify-center p-16 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <img src={DemirtechLogo} alt="Demirtek" className="h-16 mx-auto mb-10 object-contain opacity-90" />
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Cihaz Yönetim<br />Platformu
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Tüm cihazlarınızı tek bir yerden gerçek zamanlı izleyin ve yönetin.
          </p>
          <div className="mt-10 flex items-center gap-4 justify-center">
            {[
              { label: 'Aktif Cihaz', value: '1.2K+' },
              { label: 'Müşteri', value: '48+' },
              { label: 'Çalışma Süresi', value: '99.9%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-5 py-3 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm animate-fadeSlideIn">
          <div className="lg:hidden mb-8 text-center">
            <img src={DemirtechLogo} alt="Demirtek" className="h-12 mx-auto object-contain" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Hoş Geldiniz</h2>
          <p className="text-slate-400 text-sm mb-8">Devam etmek için giriş yapın</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                E-posta
              </label>
              <input
                type="email"
                placeholder="ornek@sirket.com"
                value={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Şifre
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => dispatch(setPassword(e.target.value))}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                Şifremi Unuttum
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
