import React, { useState, useRef } from 'react'
import DemirtechLogo from '../../assets/demirtek-logo.png'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { verifyEmail } from '../../features/auth/auth.api'
import { retrieveErrorMessage } from '../../utils/error'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './verify-email.css'

const VerifyEmail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, error, isLoading, isCheckingAuth } = useSelector(state => state.auth.api)

  const [codes, setCodes] = useState(new Array(6).fill(''))
  const inputsRef = useRef([])

  const handleChange = (e, index) => {
    const value = e.target.value
    if (!/^\d*$/.test(value)) return
    const newCodes = [...codes]
    newCodes[index] = value
    setCodes(newCodes)
    if (value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const verificationCode = codes.join('')
    try {
      await dispatch(verifyEmail(verificationCode)).unwrap()
      navigate('/')
      toast.success('E-mail başarıyla doğrulandı', {
        position: 'top-right',
        autoClose: 3000,
      })
    } catch (error) {
      return retrieveErrorMessage(error)
    }
  }

  return (
    <Container fluid className='verify-container'>
      <Row className='justify-content-center align-items-center vh-100'>
        <Col xs={12} sm={8} md={4}>
          <Card className='verify-card shadow-sm'>
            <Card.Body>
              <div className='text-center mb-4'>
                <img src={DemirtechLogo} alt='Demirtech Logo' className='logo' />
              </div>
              <h1 className='text-center mb-3'>Verify Your Email</h1>
              <p className='text-center mb-4'>Enter the 6-digit code sent to your email.</p>
              <Form>
                <Row className='justify-content-center'>
                  {codes.map((code, index) => (
                    <Col xs={2} key={index}>
                      <Form.Control
                        type='text'
                        maxLength='1'
                        value={code}
                        onChange={(e) => handleChange(e, index)}
                        ref={(el) => (inputsRef.current[index] = el)}
                        className='code-input text-center'
                      />
                    </Col>
                  ))}
                </Row>
              </Form>

              <Button className='w-100 mt-4 verify-btn' onClick={handleSubmit}>
                Verify Email
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default VerifyEmail
