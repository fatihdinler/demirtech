const Card = ({ title, description, extraContent, onClick, hoverable = false }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl p-6 border border-slate-100 shadow-sm
        transition-all duration-300 select-none
        ${hoverable && onClick ? 'cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-200' : ''}
      `}
    >
      <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{description}</p>
      )}
      {extraContent && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-400">
          {extraContent}
        </div>
      )}
    </div>
  )
}

export default Card
