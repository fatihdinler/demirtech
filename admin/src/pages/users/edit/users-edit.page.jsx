import Select from 'react-select'
import { Breadcrumb, PageFooter } from '../../../components'
import useUsersEdit from './users-edit.hook'

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-50 disabled:text-slate-400"
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5"

const UsersEdit = () => {
  const {
    branchId, branchesOptions, clearPageHandler, editUser, customerId, customersOptions,
    email, handleBranchesChange, handleCustomersChange, handleRolesChange, name, onChange,
    role, roleOptions, surname, username,
  } = useUsersEdit()

  return (
    <div>
      <Breadcrumb paths={[{ label: 'Kullanıcılar', link: '/users' }, { label: 'Düzenle' }]} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Ad</label>
            <input type="text" placeholder="Adı girin" value={name} onChange={(e) => onChange(e, 'name')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Soyad</label>
            <input type="text" placeholder="Soyadı girin" value={surname} onChange={(e) => onChange(e, 'surname')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Kullanıcı Adı (Otomatik)</label>
            <input type="text" value={username} disabled className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>E-Posta</label>
            <input type="email" value={email} disabled className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Rol</label>
            <Select options={roleOptions} value={roleOptions?.find(o => o.value === role)} onChange={handleRolesChange} placeholder="Rol seçin" classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Müşteri</label>
            <Select options={customersOptions} value={customersOptions?.find(o => o.value === customerId)} onChange={handleCustomersChange} placeholder="Müşteri seçin" isClearable classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Şube</label>
            <Select options={branchesOptions} value={branchesOptions?.find(o => o.value === branchId)} onChange={handleBranchesChange} placeholder={!customerId ? 'Lütfen önce müşteri seçin' : 'Şube seçin'} isDisabled={!customerId} isClearable classNamePrefix="rs" />
          </div>
        </div>
        <PageFooter createOrEditHandler={editUser} cancelHander={clearPageHandler} />
      </div>
    </div>
  )
}

export default UsersEdit
