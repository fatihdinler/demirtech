import { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsSidebarOpen } from '../../features/sidebar/sidebar.state'

const useLayout = () => {
  const dispatch = useDispatch()
  const { isSidebarOpen } = useSelector((state) => state.sidebar)

  const toggleSidebar = useCallback(() => {
    dispatch(setIsSidebarOpen(!isSidebarOpen))
  }, [dispatch, isSidebarOpen])

  return useMemo(() => ({
    isSidebarOpen,
    toggleSidebar,
  }), [isSidebarOpen, toggleSidebar])
}

export default useLayout