import React from 'react';
import ReactDOM from 'react-dom';
import AppWithProvider from './app';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <AppWithProvider />
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
