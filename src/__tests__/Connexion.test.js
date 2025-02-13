import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Connexion from '../pages/Connexion/Connexion';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Se connecter/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(loginMock).toHaveBeenCalled();
  });

  it('shows error message when login fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Erreur de connexion'));

    renderWithContext(<Connexion />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText(/Se connecter/i));

    await waitFor(() => {
      const errorMessage = screen.getByText('❌ Erreur lors de la connexion. Vérifiez vos identifiants.');
      expect(errorMessage).toBeInTheDocument();
    });

    expect(loginMock).not.toHaveBeenCalled();
  });

  it('disables button and shows loading state during submission', async () => {
    axios.post.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    renderWithContext(<Connexion />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Se connecter/i));

    expect(screen.getByText(/Connexion en cours.../i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  });
});
