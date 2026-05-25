// ecs/screens/SettingsScreen.jsx

import FlightLayout from '../components/FlightLayout2';

export default function SettingsScreen({
  onBack,
}) {

  return (

    <FlightLayout
      title="SETTINGS"
      footer="SECTOR CLEAR"
    >
      <div className="menu">

        <h1>SETTINGS</h1>

        <p>Settings coming soon...</p>

        <button onClick={onBack}>
          BACK
        </button>

      </div>

    </FlightLayout>

  );
}
