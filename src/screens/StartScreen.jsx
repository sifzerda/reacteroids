// ecs/screens/StartScreen.jsx

export default function StartScreen({
  onStart,
}) {

  return (

    <div className="menu">

      <h1>ASTEROIDS</h1>

      <button onClick={onStart}>
        START GAME
      </button>

    </div>
  );
}