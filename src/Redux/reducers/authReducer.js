import { SET_TOKEN, SET_SIGN_UP, LOGOUT, UPDATE_USER, GET_CHAT_HISTORY, RESET_STATE } from "../actions/authActionTypes";

const initialState = {
  token: localStorage.getItem('accessToken') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  showPayment: false,
  getChatHistory: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      localStorage.setItem('accessToken', action.payload.headers.authorization);
      localStorage.setItem('user', JSON.stringify(action.payload.data.data.attributes));
      return {
        ...state,
        token: action.payload.headers.authorization,
        user: action.payload.data.data.attributes,
        showPayment: false
      };
    case SET_SIGN_UP:
      localStorage.setItem('accessToken', action.payload.headers.authorization);
      localStorage.setItem('user', JSON.stringify(action.payload.data.data.attributes));
      return {
        ...state,
        token: action.payload.headers.authorization,
        user: action.payload.data.data.attributes,
        showPayment: true
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
        showPayment: false,
        getChatHistory: false
      };
    case UPDATE_USER:
      localStorage.setItem('user', JSON.stringify(action.payload.data.data.attributes));
      return {
        ...state,
        user: action.payload.data.data.attributes
      };
    case GET_CHAT_HISTORY:
      return {
        ...state,
        getChatHistory: true
      };
    case RESET_STATE:
      localStorage.removeItem('checkout');
      return {
        ...state,
        getChatHistory: false,
        showPayment: false
      };
    default:
      return state;
  }
};

export default authReducer;