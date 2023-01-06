import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import AppWithProvider from './app';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'emoji-mart/css/emoji-mart.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/main.scss';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer />
    <AppWithProvider />
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
