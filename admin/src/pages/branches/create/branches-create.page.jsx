import React from 'react'
import { Form, Container, Row, Col } from 'react-bootstrap'
import { Breadcrumb, PageFooter } from '../../../components'
import Select from 'react-select'
import useBranchesCreate from './branches-create.hook'

const BranchesCreate = () => {
  const {
    name,
    onChange,
    address,
    contactInfo,
    customerId,
    createBranch,
    clearPageHandler,
    customersOptions,
    handleCustomersChange,
    userIds,
    usersOptions,
    handleUsersChange,
  } = useBranchesCreate()

  return (
    <Container fluid>
      <Breadcrumb
        paths={[
          { label: 'Şubeler', link: '/branches' },
          { label: 'Oluştur' }
        ]}
      />
      <div className='page-background'>
        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='branchName'>
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type='text'
                placeholder='Şube adını girin'
                value={name}
                onChange={(e) => onChange(e, 'name')}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='branchContactInfo'>
              <Form.Label>İletişim Bilgisi</Form.Label>
              <Form.Control
                rows={3}
                placeholder='Şube için iletişim bilgisi girin'
                value={contactInfo}
                onChange={(e) => onChange(e, 'contactInfo')}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col md={6}>
            <Form.Group controlId='branchCustomer'>
              <Form.Label>Müşteri</Form.Label>
              <Select
                options={customersOptions}
                value={customersOptions.find(opt => opt.value === customerId)}
                onChange={handleCustomersChange}
                placeholder="Müşteri seçin"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='branchUserIds'>
              <Form.Label>Sorumlu Kullanıcılar</Form.Label>
              <Select
                isMulti
                options={usersOptions}
                value={usersOptions.filter(opt => userIds?.includes(opt.value))}
                onChange={handleUsersChange}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                placeholder="Kullanıcı(lar) seçin"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col>
            <Form.Group controlId='branchAddress'>
              <Form.Label>Adres</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Şube adresi girin'
                value={address}
                onChange={(e) => onChange(e, 'address')}
              />
            </Form.Group>
          </Col>
        </Row>

        <PageFooter
          isCreatePage
          createOrEditHandler={createBranch}
          cancelHander={clearPageHandler}
        />
      </div>
    </Container>
  )
}

export default BranchesCreate
