import React, { useState } from 'react'
// GÜNCELLENEN KISIM: Alert bileşeni import edildi
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/auth/auth.api'
import ThermasenseLogo from '../../assets/thermasense-logo.png'
import './login.css'

const Login = () => {
    const dispatch = useDispatch()
    const { user, isAuthenticated, error, isLoading, isCheckingAuth } = useSelector(state => state.auth.api)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(login({ email, password }))
    }

    return (
        <Container fluid className='login-container'>
            <Row className='justify-content-center align-items-center vh-100'>
                <Col xs={12} sm={8} md={4}>
                    <Card className='login-card shadow-sm'>
                        <Card.Body>
                            <div className='text-center mb-4'>
                                <img src={ThermasenseLogo} alt='ThermaSense Logo' className='logo' />
                            </div>
                            <h4 className='text-center mb-4'>
                                Hoşgeldiniz!
                            </h4>

                            {/* YENİ EKLENEN KISIM: Eğer hata varsa kırmızı uyarı kutusu çıkar */}
                            {error && (
                                <Alert variant="danger" className="text-center py-2">
                                    {error.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.'}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId='formEmail'>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type='email'
                                        placeholder='Enter email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId='formPassword' className='mt-3'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder='Enter password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                {/* isLoading durumunu butona bağlayarak giriş yaparken butonun tıklanmasını engelleyebilirsin */}
                                <Button type='submit' className='w-100 mt-4 login-btn' disabled={isLoading}>
                                    {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
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