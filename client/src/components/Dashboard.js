import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PromoCard from './PromoCard';

function Dashboard() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPromos = () => {
    setLoading(true);
    axios
      .get('http://localhost:5000/promos', { withCredentials: true })
      .then((res) => {
        setPromos(res.data);
      })
      .catch((err) => console.error('Error fetching promos:', err))
      .finally(() => setLoading(false));
  };

  // Fetch promos on mount.
  useEffect(() => {
    fetchPromos();
  }, []);

  // Trigger email processing on the backend.
  const processEmails = () => {
    axios
      .post('http://localhost:5000/emails/process', {}, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        fetchPromos(); // Refresh promo list after processing.
      })
      .catch((err) => console.error('Error processing emails:', err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Active Promo Codes</h2>
      <button onClick={processEmails}>Fetch Latest Promos</button>
      {loading ? (
        <p>Loading promos...</p>
      ) : promos.length > 0 ? (
        promos.map((promo) => <PromoCard key={promo._id} promo={promo} />)
      ) : (
        <p>No active promos available.</p>
      )}
    </div>
  );
}

export default Dashboard; 