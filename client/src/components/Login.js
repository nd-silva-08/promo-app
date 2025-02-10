import React from 'react';

function Login() {
  const handleLogin = () => {
    // Redirect the user to the backend Google OAuth route.
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Welcome to Promo App</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default Login; 