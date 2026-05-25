// ecs/screens/HighscoresScreen.jsx

import FlightLayout from '../components/FlightLayout2';

export default function HighscoresScreen({
  onBack,
}) {

  return (

    <FlightLayout
      title="HIGHSCORES"
      footer="SECTOR CLEAR"
    >
      <div className="menu">

        <h1>HIGHSCORES</h1>

        <p>No highscores yet.</p>

        <button onClick={onBack}>
          BACK
        </button>

      </div>

    </FlightLayout>


  );
}