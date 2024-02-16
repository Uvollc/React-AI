import React, { useState, useEffect } from 'react';

import WhatUsersSay from '../../components/WhatUsersSay/WhatUsersSay';
import Questions from '../../components/Questions/Questions';
import { Container, Row, Col, Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './Pricing.scss';
import PaymentInformation from '../../components/Modals/PaymentInformation/PaymentInformation';
import { useSelector } from 'react-redux';
import GetStarted from '../../components/Modals/GetStarted/GetStarted';
import Notiflix from 'notiflix';
import { getPublicAccess } from '../../Common/publicAccess';

function Pricing() {
  const navigate = useNavigate();
  const userToken = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const showPayment = useSelector(state => state.auth.showPayment);
  const [show, setShow] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showChat, setShowChat] = useState('false');

  useEffect(() => {
    if(userToken) {
      setShowChat('true');
      setShowRegister(false);
    } else {
      getPublicAccess()
      .then(res => {
        setShowChat(res.data.chat_access);
      })
      .catch(err => {
        console.error(err);
      });
    }
  }, [userToken]);

  useEffect(() => {
    if(showPayment) {
      setShow(true);
    }
  }, [showPayment]);

  const handleChat = () => {
    showChat == 'true' ? navigate('/chat', {state: {showChat: showChat}}) : setShowRegister(true);
  }

  const upgradeToPremium = () => {
    if(user?.payment_status == 'pending' && userToken != null) {
      setShow(true);
      setShowRegister(false);
    }
    if (userToken == null || userToken == undefined) {
      setShow(false);
      setShowRegister(true);
    }
    if(user?.payment_status == 'paid') {
      Notiflix.Notify.success('You are already subscribed to our premium plan.');
      navigate('/chat');
    }
  }
  return (
    <>
      <Container fluid="lg">
        <Row className="justify-content-center my-5 mb-sm-0 pb-md-5 pb-sm-0">
          <Col sm={8} lg={6}>
            <h2 className="text-center">A quick look at our <span>Pricing</span> Options</h2>
          </Col>
          <Col lg="12">
            <h5 className="text-center">Explore UVO's Flexible Subscription Plans for Personalized Health Support and Guidance.</h5>
          </Col>
        </Row>
        <Row className="my-5 pb-3 pt-md-5 pt-sm-0 justify-content-center">
        <Col sm={12} md={4} lg={4} className="mb-md-0 mb-sm-5">
          <Card className="h-100">
            <CardBody className="p-0">
              <div className="d-flex flex-column justify-content-between h-100">
                <div>
                  <CardTitle>Free</CardTitle>
                  <CardSubtitle className="py-2">Basic Plan</CardSubtitle>
                  <CardText className="pb-3">Get started with our Basic Plan for free and access a limited number of medical questions and answers. Perfect for occasional health inquiries.  </CardText>
                  <hr />
                  <div className="list-view">
                    <ul className="mt-3">
                      <li>Limited access to the medical chat bot.</li>
                      <li>Access to a limited number of Q&A</li>
                      <li>No commitment, cancel anytime.</li>
                      <li>Access to all features</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-100 mt-3" disabled={user?.payment_status == 'pending' && userToken != null} onClick={handleChat}>{`${user?.payment_status == 'pending' && userToken != null ? 'Current Plan' : 'Get Started for Free'} `}</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={12} md={4} lg={4} className="mb-md-0 mb-sm-5">
          <Card className="h-100">
            <CardBody className="p-0">
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <CardTitle>$4.99<span>/month</span></CardTitle>
                <CardSubtitle className="py-2">Premium Plan</CardSubtitle>
                <CardText className="pb-3">Upgrade to our Premium Plan for just $4.99 per month and enjoy unlimited access to our medical chat bot. Get answers to all your health questions, anytime you need them.</CardText>
                <hr />
                <div className="list-view">
                  <ul className="mt-3">
                    <li>Unlimited access to the medical chat bot.</li>
                    <li>Ask as many questions as you want.</li>
                    <li>Priority support for faster responses.</li>
                    <li>Cancel anytime.</li>
                  </ul>
                </div>
              </div>
              <Button className="w-100 mt-3" disabled={user?.payment_status == 'paid' && userToken != null} onClick={upgradeToPremium}>{`${user?.payment_status == 'paid' && userToken != null ? 'Current Plan' : 'Upgrade to Premium'} `}</Button>
            </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={12} md={4} lg={4} className="mb-md-0 mb-sm-5 d-none">
          <Card className="h-100">
            <CardBody className="p-0">
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <CardTitle>$14.99<span>/month</span></CardTitle>
                <CardSubtitle className="py-2">Family Plan</CardSubtitle>
                <CardText className="pb-3">Share the benefits of our Premium Plan with your family. For just $14.99 per month, get unlimited access for up to 5 family members.</CardText>
                <hr />
                <div className="list-view">
                  <ul className="mt-3">
                    <li>Unlimited access for up to 5 family members.</li>
                    <li>Access to premium features for all users.</li>
                    <li>Priority support for all family members.</li>
                    <li>Cancel anytime.</li>
                  </ul>
                </div>
              </div>
              <Button className="w-100 mt-3">Get Family Plan</Button>
            </div>
            </CardBody>
          </Card>
        </Col>
        </Row>
      </Container>
      <WhatUsersSay />
      <Questions />
      {show && userToken && <PaymentInformation showModal={show} />}
      {showRegister && <GetStarted showRegister={showRegister} setShowRegister={setShowRegister} />}
    </>
  )
}

export default Pricing;
