// ecs/screens/StartScreen.jsx

export default function StartScreen({
  onPlay,
  onHowToPlay,
  onSettings,
  onHighscores,
}) {

  return (

    <div className="menu">

      <h1>ASTEROIDS</h1>

      <div className="flex flex-col gap-4">

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

    </div>
  );
}