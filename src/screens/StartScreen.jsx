// ecs/screens/StartScreen.jsx

import FlightLayout from '../components/FlightLayout2';

export default function StartScreen({
  onPlay,
  onHowToPlay,
  onSettings,
  onHighscores,
}) {

  return (

    <FlightLayout
      title="ASTEROIDS"
      footer="SECTOR CLEAR"
    >

      <div className="mt-8 flex flex-col gap-4">

        <button onClick={onPlay}>
          PLAY
        </button>

        <button onClick={onHowToPlay}>
          HOW TO PLAY
        </button>

        <button onClick={onSettings}>
          SETTINGS
        </button>

        <button onClick={onHighscores}>
          HIGHSCORES
        </button>

      </div>

    </FlightLayout>
  );
}