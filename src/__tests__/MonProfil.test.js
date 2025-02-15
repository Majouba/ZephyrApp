import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import MonProfil from '../pages/MonProfil/MonProfil';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('MonProfil Component', () => {
  const userMock = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
  const setUserMock = jest.fn();
  const logoutMock = jest.fn();

  const renderWithContext = (component) => {
    return render(
      <AuthContext.Provider value={{ user: userMock, logout: logoutMock, setUser: setUserMock }}>
        <BrowserRouter>{component}</BrowserRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    renderWithContext(<MonProfil />);
    expect(screen.getByText(/Bienvenue sur votre profil, John Doe !/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('john.doe@example.com');
  });

  it('updates user information on form submission', async () => {
    axios.put.mockResolvedValueOnce({
      data: { user: { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' } },
    });

    renderWithContext(<MonProfil />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Jane Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane.doe@example.com' } });
      fireEvent.click(screen.getByText(/Mettre à jour/i));
    });

    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    expect(setUserMock).toHaveBeenCalledWith({ id: 1, name: 'Jane Doe', email: 'jane.doe@example.com' });
  });

  it('logs the user out on "Se déconnecter" button click', async () => {
    renderWithContext(<MonProfil />);

    fireEvent.click(screen.getByText(/Se déconnecter/i));

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows loading state when form is submitted', async () => {
    axios.put.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    renderWithContext(<MonProfil />);

    await act(async () => {
      fireEvent.click(screen.getByText(/Mettre à jour/i));
    });

    expect(screen.getByText(/Mise à jour.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mise à jour.../i })).toBeDisabled();
  });
});