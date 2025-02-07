import { Card } from '../../components'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { BiDevices } from 'react-icons/bi'
import { Container, Row, Col } from 'react-bootstrap'

const Dashboard = () => {
  return (
    <Container fluid className="py-4">
      <h1
        className="mb-4"
        style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}
      >
        Dashboard
      </h1>

      {/* Kartların grid düzeni: xs=12 (tek sütun), sm=6 (iki sütun) ve lg=3 (dört sütun) */}
      <Row className="mb-4">
        <Col xs={12} sm={6} lg={3}>
          <Card
            title="Toplam Satış"
            value="$21,456"
            icon={<AiOutlineShoppingCart size={30} style={{ color: '#0d6efd' }} />}
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card
            title="Toplam Device"
            value="45"
            icon={<BiDevices size={30} style={{ color: '#0d6efd' }} />}
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card title="Aktif Kullanıcı" value="1200" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card title="Arıza Oranı" value="3.2%" />
        </Col>
      </Row>

      {/* Genel Bakış kartı */}
      <Row>
        <Col>
          <Card title="Genel Bakış">
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Bu ekranda cihazlara dair genel özetleri görebilirsiniz. Grafikler, tablolar vb. eklenecektir.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
