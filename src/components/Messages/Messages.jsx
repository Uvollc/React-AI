import React, { useState, Fragment, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';

import chattitle from '../../assets/images/chat-title.svg';
import share from '../../assets/images/share-icon.svg';
import userImg from '../../assets/images/userImg.png';
import thumbUp from '../../assets/images/thumb-up.svg';
import thumbDown from '../../assets/images/thumb-down.svg';
import shareChat from '../../assets/images/share-chat.svg';
import copy from '../../assets/images/chat-copy.svg';
import repeat from '../../assets/images/repeat.svg';
import bot from '../../assets/images/bot-small.svg';
import { apiRequests } from '../../Common/apiRequests';
import { getChatHistory } from '../../Redux/actions/authActions';
import PremiumPlan from '../Modals/PremiumPlan/PremiumPlan';

function Messages(props) {
  const userToken = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const messages = props.messages;
  const dispatch = useDispatch();
  const myDivRef = useRef(null);
  const [showPremiumPlan, setShowPremiumPlan] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (myDivRef.current) {
      myDivRef.current.scrollTop = myDivRef.current.scrollHeight;
    }
  };

  const createChat = async () => {
    setShowPremiumPlan(false);
    if(user.payment_status == 'paid') {
      props.resetMessage();
    }
    const endPoint = `user/chats`;
    await apiRequests(endPoint, 'post')
    .then((response) => {
      let message = {
        message: response.data.data.attributes.welcome_message,
        role: 'assistant',
        count: response.data.data.attributes.message_count
      }
      props.addMessage(message);
      props.setChatId(response.data.data.attributes.chat_id);
      dispatch(getChatHistory());
    })
    .catch((err) => {
      setShowPremiumPlan(true);
      // Notiflix.Notify.failure(err.response.data.status.message);
    })
  }

  return (
    <>
    <div className="chat-section">
      <div className="chat-inner">
        <div className='chat-title d-flex justify-content-between align-items-center'>
          <div>
            <img src={chattitle} alt="chat Title" className="me-4"/>
            UVO Doc
          </div>
          <div className='d-flex'>
            {userToken && <p className='chat-share me-2' onClick={createChat}>
              New Chat
            </p>}
            {/* <a href="#" className='chat-share'>
              Share
              <img src={share} alt="Share" className="ms-2"/>
            </a> */}
          </div>
        </div>
      </div>
      {messages.length == 0 && <div className='chat-wrap d-flex justify-content-center flex-column'>
        <p className='new-chat-message'>Create New Chat or Load Chat from History</p>
      </div>}
      {messages.length > 0 && <div className='chat-wrap' ref={myDivRef}>
        { messages.map((message, index) => (
          <Fragment key={index}>
            { message.role == 'user' && 
            <div className='chat-inner'>
              <div className="chat-grid">
                <div className="user-img">
                  <img src={user?.avatar || userImg} alt="User" className='user-image' />
                </div>
                <div className="chat-text">
                  <p>{ message.message }</p>
                </div>
              </div>
            </div>
            }
            { message.role == 'assistant' && 
            <>
            <div className='chat-inner'>
              <div className="chat-grid">
                <div className="user-img">
                  <img src={bot} alt="info" />
                </div>
                <div className="chat-text">
                  <pre>
                    { message.message }
                  </pre>
                  {/* <div className="chat-btns-group mt-2">
                    <div className="d-flex justify-content-between align-content-center">
                      <div className='d-flex'>
                        <a className='chat-btn' href='#'>
                          <img src={thumbUp} alt="Thumb Up" />
                        </a>
                        <a className='chat-btn' href='#'>
                          <img src={thumbDown} alt="Thumb Down" />
                        </a>
                        <a className='chat-btn' href='#'>
                          <img src={shareChat} alt="Share" />
                        </a>
                        <a className='chat-btn' href='#'>
                          <img src={copy} alt="Copy Up" />
                        </a>
                      </div>
                      <div>
                        <a className='chat-btn' href='#'>
                          <img src={repeat} alt="Repeat" />
                        </a>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <hr />
            </>}
          </Fragment>
        ))}
      </div>}
    </div>
    { showPremiumPlan && <PremiumPlan showPremiumPlan={showPremiumPlan} setShowPremiumPlan={setShowPremiumPlan} /> }
    </>
  )
}

export default Messages;
