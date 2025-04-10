// C:\Users\z270\ZephyrApp\src\__tests__\NavBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../components/Common/NavBar/NavBar';
import { AuthContext } from '../context/AuthContext'; // Utilisation du AuthContext directement

jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
  },
}));

describe('NavBar Component', () => {
  const renderWithAuth = (user, initialRoute = '/') => {
    render(
      <AuthContext.Provider value={{ user, logout: jest.fn() }}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <NavBar />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    // Simuler localStorage pour chaque test
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'user') {
        return JSON.stringify({ name: 'John Doe' });
      }
      return null;
    });

    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  test('renders correctly for unauthenticated users', () => {
    renderWithAuth(null);
    expect(screen.getByText(/Accueil/i)).toBeInTheDocument();
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mon Profil/i)).not.toBeInTheDocument();
  });

  test('renders correctly for authenticated users on the home page', () => {
    renderWithAuth({ name: 'John Doe' }, '/');
    expect(screen.getByText(/Accueil/i)).toBeInTheDocument();
    expect(screen.getByText(/Mon Profil/i)).toBeInTheDocument();
    expect(screen.queryByText(/Carte/i)).not.toBeInTheDocument(); // Le bouton Carte ne doit pas apparaître sur la page d'accueil
    expect(screen.getByText(/Se déconnecter/i)).toBeInTheDocument();
  });

  test('renders Carte button when not on the home page', () => {
    renderWithAuth({ name: 'John Doe' }, '/map');
    expect(screen.getByText(/Carte/i)).toBeInTheDocument();
  });

  test('calls logout and shows toast on logout button click', () => {
    const mockLogout = jest.fn();
    render(
      <AuthContext.Provider value={{ user: { name: 'John Doe' }, logout: mockLogout }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByText(/Se déconnecter/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(toast.info).toHaveBeenCalledWith('👋 Déconnexion réussie.');
  });

  test('navigates to the correct page on link click', () => {
    renderWithAuth(null);
    const accueilLink = screen.getByText(/Accueil/i);
    fireEvent.click(accueilLink);
    expect(accueilLink.closest('a')).toHaveAttribute('href', '/');
  });
});
