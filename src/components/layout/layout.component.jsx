import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '../../components';
import useLayout from './layout.hook';
import { useDispatch } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { setIsModalOpen } from '../../features/sidebar/sidebar.state';

const Layout = () => {
  const { devices, isSidebarOpen, toggleSidebar } = useLayout();
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen flex bg-gray-50 text-textColor relative">
      <Sidebar
        devices={devices}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4">
          <Outlet context={[devices]} />
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        className="
          fixed bottom-6 right-6 md:bottom-10 md:right-10
          bg-primary text-white w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center
          hover:bg-primary/90 transition-transform transform hover:scale-105
        "
        onClick={() => dispatch(setIsModalOpen(true))}
      >
        <FaPlus className="text-lg" />
      </button>
    </div>
  );
};

export default Layout;
