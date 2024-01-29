import React from 'react';
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

function Home() {
  const navigate = useNavigate();
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
              <Button variant="outline-primary me-1 small-btn" onClick={() => navigate('/chat')}> Ask UVO Now</Button>{' '}
              <Button variant="primary my-lg-0 my-4 mx-3 mx-lg-0" onClick={() => navigate('/pricing')}>Get Started</Button>
            </div>
          </div>
          <div className="AIchatbot-img">
            <img src={AIchatbot} alt="Logo" />
          </div>
        </div>
      </div>
      <About />
      <KeyFeature />
      <HowItWorks />
      <WhatUsersSay />
      <Questions />
    </>
  )
}

export default Home;
