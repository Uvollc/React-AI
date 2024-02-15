import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Dropdown, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import store from '../../Redux/store';
import logo from '../../assets/images/logo.png';
import Login from '../Modals/Login/Login';
import GetStarted from '../Modals/GetStarted/GetStarted';
import './Header.scss';
import userImg from '../../assets/images/userImg.png';
import bell from '../../assets/images/bell-icon.svg';
import { apiRequests } from '../../Common/apiRequests';
import { logout } from '../../Redux/actions/authActions';
import { getPublicAccess } from '../../Common/publicAccess';

function Header() {
  // const state = store.getState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showChat, setShowChat] = useState('false');
  const [showRegister, setShowRegister] = useState(false);
  const userToken = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    getPublicAccess()
      .then(res => {
        setShowChat(res.data.chat_access);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleLogout = async () => {
    const endPoint = `logout`;
    await apiRequests(endPoint, 'delete')
    .then((response) => {
      dispatch(logout());
      localStorage.clear();
      navigate('/');
    })
    .catch((err) => {
      Notiflix.Notify.failure(err.response.data);
    })
  }

  const handleSettings = () => {
    navigate('/settings/general');
  }

  const handleChat = () => {
    showChat === 'true' ? navigate('/chat', {state: {showChat: showChat}}) : setShowRegister(true);
  }

  return (
    <>
    <Navbar expand="lg" className='topHeader mb-0'>
      <div className="container-lg">
        <div className="logo">
          <NavLink to="/" className='p-0 d-flex w-100'>
            <img src={logo} alt="Logo" />
          </NavLink>
        </div>
        <div className='d-flex justify-content-end centerNav'>
          {userToken && <div className='d-md-block d-lg-none me-4'>
            <div className="right-nav d-flex align-items-center">
              {/* <div className="bell me-3 d-flex align-items-center justify-content-center">
                <div className="notification"></div>
                <img src={bell} alt="Bell" />
              </div> */}
              <div className=' d-flex align-items-center profile-dropdown'>
                <div className="avatar">
                  <div className="dot"></div>
                  <img src={user?.avatar || userImg} alt="user-image" />
                </div>
                <Dropdown>
                  <Dropdown.Toggle variant="" id="dropdown-basic">
                    <span>
                      { `${user?.first_name} ${user?.last_name}` }
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleSettings}>Settings</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto center-nav">
              <NavLink to="/pricing">Pricing</NavLink>
              <span className={location.pathname == '/chat' ? 'active' : ''} onClick={handleChat}>Chatbot</span>
            </Nav>
            {userToken ? (
            <Nav>
              <div className='d-lg-block d-none'>
                <div className="right-nav d-flex align-items-center">
                  {/* <div className="bell me-3 d-flex align-items-center justify-content-center">
                    <div className="notification"></div>
                    <img src={bell} alt="Bell" />
                  </div> */}
                  <div className='d-flex align-items-center profile-dropdown'>
                    <div className="avatar">
                      <div className="dot"></div>
                      <img src={user?.avatar || userImg} alt="user-image" />
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle variant="" id="dropdown-basic">
                        { `${user?.first_name} ${user?.last_name}` }
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={handleSettings}>Settings</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </Nav>) : (
            <Nav>
              <Login />
              <Button variant="primary my-lg-0 my-4 mx-3 mx-lg-0" onClick={() => navigate('/pricing')}>Get Started</Button>
            </Nav>
          )}
          </Navbar.Collapse>
        </div>
      </div>
    </Navbar>
    {showRegister && <GetStarted showRegister={showRegister} />}
    </>
  )
}

export default Header;
                                                