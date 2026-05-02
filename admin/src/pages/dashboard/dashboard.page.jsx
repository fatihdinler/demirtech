import useDashboard from './dashboard.hook'
import DashboardCustomerSelection from './dashboard-customer.page'
import DashboardDeviceSelection from './dashboard-device.page'
import DeviceForecast from './components/device-forecast.component'

const Dashboard = () => {
  const {
    step,
    selectedCustomer,
    selectedDevice,
    handleCustomerSelect,
    handleBackToCustomer,
    handleDeviceSelect,
    handleBackToDevices,
  } = useDashboard()

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      {step === 1 && (
        <DashboardCustomerSelection onCustomerSelect={handleCustomerSelect} />
      )}
      {step === 2 && selectedCustomer && (
        <DashboardDeviceSelection
          selectedCustomer={selectedCustomer}
          onBackToCustomer={handleBackToCustomer}
          onDeviceSelect={handleDeviceSelect}
        />
      )}
      {step === 3 && selectedDevice && (
        <DeviceForecast
          device={selectedDevice}
          onBack={handleBackToDevices}
        />
      )}
    </div>
  )
}

export default Dashboard
