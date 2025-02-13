import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import Connexion from '../pages/Connexion/Connexion';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('Connexion Component', () => {
  const loginMock = jest.fn();

  const renderWithContext = (component) => {
    return render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <BrowserRouter>{component}</BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('renders form inputs and button', () => {
    renderWithContext(<Connexion />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByText(/Se connecter/i)).toBeInTheDocument();
  });

  it('calls login when form is submitted with valid data', async () => {
    axios.post.mockResolvedValueOnce({
      data: { user: { id: 1, name: 'John Doe', email: 'test@example.com' } },
    });

    renderWithContext(<Connexion />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText(/Se connecter/i));
    });

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(loginMock).toHaveBeenCalled();
  });
});
