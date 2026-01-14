import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Set CSS custom properties for public assets
const publicUrl = process.env.PUBLIC_URL || '';
const root = document.documentElement;
root.style.setProperty('--bg-portrait', `url(${publicUrl}/images/paper_1_portrait.jpg)`);
root.style.setProperty('--bg-landscape', `url(${publicUrl}/images/paper_1_landscape.jpg)`);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
