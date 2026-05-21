 
import { useState } from 'react';

import StartScreen from '../screens/StartScreen';
import PlayScreen from '../screens/PlayScreen';
import GameOverScreen from '../screens/GameOverScreen';

export default function Home() {
  const [screen, setScreen] = useState('start');

  return (
        <div className="w-screen h-screen overflow-hidden bg-black">

      {screen === 'start' && ( <StartScreen onStart={() => setScreen('play')} /> )}
      {screen === 'play' && ( <PlayScreen onGameOver={() => setScreen('gameover')} /> )}
      {screen === 'gameover' && ( <GameOverScreen onRestart={() => setScreen('play')} /> )}
          
    </div>
  );
}




 
 