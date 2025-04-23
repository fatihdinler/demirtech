import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearState } from '../../features/auth/auth.api'
import { setEmail, setPassword } from '../../features/login/login.state'
import DemirtechLogo from '../../assets/demirtek-logo-secondary.png'
import { retrieveErrorMessage } from './login.messager'

const Login = () => {
  const dispatch = useDispatch()
  const { error } = useSelector(state => state.auth.api)
  console.log(useSelector(state => state))
  const { email, password } = useSelector(state => state.login)

  console.log(email, password)
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
    retrieveErrorMessage(error)
    dispatch(clearState())
  }

  return (
    <Container fluid className='login-container'>
      <Row className='justify-content-center align-items-center vh-100'>
        <Col xs={12} sm={8} md={4}>
          <Card className='login-card shadow-sm'>
            <Card.Body>
              <div className='text-center mb-4'>
                <img src={DemirtechLogo} alt='Demirtech Logo' className='logo' />
              </div>
              <h4 className='text-center mb-4'>
                Hoşgeldiniz!
              </h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId='formEmail'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='formPassword' className='mt-3'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                    required
                  />
                </Form.Group>
                <Button type='button' className='w-100 mt-4 login-btn' onClick={handleSubmit}>
                  Giriş Yap
                </Button>
              </Form>
              <div className='text-center mt-3'>
                <a href='/forgot-password' className='forgot-link'>
                  Forgot Password?
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
