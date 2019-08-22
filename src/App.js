import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <form
        action='/upload_log'
        method='post'
        encType="multipart/form-data">
        <input type="file" name="logFile" />
        <input type='submit' value='Upload Log' />
      </form>
    </div>
  );
}

export default App;
