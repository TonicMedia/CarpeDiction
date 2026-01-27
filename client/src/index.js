import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Set image URLs as CSS variables for use in CSS files
const publicUrl = process.env.PUBLIC_URL || '';
const portraitImage = `${publicUrl}/images/paper_1_portrait.jpg`;
const landscapeImage = `${publicUrl}/images/paper_1_landscape.jpg`;

// Apply background images via CSS variables
const style = document.createElement('style');
style.textContent = `
  .chocolate {
    --portrait-bg: url(${portraitImage});
    --landscape-bg: url(${landscapeImage});
  }
`;
document.head.appendChild(style);

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
