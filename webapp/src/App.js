import React from 'react';
import logo from './logo.svg';
import './App.css';
import Basic from './components/Basiccomponent'
import Ask from './components/AskQuestions'
import MiniPlayer from './components/PlayerProfiles'
import PlayerProfiles from './Assets/PlayerProfiles'
import ProfilesPage from './components/ProfilesPage'
import Main from './components/MainPage'
import { shuffle, map, flatten } from 'lodash';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      {/* <Basic />
      <Ask />

      <MiniPlayer player={PlayerProfiles.PlayerExample}/> */}
      <Main />
      {/* <ProfilesPage /> */}

      </header>
 
    </div>
  );
}

export default App;
