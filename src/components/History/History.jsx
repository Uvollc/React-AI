import React, { useState, useEffect } from 'react';
import { Button, Tab, Tabs, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';

import search from '../../assets/images/search-arrow.svg';
import list from '../../assets/images/list-icon.svg';
import chat from '../../assets/images/empty-chat.png';
import stars from '../../assets/images/stars.svg';
import trash from '../../assets/images/trash.svg';
import { apiRequests } from '../../Common/apiRequests';
import PaymentInformation from '../Modals/PaymentInformation/PaymentInformation';
import { resetState } from '../../Redux/actions/authActions';
import PremiumPlan from '../Modals/PremiumPlan/PremiumPlan';

function History(props) {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [allChats, setAllChats] = useState();
  const [allPrompts, setAllPrompts] = useState();
  const [showSection, setShowSection] = useState(user?.payment_status == 'pending' ? true : false);
  const [showPayment, setShowPayment] = useState(false);
  const getChatHistory = useSelector(state => state.auth.getChatHistory);
  const [showPremiumPlan, setShowPremiumPlan] = useState(false);

  useEffect(() => {
    if(userToken != null) {
      getAllChats();
    }
  }, [])
  
  useEffect(() => {
    getAllPrompts();
  }, [])

  useEffect(() => {
    if(userToken != null) {
      getAllChats();
    }
  }, [getChatHistory])

  const getAllChats = async () => {
    const endPoint = `user/chats`;
    await apiRequests(endPoint, 'get')
    .then((response) => {
      setAllChats(response.data.data);
      dispatch(resetState());
    })
    .catch((err) => {
      Notiflix.Notify.failure(err.response.data);
    })
  }

  const getAllPrompts = async () => {
    const endPoint = `prompts`;
    await apiRequests(endPoint, 'get')
    .then((response) => {
      setAllPrompts(response.data.data);
    })
    .catch((err) => {
      Notiflix.Notify.failure(err.response.data);
    })
  }

  const deleteChat = async (chatId) => {
    setShowPremiumPlan(false);
    const endPoint = `user/chats/${chatId}`;
    await apiRequests(endPoint, 'delete')
    .then((response) => {
      Notiflix.Notify.success(response.data.status.message);
      getAllChats();
      props.setMessages([]);
    })
    .catch((err) => {
      setShowPremiumPlan(true);
      // Notiflix.Notify.failure(err.response.data.status.message);
    })
  }

  const renderAllChats = () => {
    return (
      <ul>
        { allChats.map((chat, index) => (
          <li key={index} className='d-flex align-items-center justify-content-between'>
            <Link onClick={() => props.getChat(chat.attributes.chat_id)} >
              <img src={list} alt="List" className="me-3" />
              {chat.attributes.title || 'What is your health related question?'}
            </Link>
            <div className='trash' onClick={() => deleteChat(chat.attributes.chat_id)}><img src={trash} alt="Trash" /></div>
          </li>
        ))}
      </ul>
    )
  }

  const renderAllPrompts = () => {
    return (
      <ul>
        { allPrompts.map((prompt, index) => (
          <li key={index}>
            <Link className={props.chatId == null ? 'disabled-link' : ''} onClick={() => props.sendPrompt(prompt.attributes.question_text)}>
              <img src={list} alt="List" className="me-3" />
              {prompt.attributes.display_text}
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
    <div className="contextual-sidebar">
      {/* <div className="search-section d-flex align-items-center">
        <img src={search} alt="search" />
        <Form.Control type="text" placeholder="Search" className=" mr-sm-2" />
      </div> */}
      <div className="history-tabs">
        <Tabs
            defaultActiveKey="Prompts"
            id="justify-tab-example"
            className="mb-3"
            justify
          >
          <Tab eventKey="Prompts" title="Prompts">
            { allPrompts?.length > 0 ? renderAllPrompts() : 'No prompts found'}
          </Tab>
          <Tab eventKey="History" title="History">
            { allChats?.length > 0 ? renderAllChats() : 'No chats found'}
          </Tab>
        </Tabs>
      </div>
      { showSection && <div className="upgrade-chat mt-0">
        <Link className="btn-close" onClick={() => setShowSection(false)}></Link>
        <div className="empty-chat">
          <img src={chat} alt="chat" className="img-fluid" />
        </div>
        <Button variant="primary w-100" onClick={() => setShowPayment(true)}>Upgrade to Pro <img src={stars} alt="star" className="ms-2"/> </Button>{' '}
      </div> }
      {/* <div className="d-flex justify-content-center fw-semibold">Follow us on</div> */}
    </div>
    { showPayment && userToken && <PaymentInformation showModal={showPayment} /> }
    { showPremiumPlan && <PremiumPlan showPremiumPlan={showPremiumPlan} setShowPremiumPlan={setShowPremiumPlan} /> }
    </>
  )
}

export default History;
