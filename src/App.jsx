import React, { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notiflix from 'notiflix';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { CookiesProvider, useCookies } from 'react-cookie';

function App() {
  const location = useLocation();
  const [cookies, setCookies] = useCookies(["deviceToken"]);
  const current = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(current.getFullYear() + 1);

  useEffect(() => {
    Notiflix.Notify.init({
      className: 'notiflix-notify',
      width: '380px',
      position: 'right-top',
      timeout: 6000,
      closeButton: true
    });
    if(cookies['deviceToken'] == undefined) {
      setCookies('deviceToken', current, { path: '/', expires: nextYear});
    }
  })

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
    <CookiesProvider>
      <Provider store={store}>
        <Header />
        <Outlet />
        <Footer />
      </Provider>
    </CookiesProvider>
    </>
  )
}

export default App
