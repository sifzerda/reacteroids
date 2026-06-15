// src/pages/Home.jsx

import { useState } from 'react';

import StartScreen from '../screens/StartScreen';
import PlayScreen from '../screens/PlayScreen';
import GameOverScreen from '../screens/GameOverScreen';

import HowToPlayScreen from '../screens/HowToPlayScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HighscoresScreen from '../screens/HighscoresScreen';

import BG from '../components/BG';


export default function Home() {
  const [screen, setScreen] = useState('start');

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
     
      <BG />

      {screen === 'start' && (
        <StartScreen
          onPlay={() => setScreen('play')}
          onHowToPlay={() => setScreen('howtoplay')}
          onSettings={() => setScreen('settings')}
          onHighscores={() => setScreen('highscores')}
        />
      )}

      {screen === 'play' && (<PlayScreen onGameOver={() => setScreen('gameover')} />)}
      {screen === 'gameover' && (<GameOverScreen onRestart={() => setScreen('play')} />)}

      {
        screen === 'howtoplay' && (
          <HowToPlayScreen
            onBack={() => setScreen('start')}
          />
        )
      }

      {
        screen === 'settings' && (
          <SettingsScreen
            onBack={() => setScreen('start')}
          />
        )
      }

      {
        screen === 'highscores' && (
          <HighscoresScreen
            onBack={() => setScreen('start')}
          />
        )
      }

    </div>
  );
}