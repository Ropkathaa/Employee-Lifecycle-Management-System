import React from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Setting dummy token to enable protected routing path access
    localStorage.setItem('token', 'dummy-jwt-token-value');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@hrplatform.com"
          defaultValue="admin@hrplatform.com"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          defaultValue="password"
          required
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            defaultChecked
          />
          <label htmlFor="remember-me" className="ml-2 text-slate-600 dark:text-slate-400">
            Remember me
          </label>
        </div>

        <button
          type="button"
          onClick={() => console.log('Forgot password clicked')}
          className="font-medium text-primary hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <div>
        <Button type="submit" variant="primary" fullWidth>
          Sign In
        </Button>
      </div>
    </form>
  );
}
