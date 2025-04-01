import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useUsersCreate from './users-create.hook'

const UsersCreate = () => {
  const {
    branchId,
    branchesOptions,
    clearPageHandler,
    createUser,
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
  } = useUsersCreate()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Kullanıcılar', link: '/users' },
          { label: 'Oluştur' }
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
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='userPassword'>
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type='password'
                placeholder='Şifreyi girin'
                value={password}
                onChange={(e) => onChange(e, 'password')}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
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
              />
            </Form.Group>
          </Col>
        </Row>

        <PageFooter
          isCreatePage
          createOrEditHandler={createUser}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default UsersCreate
