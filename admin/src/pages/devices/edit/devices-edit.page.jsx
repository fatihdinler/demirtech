import Select from 'react-select'
import { Breadcrumb, PageFooter } from '../../../components'
import useDevicesEdit from './devices-edit.hook'

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-50 disabled:text-slate-400"
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5"

const DevicesEdit = () => {
  const {
    name, description, chipId, locationId, deviceType, measurementType, mqttTopic, onChange,
    locationsOptions, handleLocationsChange, clearPageHandler, editDevice,
    deviceTypesOptions, handleDeviceTypesChange, deviceMeasurementTypesOptions, handleDeviceMeasurementTypesChange,
    customersOptions, handleCustomersChange, branchesOptions, handleBranchesChange,
    customerId, branchId, isActive,
  } = useDevicesEdit()

  return (
    <div>
      <Breadcrumb paths={[{ label: 'Cihazlar', link: '/devices' }, { label: 'Düzenle' }]} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Ad</label>
            <input type="text" placeholder="Cihaz adını girin" value={name} onChange={(e) => onChange(e, 'name')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Chip ID</label>
            <input type="text" placeholder="Chip ID girin" value={chipId} onChange={(e) => onChange(e, 'chipId')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Müşteri</label>
            <Select options={customersOptions} value={customersOptions?.find(o => o.value === customerId)} onChange={handleCustomersChange} placeholder="Müşteri seçin" classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Şube</label>
            <Select options={branchesOptions} value={branchesOptions?.find(o => o.value === branchId)} onChange={handleBranchesChange} placeholder={!customerId ? 'Lütfen önce müşteri seçin' : 'Şube seçin'} classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Lokasyon</label>
            <Select options={locationsOptions} value={locationsOptions?.find(o => o.value === locationId)} onChange={handleLocationsChange} placeholder={(!customerId || !branchId) ? 'Lütfen müşteri ve şube seçin' : 'Lokasyon seçin'} classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Cihaz Tipi</label>
            <Select options={deviceTypesOptions} value={deviceTypesOptions?.find(o => o.value === deviceType)} onChange={handleDeviceTypesChange} placeholder="Cihaz tipi seçin" classNamePrefix="rs" />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Ölçüm Tipi</label>
            <Select options={deviceMeasurementTypesOptions} value={deviceMeasurementTypesOptions?.find(o => o.value === measurementType)} onChange={handleDeviceMeasurementTypesChange} placeholder="Ölçüm tipi seçin" classNamePrefix="rs" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={!!isActive} onChange={(e) => onChange(e, 'isActive')} />
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${isActive ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">Cihaz Aktif</span>
            </label>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Açıklama</label>
            <textarea rows={3} placeholder="Cihaz açıklamasını girin" value={description} onChange={(e) => onChange(e, 'description')} className={`${inputCls} resize-none`} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>MQTT Topic</label>
            <input type="text" value={mqttTopic} disabled className={inputCls} />
          </div>
        </div>
        <PageFooter createOrEditHandler={editDevice} cancelHander={clearPageHandler} />
      </div>
    </div>
  )
}

export default DevicesEdit
