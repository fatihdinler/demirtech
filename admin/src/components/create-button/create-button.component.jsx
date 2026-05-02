import { FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const CreateButton = ({ link }) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(link)}
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-200"
    >
      <FaPlus size={12} />
      Oluştur
    </button>
  )
}

export default CreateButton
