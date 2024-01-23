import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Button, Tab, Tabs, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openai } from '../../Common/openai';
import { deviceToken } from '../../Common/deviceToken';
import Notiflix from 'notiflix';

import info from '../../assets/images/info-icon.svg';
import bot from '../../assets/images/bot-small.svg';
import plus from '../../assets/images/plus-icon.svg';
import upArrow from '../../assets/images/up-arrow.svg';
import { apiRequests } from '../../Common/apiRequests';
import GetStarted from '../../components/Modals/GetStarted/GetStarted';
import Messages from '../../components/Messages/Messages';
import History from '../../components/History/History';
import './Chatbot.scss';
import PaymentInformation from '../../components/Modals/PaymentInformation/PaymentInformation';
import { getChatHistory, updateUser } from '../../Redux/actions/authActions';
import PremiumPlan from '../../components/Modals/PremiumPlan/PremiumPlan';

function Chatbot() {
  const dispatch = useDispatch();
  const form  = useRef(null);
  const [validated, setValidated] = useState(false);
  const userToken = useSelector(state => state.auth.token);
  const showPayment = useSelector(state => state.auth.showPayment);
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPremiumPlan, setShowPremiumPlan] = useState(false);

  useEffect(() => {
    if(showPayment) {
      setShowPaymentModal(true);
    }
  }, [showPayment]);

  useEffect(() => {
    setToken(deviceToken);
    localStorage.removeItem('checkout');
  }, [])
  
  useEffect(() => {
    if(userToken == null) {
      if(token != null && token != undefined) {
        getChat();
      }
    }
  }, [token])

  useEffect(() => {
    if(userToken != null) {
      getChat();
      getUser();
    }
  }, [userToken])

  useEffect(() => {
    if(chatId != null || chatId != undefined) {
      getOpenAIList(false);
    }
  }, [chatId])

  const getUser = async () => {
    const endPoint = `user`;
    const response = await apiRequests(endPoint, 'get');
    try {
      if(response.status === 200) {
        dispatch(updateUser(response));
      }
    } catch (err) {
      Notiflix.Notify.failure(err.response.data.status.message);
    }
  }

  const addMessage = (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setShowTyping(false);
  };

  const resetMessage = () => {
    setMessages([]);
  }

  const getChat = async (aiChatId = '') => {
    setMessages([]);
    setChatId();
    const endPoint = userToken ? `user/chats/${aiChatId}` : `public_chats`;
    const userData = {
      device_token: token
    }
    await apiRequests(endPoint, 'get', userData)
    .then((response) => {
      let message = {
        message: response.data.data.attributes.welcome_message,
        role: 'assistant',
        count: response.data.data.attributes.message_count
      }
      setChatId(response.data.data.attributes.chat_id);
      addMessage(message);
    })
    .catch((err) => {
      Notiflix.Notify.failure(err.response.data.status.message);
    })
  }

  const sendPrompt = async (message) => {
    setShowPremiumPlan(false);
    const endPoint = userToken ? `user/chats/${chatId}` : 'public_chats';
    const messageData = {
      device_token: deviceToken,
      chat: {
          "chat_id": chatId,
          "message": message
      }
    }
    addMessage({ message: message, role: 'user' });
    setShowTyping(true);
    await apiRequests(endPoint, 'patch', messageData)
    .then((response) => {
      if(response.status === 200) {
        setTimeout(() => {
          checkRunRetrieve(response.data.data.attributes.run_id);
        }, 1000)
      }
    })
    .catch((err) => {
      if(err.response.data.status.code === 403) {
        // Notiflix.Notify.failure(err.response.data.status.message);
        if(userToken != null) {
          setShowPremiumPlan(true);
        } else {
          setShowSignUp(true);
        }
        setShowTyping(false)
      }
    })
  }

  const sendMessage = async (e) => {
    setShowPremiumPlan(false);
    setShowSignUp(false);
    e.preventDefault();
    const messageForm = e.currentTarget;
    if(!messageForm.checkValidity()) {
      setValidated(true);
      return;
    }
    const data = new FormData(form.current);
    const text = data.get('message');
    const endPoint = userToken ? `user/chats/${chatId}` : 'public_chats';
    const messageData = {
      device_token: deviceToken,
      chat: {
          "chat_id": chatId,
          "message": text
      }
    }
    addMessage({ message: text, role: 'user' });
    setShowTyping(true);
    e.target.reset();
    await apiRequests(endPoint, 'patch', messageData)
    .then((response) => {
      let message = {
        message: text,
        role: 'user',
        count: response.data.data.attributes.message_count
      }
      if(response.status === 200) {
        // addMessage(message);
        setTimeout(() => {
          checkRunRetrieve(response.data.data.attributes.run_id);
        }, 1000)
      }
    })
    .catch((err) => {
      if(err.response.data.status.code === 403) {
        // Notiflix.Notify.failure(err.response.data.status.message);
        if(userToken != null) {
          setShowPremiumPlan(true);
        } else {
          setShowSignUp(true);
        }
        setShowTyping(false);
      }
    })
  }

  const getOpenAIList = async (isRetrievingResponse) => {
    const threadMessages = await openai.beta.threads.messages.list(
      chatId
    );
    if(!isRetrievingResponse) {
      threadMessages.data.slice().reverse().map((thread, index) => {
        let message = { 
          message: thread.content[0].text.value,
          role: thread.role
        }
        addMessage(message);
        dispatch(getChatHistory());
      })
    }
    if(isRetrievingResponse) {
      let message = { 
        message: threadMessages.data[0].content[0].text.value,
        role: threadMessages.data[0].role
      }
      addMessage(message);
      dispatch(getChatHistory());
    }
  }

  const checkRunRetrieve = async (runId) => {
    const run = await openai.beta.threads.runs.retrieve(chatId, runId);
    if(run.status === 'in_progress') {
      setTimeout(() => {
        checkRunRetrieve(runId);
      }, 2000);
    }
    if(run.status === 'completed') {
      getOpenAIList(true);
    }
  }

  return (
    <>
    <div className="custom-container chatbot-bg mt-md-4 pt-4 pt-md-0">
      <div className="chat-grid">
        <div className="conversation-cover">
          { messages.count == 0 && <div className="chat-tabs-section">

            <Row className="justify-content-center">
              <Col sm={12} lg={12} xl={11} xxl={8}>
                <h4 className="text-center fw-semibold">Talk to UVO: Your Personal Medical Guru</h4>
                <p className="text-center">UVO is your 24/7 healthcare companion, ready to provide answers and guidance for your medical questions. </p>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
              <div className="gray7c fw-small">Chat creativity</div>
              <div>
                <img src={info} alt="info" />
              </div>
            </div>

            <Tabs
              defaultActiveKey="profile"
              id="justify-tab-example"
              className="mb-3"
              justify
            >
              <Tab eventKey="home" title="Super">
              </Tab>
              <Tab eventKey="profile" title="Hight">
              </Tab>
              <Tab eventKey="longer-tab" title="Medium">
              </Tab>
              <Tab eventKey="contact" title="Low">
              </Tab>
            </Tabs>
          </div> }
          <Messages messages={messages} setChatId={setChatId} addMessage={addMessage} resetMessage={resetMessage} />
          <div className="suggestions">
            {/* <div className="d-flex justify-content-between align-items-center">
              <div className="gray5c fw-semibold">Suggestions</div>
              <div className="remove-tag">
                <Link className="btn-close"></Link>
              </div>
            </div>
            <div className="d-flex justify-content-between align-content-center">
              <div className="btn-tags mt-2">
                <Button as="input" type="button" value="Symptom Assessment" />{' '}
                <Button as="input" type="button" value="Lab Result Interpretation" />{' '}
                <Button as="input" type="button" value="Health Questions" />{' '}
              </div>
              <div className="remove-tags"></div>
            </div> */}
            {showTyping && <p className='mx-3 typing'>Generating Response...</p>}
            {messages.length > 0 && <div className="chat-input d-flex justify-content-between align-items-center mt-3">
              <div className='d-flex align-items-center w-100'>
                <div>
                  <img src={bot} alt="info" />
                </div>
                <Form className='d-flex align-items-center' noValidate validated={validated} ref={form} onSubmit={sendMessage}>
                  <Form.Control type="text" name="message" placeholder="|How i can help you?" autoComplete="off" autofill="off" required disabled={ messages.length === 0 } />
                  <div className="d-flex align-items-center">
                    <Button type="submit" className='up-arrow' disabled={ messages.length === 0 }>
                      <img src={upArrow} alt="Up Arrow" />
                    </Button>
                    {/* <div>
                      <Link disabled={ messages.length === 0 }>
                        <img src={plus} alt="info" />
                      </Link>
                    </div> */}
                  </div>
                </Form>
              </div>
            </div>}
          </div>
        </div>
        <History getChat={getChat} sendPrompt={sendPrompt} setMessages={setMessages} chatId={chatId} />
      </div>
    </div>
    { showSignUp && userToken == null && <GetStarted showRegister={showSignUp} showError={true} /> }
    { showPremiumPlan && userToken && <PremiumPlan showPremiumPlan={showPremiumPlan} /> }
    { showPaymentModal && userToken && <PaymentInformation showModal={showPaymentModal} /> }
    </>
  )
}

export default Chatbot;
