import { Breadcrumb, PageFooter } from '../../../components'
import useCustomersEdit from './customers-edit.hook'

const CustomersEdit = () => {
  const { name, description, onChange, editCustomer, clearPageHandler } = useCustomersEdit()

  return (
    <div>
      <Breadcrumb paths={[{ label: 'Müşteriler', link: '/customers' }, { label: 'Düzenle' }]} />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ad</label>
            <input
              type="text"
              placeholder="Müşteri adını girin"
              value={name}
              onChange={(e) => onChange(e, 'name')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Açıklama</label>
            <textarea
              rows={4}
              placeholder="Müşteri açıklamasını girin"
              value={description}
              onChange={(e) => onChange(e, 'description')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>
        </div>
        <PageFooter createOrEditHandler={editCustomer} cancelHander={clearPageHandler} />
      </div>
    </div>
  )
}

export default CustomersEdit
