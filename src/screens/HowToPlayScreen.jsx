// ecs/screens/HowToPlayScreen.jsx

import FlightLayout from '../components/FlightLayout2';

export default function HowToPlayScreen({
  onBack,
}) {

  return (

    <FlightLayout
      title="HOW TO PLAY"
      footer="SECTOR CLEAR"
    >
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

    </FlightLayout>

  );
}
