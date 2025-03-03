import React, { useState } from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import useDashboard from './dashboard.hook';
import { Card } from '../../components'

const Dashboard = () => {
  const {
    customers,
    isCustomersLoading,
    errorCustomers,
    branches,
    isBranchesLoading,
    errorBranches,
    climates,
    isClimatesLoading,
    errorClimates,
    devices,
    isDevicesLoading,
    errorDevices,
  } = useDashboard();

  // Seçim adımları için state yönetimi
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedClimate, setSelectedClimate] = useState(null);
  // step: 1 = Müşteri, 2 = Şube, 3 = Klima, 4 = Cihaz (örnek gösterim)
  const [step, setStep] = useState(1);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setStep(2);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setStep(3);
  };

  const handleClimateSelect = (climate) => {
    setSelectedClimate(climate);
    setStep(4);
  };

  // Breadcrumb üzerinden önceki adıma dönmeyi sağlar
  const handleBreadcrumbClick = (targetStep) => {
    setStep(targetStep);
    if (targetStep < 2) {
      setSelectedCustomer(null);
      setSelectedBranch(null);
      setSelectedClimate(null);
    } else if (targetStep < 3) {
      setSelectedBranch(null);
      setSelectedClimate(null);
    } else if (targetStep < 4) {
      setSelectedClimate(null);
    }
  };

  const renderBreadcrumbs = () => (
    <Breadcrumb>
      <Breadcrumb.Item active={step === 1} onClick={() => handleBreadcrumbClick(1)}>
        Müşteriler
      </Breadcrumb.Item>
      {selectedCustomer && (
        <Breadcrumb.Item active={step === 2} onClick={() => handleBreadcrumbClick(2)}>
          {selectedCustomer.name}
        </Breadcrumb.Item>
      )}
      {selectedBranch && (
        <Breadcrumb.Item active={step === 3} onClick={() => handleBreadcrumbClick(3)}>
          {selectedBranch.name}
        </Breadcrumb.Item>
      )}
      {selectedClimate && (
        <Breadcrumb.Item active={step === 4}>
          {selectedClimate.name}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );

  // Müşteri seçim ekranı
  const renderCustomerSelection = () => {
    if (isCustomersLoading) return <div>Müşteriler yükleniyor...</div>;
    if (errorCustomers) return <div>Hata: {errorCustomers.message}</div>;

    return (
      <Row>
        {customers.map((customer) => (
          <Col key={customer.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card
              title={customer.name}
              description={customer.description || 'Açıklama bulunamadı'}
              onClick={() => handleCustomerSelect(customer)}
              hoverable
            />
          </Col>
        ))}
      </Row>
    );
  };

  // Şube seçim ekranı, seçilen müşteriye göre filtrelenir
  const renderBranchSelection = () => {
    if (isBranchesLoading) return <div>Şubeler yükleniyor...</div>;
    if (errorBranches) return <div>Hata: {errorBranches.message}</div>;

    const filteredBranches = branches.filter(branch => branch.customerId === selectedCustomer.id);

    return (
      <Row>
        {filteredBranches.map((branch) => (
          <Col key={branch.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card
              title={branch.name}
              description={branch.address || 'Adres bilgisi bulunamadı'}
              onClick={() => handleBranchSelect(branch)}
              hoverable
            />
          </Col>
        ))}
      </Row>
    );
  };

  // Klima seçim ekranı, seçilen şubeye göre filtrelenir
  const renderClimateSelection = () => {
    if (isClimatesLoading) return <div>Klimalar yükleniyor...</div>;
    if (errorClimates) return <div>Hata: {errorClimates.message}</div>;

    const filteredClimates = climates.filter(climate => climate.branchId === selectedBranch.id);

    return (
      <Row>
        {filteredClimates.map((climate) => (
          <Col key={climate.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card
              title={climate.name}
              description={climate.description || 'Açıklama bulunamadı'}
              onClick={() => handleClimateSelect(climate)}
              hoverable
            />
          </Col>
        ))}
      </Row>
    );
  };

  // Klima seçildikten sonra, seçilen klimanın cihazlarını gösteren ekran (opsiyonel)
  const renderDevices = () => {
    if (isDevicesLoading) return <div>Cihazlar yükleniyor...</div>;
    if (errorDevices) return <div>Hata: {errorDevices.message}</div>;

    const filteredDevices = devices.filter(device => device.climateId === selectedClimate.id);

    return (
      <Row>
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => (
            <Col key={device.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                title={device.name}
                description={device.description || 'Açıklama bulunamadı'}
                extraContent={
                  <>
                    <div>Chip ID: {device.chipId}</div>
                    <div>MQTT Topic: {device.mqttTopic}</div>
                  </>
                }
                hoverable={false}
              />
            </Col>
          ))
        ) : (
          <Col>
            <div>Seçilen klima için cihaz bulunamadı.</div>
          </Col>
        )}
      </Row>
    );
  };

  return (
    <Container fluid className="py-4" style={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}>
      <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
        Dashboard
      </h1>
      {renderBreadcrumbs()}
      {step === 1 && renderCustomerSelection()}
      {step === 2 && renderBranchSelection()}
      {step === 3 && renderClimateSelection()}
      {step === 4 && renderDevices()}
    </Container>
  );
};

export default Dashboard;
