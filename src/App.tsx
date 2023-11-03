import Navbar from './components/Navbar';
import useFetchRolls from './hooks/useFetchRolls';
import Grid from "./components/Grid";
import { useEffect, useState } from 'react';

function App() {

  const { data, isLoading } = useFetchRolls();
  const [playedRollIndex, setPlayedRollIndex] = useState<number>(-1)

  useEffect(() => {
    if (playedRollIndex !== -1) {
      // Smoothly scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [playedRollIndex]);

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
