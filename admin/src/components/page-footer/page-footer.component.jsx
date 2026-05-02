const PageFooter = ({ isCreatePage, createOrEditHandler, cancelHander }) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
      <button
        onClick={cancelHander}
        className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
      >
        İptal
      </button>
      <button
        onClick={createOrEditHandler}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        {isCreatePage ? 'Oluştur' : 'Kaydet'}
      </button>
    </div>
  )
}

export default PageFooter
