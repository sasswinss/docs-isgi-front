// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex items-start justify-center min-h-screen bg-white rounded-xl">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Connectez-Vous</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
