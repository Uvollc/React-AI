import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import AboutCard from '../../assets/images/about-card.png';
import './About.scss';
import { useNavigate } from 'react-router-dom';
import GetStarted from '../Modals/GetStarted/GetStarted';

function About(props) {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  const handleChat = () => {
    props.showChat == 'true' ? navigate('/chat', {state: {showChat: props.showChat}}) : setShowRegister(true);
  }

  return (
    <>
    <div className="container-lg">
      <div className="about-assistant section-spacing pb-4 mt-md-5">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <img src={AboutCard} alt="About" />
          </div>
          <div className="col-md-6 col-sm-12 text-center text-md-start">
            <h2>About <span> Uvo Health</span></h2>
            <h5 className="p-0 pe-lg-5">
              Uvo Health is an AI based medical guru to help find answers to your 
              Symptoms, diagnoses, lab results, imaging results, our UVO assistant
              is here to help using the latest in specialized AI technology. 
            </h5>
            <div className="bnt-section mt-5">
              <Button variant="outline-primary me-1 small-btn" onClick={handleChat}>Ask UVO Now</Button>{' '}
              <Button variant="primary my-lg-0 my-4 mx-3 mx-lg-0" onClick={() => navigate('/pricing')}>Get Started</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showRegister && <GetStarted showRegister={showRegister} />}
    </>
  )
}

export default About;
