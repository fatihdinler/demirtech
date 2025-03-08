// src/pages/dashboard/dashboard.page.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import useDashboard from './dashboard.hook';
import useRealtimeDeviceData from '../../hooks/socket.hook';
import { Card } from '../../components';

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

  // Realtime verileri almak için hook'u kullanıyoruz.
  const realtimeDataMap = useRealtimeDeviceData();

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

  // Yardımcı fonksiyon: Realtime veriyi stilize şekilde gösterir.
  const renderRealtimeData = (realtime) => {
    if (!realtime) return null;
    let unit = '';
    let color = '#000';
    const type = realtime.type.toLowerCase();
    if (type === 'temperature') {
      unit = '°C';
      color = '#e74c3c'; // kırmızı
    } else if (type === 'humidity') {
      unit = '%';
      color = '#3498db'; // mavi
    } else if (type === 'current') {
      unit = 'A';
      color = '#27ae60'; // yeşil
    }
    return (
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: color }}>
          {realtime.value}{unit}
        </div>
        <div style={{ fontSize: '1rem', color: '#6b7280' }}>
          {type.toUpperCase()}
        </div>
      </div>
    );
  };

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

  // renderDevices fonksiyonunun güncellenmiş hali:
  const renderDevices = () => {
    if (isDevicesLoading) return <div>Cihazlar yükleniyor...</div>;
    if (errorDevices) return <div>Hata: {errorDevices.message}</div>;

    const filteredDevices = devices.filter(device => device.climateId === selectedClimate.id);

    return (
      <Row>
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => {
            const realtime = realtimeDataMap[device.id];
            return (
              <Col key={device.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card
                  title={device.name}
                  description={device.description || 'Açıklama bulunamadı'}
                  extraContent={
                    <div style={{
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f1f5f9',
                      borderRadius: '0.5rem',
                      marginTop: '1rem'
                    }}>
                      {realtime ? (
                        <div style={{
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          color: realtime.type.toLowerCase() === 'temperature' ? '#e74c3c'
                            : realtime.type.toLowerCase() === 'humidity' ? '#3498db'
                              : '#27ae60'
                        }}>
                          {realtime.value?.toFixed(1)}
                          {realtime.type.toLowerCase() === 'temperature' ? '°C'
                            : realtime.type.toLowerCase() === 'humidity' ? '%'
                              : 'A'}
                        </div>
                      ) : (
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: 'normal',
                          color: '#9ca3af'
                        }}>
                          No Data
                        </div>
                      )}
                    </div>
                  }
                  hoverable={false}
                />
              </Col>
            );
          })
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
