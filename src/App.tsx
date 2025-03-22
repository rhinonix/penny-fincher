import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [status, setStatus] = useState('Checking connection...');

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('count')
          .limit(1);

        if (error) {
          throw error;
        }

        setStatus('Connected to Supabase successfully!');
        console.log('Test query result:', data);
      } catch (error) {
        setStatus(`Connection error: ${error.message}`);
        console.error('Supabase error:', error);
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">PennyFincher</h1>
      <div className="p-4 bg-white rounded shadow">
        {status}
      </div>
    </div>
  );
}

export default App;