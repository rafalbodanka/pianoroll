import Navbar from './components/Navbar';
import useFetchRolls from './hooks/useFetchRolls';
import Grid from "./components/Grid";
import { useState } from 'react';

function App() {

  const { data, isLoading } = useFetchRolls();
  const [view, setView] = useState<('grid' | 'play')>('grid');
  const [playedRollIndex, setPlayedRollIndex] = useState<number>(-1)

  return (
    <>
      <Navbar/>
      <Grid
      playedRollIndex={playedRollIndex}
      setPlayedRollIndex={setPlayedRollIndex}
      data={data}
      isLoading={isLoading}
      setView={setView}
      />
    </>
  );
}

export default App;
