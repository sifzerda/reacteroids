// ecs/screens/HowToPlayScreen.jsx

export default function HowToPlayScreen({
  onBack,
}) {

  return (

    <div className="menu">

      <h1>HOW TO PLAY</h1>

      <p>WASD = Move</p>
      <p>Mouse = Aim</p>
      <p>Left Click = Shoot</p>
      <p>Space = Bomb</p>

      <button onClick={onBack}>
        BACK
      </button>

    </div>
  );
}