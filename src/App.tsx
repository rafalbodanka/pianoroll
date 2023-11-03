import Navbar from './components/Navbar';
import useFetchRolls from './hooks/useFetchRolls';
import Grid from "./components/Grid";
import { useState } from 'react';

function App() {

  const { data, isLoading } = useFetchRolls();
  const [playedRollIndex, setPlayedRollIndex] = useState<number>(-1)

  return (
    <div className={`${playedRollIndex !== -1 && 'lg:max-h-screen lg:overflow-hidden'}`}>
      <Navbar />
      <Grid
        playedRollIndex={playedRollIndex}
        setPlayedRollIndex={setPlayedRollIndex}
        data={data}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
