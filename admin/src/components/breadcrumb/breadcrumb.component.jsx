import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'

const Breadcrumb = ({ paths }) => {
  return (
    <nav className="flex items-center gap-1.5 mb-4">
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && <FaChevronRight size={10} className="text-slate-300" />}
            {isLast ? (
              <span className="text-sm font-semibold text-slate-800">{path.label}</span>
            ) : (
              <Link
                to={path.link}
                className="text-sm font-medium text-indigo-500 hover:text-indigo-700 transition-colors duration-150"
              >
                {path.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
