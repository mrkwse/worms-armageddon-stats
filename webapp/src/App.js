import React from 'react';
import logo from './logo.svg';
import './App.css';
import Basic from './components/Basiccomponent'
import Ask from './components/AskQuestions'
import MiniPlayer from './components/MiniPlayerProfile'
import PlayerProfiles from './Assets/PlayerProfiles'
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Basic />
      <Ask />
      <MiniPlayer player={PlayerProfiles.PlayerExample}/>
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
