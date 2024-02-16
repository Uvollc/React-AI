import React, { useRef, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';

import './GetStarted.scss';
import PaymentInformation from '../PaymentInformation/PaymentInformation';
import Login from '../Login/Login';
import { apiRequests } from '../../../Common/apiRequests';
import { setSignUp } from '../../../Redux/actions/authActions';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function GetStarted(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector(state => state.auth);
  const { showPayment, user } = authState;
  const [email, setEmail] = useState('');
  const [showSignUp, setShowSignUp] = useState(props.showRegister);
  const [showLogin, setShowLogin] = useState(false);
  const form  = useRef(null);
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showError, setShowError] = useState(props.showError || false);
  const [cookies, setCookies] = useCookies();
  const deviceToken = cookies.deviceToken;
  const errorString = 'Account required to continue diagnosis';

  const handleClose = () => {
    setShowSignUp(false);
    if(props.setShowRegister) {
      props.setShowRegister(false);
    }
  }
  const handleShow = () => {
    if(user) {
      navigate('/chat');
    } else {
      setShowSignUp(true);
      setShowLogin(false);
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setPasswordsMatch(password === e.target.value);
  };

  const onNextClick = async (e) => {
    e.preventDefault();
    const signupForm = e.currentTarget;
    if(!signupForm.checkValidity()) {
      setValidated(true);
      return;
    }
    const endPoint = `signup`;
    const data = new FormData(form.current);
    const userData = {
      user: {
        first_name: data.get('first_name'),
        last_name: data.get('last_name'),
        email: data.get('email'),
        password: data.get('password'),
        password_confirmation: data.get('confirm_password'),
        device_token: deviceToken
      }
    }
    try {
      const response = await apiRequests(endPoint, 'post', userData);
      if (response.status === 200) {
        Notiflix.Notify.success(response.data.status.message);
        dispatch(setSignUp(response));
        setShowSignUp(false);
      }
    } catch (err) {
      Notiflix.Notify.failure(err.response.data.status.message);
    }
  }

  return (
    <>
      {props.source == 'footer' ? (
        <Button variant="primary mt-lg-0" onClick={handleShow}>Sign Up Now</Button>
      ) : (
        !props.showRegister && <Button variant="primary my-lg-0 my-4 mx-3 mx-lg-0" onClick={handleShow}>Get Started</Button>
      )}
      <Modal
        show={showSignUp}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered className="users-modal"
      >
        {showError && <div className="error-string">{ errorString }</div>}
        <Modal.Header closeButton className="d-flex flex-column-reverse pb-0">
          <Modal.Title>Create Your UVO Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form noValidate validated={validated} ref={form} onSubmit={onNextClick}>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name*</Form.Label>
            <Form.Control type="text" placeholder="Insert first name" name="first_name" required />
            <Form.Control.Feedback type="invalid">
              First name is required!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name*</Form.Label>
            <Form.Control type="text" placeholder="Insert last name" name="last_name" required />
            <Form.Control.Feedback type="invalid">
              Last name is required!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email Address*</Form.Label>
            <Form.Control type="email" placeholder="Insert your email" name="email" required onChange={(e) => setEmail(e.target.value)} />
            <Form.Control.Feedback type="invalid">
            {email === '' ? 'Email is required!' : 'Enter valid email address!'}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password*</Form.Label>
            <Form.Control type="password" placeholder="Insert your password" name="password" required onChange={handlePasswordChange} />
            <Form.Control.Feedback type="invalid">
              Password is required!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password*</Form.Label>
            <Form.Control type="password" placeholder="Confirm your password" name="confirm_password" required onChange={handleConfirmPasswordChange} />
            <Form.Control.Feedback type="invalid">
              Confirm Password is required!
            </Form.Control.Feedback>
            {passwordsMatch ? null : <Form.Text className="text-danger">Passwords do not match</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-4 pb-2 mt-3 fw-semibold" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label={
          <span>
            Agree to{' '}
            <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </Link>
          </span>
        } required />
          </Form.Group>
          <Button className="w-100" variant="primary" type="submit">
            Next
          </Button>
          <div className="text-center pt-4 gray85">
            Already have an account? <a className="fw-medium ms-2" role='button' onClick={() => {
              setShowLogin(true)
              setShowSignUp(false)
              }} >Log in</a>
          </div>
        </Form>
        </Modal.Body>
      </Modal>
      { user && <PaymentInformation showModal={showPayment} /> }
      { showLogin && <Login showLogin={showLogin} /> }
    </>
  )
}

export default GetStarted;
