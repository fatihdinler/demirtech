import React, { useState, useContext, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup
} from 'react-bootstrap'
import demirtekLogo from '../../assets/demirtek-logo.png'
import { AuthContext } from '../../contexts/auth.context'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { auth, login, loading } = useContext(AuthContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  console.log('auth -->', auth)
  console.log('login -->', login)
  console.log('loading -->', loading)

  useEffect(() => {
    if (!loading && auth.token) {
      navigate('/dashboard')
    }
  }, [auth, loading, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    const success = await login(username, password)
    if (!success) {
      setError('Giriş bilgileri hatalı. Lütfen tekrar deneyin.')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container fluid className='login-container'>
      <Row className='min-vh-100 d-flex align-items-center justify-content-center'>
        <Col xs={10} sm={8} md={6} lg={4} xl={3}>
          <Card className='shadow border-0'>
            <Card.Body>
              <div className='text-center mb-4'>
                <img
                  src={demirtekLogo}
                  alt='Demirtek Logo'
                  className='img-fluid mb-2'
                  style={{ maxWidth: '100px' }}
                />
                <h4 className='mb-0'>Demirtek Admin Panel</h4>
              </div>
              {error && <p className='text-danger text-center'>{error}</p>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId='formUsername' className='mb-3'>
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className='bi bi-person-fill'></i>
                    </InputGroup.Text>
                    <Form.Control
                      type='text'
                      placeholder='Enter your username'
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId='formPassword' className='mb-3'>
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className='bi bi-lock-fill'></i>
                    </InputGroup.Text>
                    <Form.Control
                      type='password'
                      placeholder='Enter your password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <Form.Check type='checkbox' label='Remember me' />
                  <a href='#forgot' className='small text-muted'>
                    Forgot password?
                  </a>
                </div>
                <Button variant='primary' type='submit' className='w-100'>
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className='text-center mt-3'>
            <small className='text-muted'>
              Terms of Use | Privacy Policy
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
