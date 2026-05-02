import Select from 'react-select'
import { Breadcrumb, PageFooter } from '../../../components'
import useBranchesCreate from './branches-create.hook'

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5"

const BranchesCreate = () => {
  const {
    name, onChange, address, contactInfo, customerId, createBranch, clearPageHandler,
    customersOptions, handleCustomersChange, userIds, usersOptions, handleUsersChange,
  } = useBranchesCreate()

  return (
    <div>
      <Breadcrumb paths={[{ label: 'Şubeler', link: '/branches' }, { label: 'Oluştur' }]} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Ad</label>
            <input type="text" placeholder="Şube adını girin" value={name} onChange={(e) => onChange(e, 'name')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>İletişim Bilgisi</label>
            <input type="text" placeholder="İletişim bilgisi girin" value={contactInfo} onChange={(e) => onChange(e, 'contactInfo')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Müşteri</label>
            <Select options={customersOptions} value={customersOptions.find(o => o.value === customerId)} onChange={handleCustomersChange} placeholder="Müşteri seçin" classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Sorumlu Kullanıcılar</label>
            <Select isMulti options={usersOptions} value={usersOptions.filter(o => userIds?.includes(o.value))} onChange={handleUsersChange} closeMenuOnSelect={false} hideSelectedOptions={false} placeholder="Kullanıcı(lar) seçin" classNamePrefix="rs" />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Adres</label>
            <textarea rows={3} placeholder="Şube adresi girin" value={address} onChange={(e) => onChange(e, 'address')} className={`${inputCls} resize-none`} />
          </div>
        </div>
        <PageFooter isCreatePage createOrEditHandler={createBranch} cancelHander={clearPageHandler} />
      </div>
    </div>
  )
}

export default BranchesCreate
