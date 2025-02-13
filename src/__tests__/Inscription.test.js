import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Inscription from '../pages/Inscription/Inscription'; // Assure-toi que le chemin est correct

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Inscription Component', () => {
  test('renders Inscription form correctly', () => {
    render(
      <BrowserRouter>
        <Inscription />
      </BrowserRouter>
    );

    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Entrez votre nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Entrez votre adresse email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Entrez votre mot de passe/i)).toBeInTheDocument();
  });

  test('submits the form successfully and redirects to login page', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Inscription réussie' } });

    render(
      <BrowserRouter>
        <Inscription />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Entrez votre nom d'utilisateur/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Entrez votre adresse email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Entrez votre mot de passe/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/S'inscrire/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/connexion');
    expect(toast.success).toHaveBeenCalledWith('✅ Inscription réussie ! Redirection vers la page de connexion...');
  });

  test('handles form submission error and shows error toast', async () => {
    axios.post.mockRejectedValueOnce(new Error('Erreur lors de l\'inscription'));

    render(
      <BrowserRouter>
        <Inscription />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Entrez votre nom d'utilisateur/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Entrez votre adresse email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Entrez votre mot de passe/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/S'inscrire/i));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(toast.error).toHaveBeenCalledWith('❌ Erreur lors de l\'inscription. Veuillez réessayer.');
  });

  test('shows loading state while submitting', async () => {
    axios.post.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    render(
      <BrowserRouter>
        <Inscription />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Entrez votre nom d'utilisateur/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Entrez votre adresse email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Entrez votre mot de passe/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/S'inscrire/i));

    expect(screen.getByText(/Inscription en cours.../i)).toBeInTheDocument();
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/S'inscrire/i)).toBeInTheDocument();
  });

  test('does not submit form with empty fields', async () => {
    render(
      <BrowserRouter>
        <Inscription />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/S'inscrire/i));

    expect(axios.post).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
