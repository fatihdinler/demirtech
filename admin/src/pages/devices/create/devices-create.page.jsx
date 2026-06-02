import Select from 'react-select'
import { Breadcrumb, PageFooter } from '../../../components'
import useDevicesCreate from './devices-create.hook'

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-50 disabled:text-slate-400"
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5"

const DevicesCreate = () => {
  const {
    name, description, chipId, locationId, deviceType, measurementType, onChange,
    locationsOptions, handleLocationsChange, clearPageHandler, createDevice,
    deviceTypesOptions, handleDeviceTypesChange, deviceMeasurementTypesOptions, handleDeviceMeasurementTypesChange,
    customersOptions, handleCustomersChange, branchesOptions, handleBranchesChange,
    customerId, branchId, isActive, minValue, maxValue,
    environment, cooling, defrostCycle, frequentAccess, handleEnvironmentChange,
  } = useDevicesCreate()

  const environmentOptions = [
    { value: 'sealed', label: 'Kapalı Alan (Soğuk oda, depo, reyon)' },
    { value: 'semi-open', label: 'Yarı Açık Alan (Yükleme rampası, koridor)' },
    { value: 'controlled', label: 'Kontrollü Ortam (İlaç deposu, laboratuvar)' },
  ]

  return (
    <div>
      <Breadcrumb paths={[{ label: 'Cihazlar', link: '/devices' }, { label: 'Oluştur' }]} />
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
            <Select options={branchesOptions} value={branchesOptions?.find(o => o.value === branchId)} onChange={handleBranchesChange} placeholder={!customerId ? 'Lütfen önce müşteri seçin' : 'Şube seçin'} isDisabled={!customerId} classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Lokasyon</label>
            <Select options={locationsOptions} value={locationsOptions?.find(o => o.value === locationId)} onChange={handleLocationsChange} placeholder={(!customerId || !branchId) ? 'Lütfen müşteri ve şube seçin' : 'Lokasyon seçin'} isDisabled={!customerId || !branchId} classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Donanım Tipi</label>
            <Select options={deviceTypesOptions} value={deviceTypesOptions?.find(o => o.value === deviceType)} onChange={handleDeviceTypesChange} placeholder="Donanım tipi seçin" classNamePrefix="rs" />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Ölçüm Tipi</label>
            <Select options={deviceMeasurementTypesOptions} value={deviceMeasurementTypesOptions?.find(o => o.value === measurementType)} onChange={handleDeviceMeasurementTypesChange} placeholder="Ölçüm tipi seçin" classNamePrefix="rs" />
          </div>
          <div>
            <label className={labelCls}>Minimum Eşik Değeri</label>
            <input type="number" step="0.1" placeholder="Ör: 2" value={minValue} onChange={(e) => onChange(e, 'minValue')} className={inputCls} />
            <p className="text-[11px] text-slate-400 mt-1">Bu değerin altına düşülürse bildirim gönderilir</p>
          </div>
          <div>
            <label className={labelCls}>Maksimum Eşik Değeri</label>
            <input type="number" step="0.1" placeholder="Ör: 35" value={maxValue} onChange={(e) => onChange(e, 'maxValue')} className={inputCls} />
            <p className="text-[11px] text-slate-400 mt-1">Bu değerin üstüne çıkılırsa bildirim gönderilir</p>
          </div>

          <div className="md:col-span-2 border-t border-slate-100 pt-5 mt-1">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Ortam Bilgisi</h3>
            <p className="text-[11px] text-slate-400 mb-4">Cihazın bulunduğu ortam tipi, eşik aşımlarının olası sebebini belirlemek için kullanılır</p>
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Ortam Tipi</label>
            <Select options={environmentOptions} value={environmentOptions.find(o => o.value === environment)} onChange={handleEnvironmentChange} placeholder="Ortam tipi seçin" classNamePrefix="rs" />
          </div>

          <div className="flex flex-col gap-4 md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={!!cooling} onChange={(e) => onChange(e, 'cooling')} />
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${cooling ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${cooling ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Soğutma Sistemi</span>
                <p className="text-[11px] text-slate-400">Aktif kompresör veya soğutma ünitesi var mı</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={!!defrostCycle} onChange={(e) => onChange(e, 'defrostCycle')} />
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${defrostCycle ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${defrostCycle ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Defrost Döngüsü</span>
                <p className="text-[11px] text-slate-400">Periyodik buz çözme döngüsü var mı</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={!!frequentAccess} onChange={(e) => onChange(e, 'frequentAccess')} />
                <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${frequentAccess ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${frequentAccess ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Sık Kapı/Kapak Erişimi</span>
                <p className="text-[11px] text-slate-400">Kapak veya kapı sık açılıp kapatılıyor mu (reyon, yükleme alanı)</p>
              </div>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={!!isActive}
                  onChange={(e) => onChange(e, 'isActive')}
                />
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
        </div>
        <PageFooter isCreatePage createOrEditHandler={createDevice} cancelHander={clearPageHandler} />
      </div>
    </div>
  )
}

export default DevicesCreate
