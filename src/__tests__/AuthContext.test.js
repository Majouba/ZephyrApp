import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Composant de test qui utilise le hook useAuth
const TestComponent = () => {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      <p data-testid="user">{user ? user.name : 'No user'}</p>
      <button onClick={() => login({ id: 1, name: 'John Doe' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('renders children without crashing', () => {
    const { getByText } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('login function updates the user state', () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByText('Login').click();
    });

    expect(getByTestId('user').textContent).toBe('John Doe');
  });

  it('logout function clears the user state', () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByText('Login').click();
    });
    expect(getByTestId('user').textContent).toBe('John Doe');

    act(() => {
      getByText('Logout').click();
    });
    expect(getByTestId('user').textContent).toBe('No user');
  });

  it('useAuth throws an error when not used within AuthProvider', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleErrorMock.mockRestore();
  });
});
