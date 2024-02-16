import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

import AIchatbot from '../../assets/images/banner-img.png';
import About from '../../components/About/About';
import KeyFeature from '../../components/KeyFeature/KeyFeature';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import WhatUsersSay from '../../components/WhatUsersSay/WhatUsersSay';
import Questions from '../../components/Questions/Questions';
import './Home.scss';
import GetStarted from '../../components/Modals/GetStarted/GetStarted';
import { useNavigate } from 'react-router-dom';
import { getPublicAccess } from '../../Common/publicAccess';
import { useSelector } from 'react-redux';

function Home() {
  const navigate = useNavigate();
  const userToken = useSelector(state => state.auth.token);
  const [showChat, setShowChat] = useState('false');
  const [showRegister, setShowRegister] = useState(false);

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

  const handleChat = () => {
    showChat == 'true' ? navigate('/chat', {state: {showChat: showChat}}) : setShowRegister(true);
  }

  return (
    <>
      <div className="main-banner">
        <div className="banner-inner d-flex justify-content-end align-items-center">
          <div className="banner-text mt-4 mt-md-0">
            <h2>
              Have health questions? <span>Get answers now</span>
            </h2>
            <h5>No waiting for your doctor's office or guessing on the internet.</h5>
            <div className="bnt-section mt-5">
              <Button variant="outline-primary me-1 small-btn" onClick={handleChat}> Ask UVO Now</Button>{' '}
              <Button variant="primary my-lg-0 my-4 mx-3 mx-lg-0" onClick={() => navigate('/pricing')}>Get Started</Button>
            </div>
          </div>
          <div className="AIchatbot-img">
            <img src={AIchatbot} alt="Logo" />
          </div>
        </div>
      </div>
      <About showChat={showChat} />
      <KeyFeature />
      <HowItWorks />
      <WhatUsersSay />
      <Questions />
      {showRegister && <GetStarted showRegister={showRegister} setShowRegister={setShowRegister} />}
    </>
  )
}

export default Home;
