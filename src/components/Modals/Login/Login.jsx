import React, { useRef, useState } from 'react';
import { Nav, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Notiflix from 'notiflix';

import './Login.scss';
import { apiRequests } from '../../../Common/apiRequests';
import { setToken } from '../../../Redux/actions/authActions';
import GetStarted from '../GetStarted/GetStarted';
import { deviceToken } from '../../../Common/deviceToken';

function Login(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(props.showLogin);
  const [showRegister, setShowRegister] = useState(false);
  const form  = useRef(null);
  const [validated, setValidated] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true)
    setShowRegister(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginForm = e.currentTarget;
    if(!loginForm.checkValidity()) {
      setValidated(true);
      return;
    }
    const endPoint = `login`;
    const data = new FormData(form.current);
    const userData = {
      user : {
        email: data.get('email'),
        password: data.get('password'),
        device_token: deviceToken
      }
    }
    await apiRequests(endPoint, 'post', userData)
    .then((response) => {
      if(response.status === 200) {
        dispatch(setToken(response));
        navigate('/chat');
      }
    })
    .catch((err) => {
      Notiflix.Notify.failure(err.response.data);
    })
  }

  return (
    <>
      {!props.showLogin && <Nav.Link onClick={handleShow}>Login</Nav.Link>}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered className="users-modal"
      >
        <Modal.Header closeButton className="d-flex flex-column-reverse pb-0">
          <Modal.Title>Let's Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
        <Form noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email Address*</Form.Label>
            <Form.Control type="email" name="email" placeholder="Insert your email" required onChange={(e) => setEmail(e.target.value)} />
            <Form.Control.Feedback type="invalid">
            {email === '' ? 'Email is required!' : 'Enter valid email address!'}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password*</Form.Label>
            <Form.Control type="password" name="password" placeholder="Insert your password" required />
            <Form.Control.Feedback type="invalid">
              Password is required!
            </Form.Control.Feedback>
          </Form.Group>
          <Button className="w-100" variant="primary" type="submit">
            Sign in
          </Button>
          <div className="text-center pt-4 gray85">
            Don't have an account? 
            <a className="fw-semibold ms-2" role='button' onClick={() => {
              setShowRegister(!showRegister)
              setShow(!show)
              }}>Register</a>
          </div>
        </Form>
        </Modal.Body>
      </Modal>
      {showRegister && <GetStarted showRegister={showRegister} />}
    </>
  );
}

export default Login;
