// ecs/screens/GameOverScreen.jsx

export default function GameOverScreen({
  onRestart,
}) {

  return (

    <div className="menu">

      <h1>GAME OVER</h1>

      <button onClick={onRestart}>
        PLAY AGAIN
      </button>

    </div>
  );
}