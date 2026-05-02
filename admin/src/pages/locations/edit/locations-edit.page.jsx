import Select from 'react-select'
import { Breadcrumb, PageFooter } from '../../../components'
import useLocationsEdit from './locations-edit.hook'

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5"

const LocationsEdit = () => {
  const {
    name, description, branchId, onChange, branchesOptions, handleBranchesChange,
    customerId, customersOptions, handleCustomersChange, clearPageHandler, editLocation,
  } = useLocationsEdit()

  return (
    <div>
      <Breadcrumb paths={[{ label: 'Lokasyonlar', link: '/locations' }, { label: 'Düzenle' }]} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-3xl">
        <div className="space-y-5">
          <div>
            <label className={labelCls}>Ad</label>
            <input type="text" placeholder="Lokasyon adını girin" value={name} onChange={(e) => onChange(e, 'name')} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Müşteri</label>
              <Select options={customersOptions} value={customersOptions?.find(o => o.value === customerId)} onChange={handleCustomersChange} placeholder="Müşteri seçin" classNamePrefix="rs" />
            </div>
            <div>
              <label className={labelCls}>Şube</label>
              <Select options={branchesOptions} value={branchesOptions?.find(o => o.value === branchId)} onChange={handleBranchesChange} placeholder="Şube seçin" isDisabled={!customerId} classNamePrefix="rs" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Açıklama</label>
            <textarea rows={3} placeholder="Lokasyon açıklamasını girin" value={description} onChange={(e) => onChange(e, 'description')} className={`${inputCls} resize-none`} />
          </div>
        </div>
        <PageFooter createOrEditHandler={editLocation} cancelHander={clearPageHandler} />
      </div>
    </div>
  )
}

export default LocationsEdit
