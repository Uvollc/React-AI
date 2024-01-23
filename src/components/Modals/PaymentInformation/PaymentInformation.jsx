import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

import './PaymentInformation.scss';
import Welcome from '../Welcome/Welcome';
import { apiRequests } from '../../../Common/apiRequests';
import { useDispatch } from 'react-redux';
import { resetState } from '../../../Redux/actions/authActions';

function PaymentInformation(props) {
  const dispatch = useDispatch();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY.toString());
  const [show, setShow] = useState(props.showModal);
  const [showWelcome, setShowWelcome] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  const handleClose = () => {
    setShow(false);
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
      backdrop.classList.remove("show");
      backdrop.classList.remove("fade");
      backdrop.classList.remove("modal-backdrop");
    });
    dispatch(resetState());
  }

  const CheckoutForm = () => {
    useEffect(() => {
      const checkoutSession = async () => {
        await apiRequests('user/create_checkout_session', 'post')
        .then((response) => {
          setClientSecret(response.data.data.clientSecret);
        })
        .catch((err) => {
          console.log('err', err)
        })
      }
      if(show && (localStorage.getItem('checkout') == undefined || localStorage.getItem('checkout') == false )) {
        localStorage.setItem('checkout', true);
        checkoutSession();
      }
    }, []);
  
    return (
      <div id="checkout" className='checkout'>
        {clientSecret && (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{clientSecret}}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    )
  }
  
  const checkout = () => {
    setShowWelcome(true);
    setShow(false);
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered className="users-modal PaymentInformation"
      >
        <Modal.Header closeButton className="d-flex flex-column-reverse pb-0">
          <Modal.Title>Payment Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { CheckoutForm() }
        </Modal.Body>
      </Modal>
      { showWelcome && <Welcome showWelcome={showWelcome} /> }
    </>
  )
}

export default PaymentInformation;
