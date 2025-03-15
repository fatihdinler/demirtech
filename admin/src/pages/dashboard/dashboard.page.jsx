import useDashboard from './dashboard.hook'
import DashboardCustomerSelection from './dashboard-customer.page'
import DashboardBranchSelection from './dashboard-branch.page'
import DashboardLocationSelection from './dashboard-location.page'
import DashboardDeviceSelection from './dashboard-device.page'

const Dashboard = () => {
  const {
    step,
    selectedCustomer,
    selectedBranch,
    selectedLocation,
    handleCustomerSelect,
    handleBranchSelect,
    handleLocationSelect,
    handleBackToCustomer,
    handleBackToBranch,
    handleBackToLocation,
  } = useDashboard()

  return (
    <>
      {step === 1 && (
        <DashboardCustomerSelection onCustomerSelect={handleCustomerSelect} />
      )}
      {step === 2 && selectedCustomer && (
        <DashboardBranchSelection
          selectedCustomer={selectedCustomer}
          onBranchSelect={handleBranchSelect}
          onBackToCustomer={handleBackToCustomer}
        />
      )}
      {step === 3 && selectedCustomer && selectedBranch && (
        <DashboardLocationSelection
          selectedCustomer={selectedCustomer}
          selectedBranch={selectedBranch}
          onLocationSelect={handleLocationSelect}
          onBackToBranch={handleBackToBranch}
        />
      )}
      {step === 4 && selectedCustomer && selectedBranch && selectedLocation && (
        <DashboardDeviceSelection
          selectedCustomer={selectedCustomer}
          selectedBranch={selectedBranch}
          selectedLocation={selectedLocation}
          onBackToLocation={handleBackToLocation}
        />
      )}
    </>
  )
}

export default Dashboard
