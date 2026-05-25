// ecs/screens/HighscoresScreen.jsx

export default function HighscoresScreen({
  onBack,
}) {

  return (

    <div className="menu">

      <h1>HIGHSCORES</h1>

      <p>No highscores yet.</p>

      <button onClick={onBack}>
        BACK
      </button>

    </div>
  );
}