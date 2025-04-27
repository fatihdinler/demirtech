import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useUsersEdit from './users-edit.hook'

const UsersEdit = () => {
  const {
    branchId,
    branchesOptions,
    clearPageHandler,
    editUser,
    customerId,
    customersOptions,
    email,
    handleBranchesChange,
    handleCustomersChange,
    handleRolesChange,
    name,
    onChange,
    password,
    role,
    roleOptions,
    surname,
    username,
  } = useUsersEdit()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Kullanıcılar', link: '/users' },
          { label: 'Düzenle' }
        ]}
      />
      <div className='page-background'>
        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='userName'>
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type='text'
                placeholder='Kullanıcı adını girin'
                value={name}
                onChange={(e) => onChange(e, 'name')}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='userSurname'>
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type='text'
                placeholder='Kullanıcı soyadını girin'
                value={surname}
                onChange={(e) => onChange(e, 'surname')}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='userUsername'>
              <Form.Label>Kullanıcı Adı (Otomatik: name.surname)</Form.Label>
              <Form.Control
                type='text'
                placeholder='Kullanıcı adı otomatik oluşturulacak'
                value={username}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='userEmail'>
              <Form.Label>E-Posta</Form.Label>
              <Form.Control
                type='email'
                placeholder='E-posta adresini girin'
                value={email}
                onChange={(e) => onChange(e, 'email')}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={12}>
            <Form.Group controlId='userRole'>
              <Form.Label>Rol</Form.Label>
              <Select
                options={roleOptions}
                value={roleOptions ? roleOptions.find(option => option.value === role) : null}
                onChange={handleRolesChange}
                placeholder='Rol seçin'
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='userCustomer'>
              <Form.Label>Müşteri</Form.Label>
              <Select
                options={customersOptions}
                value={customersOptions ? customersOptions.find(option => option.value === customerId) : null}
                onChange={handleCustomersChange}
                placeholder='Müşteri seçin'
                isClearable
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='userBranch'>
              <Form.Label>Şube</Form.Label>
              <Select
                options={branchesOptions}
                value={branchesOptions ? branchesOptions.find(option => option.value === branchId) : null}
                onChange={handleBranchesChange}
                placeholder={!customerId ? 'Lütfen önce müşteri seçin' : 'Şube seçin'}
                isDisabled={!customerId}
                isClearable
              />
            </Form.Group>
          </Col>
        </Row>

        <PageFooter
          createOrEditHandler={editUser}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default UsersEdit
