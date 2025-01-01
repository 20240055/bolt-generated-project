import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cross, Heart, LogOut, Plus } from 'lucide-react';
import { useAuth } from './AuthContext';
import { signOut } from '../lib/auth';

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Cross className="h-8 w-8" />
            <span className="text-2xl font-serif">Bestattung Patzalt</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-300">Startseite</Link>
            {user && (
              <Link 
                to="/parten/erstellen" 
                className="flex items-center space-x-1 hover:text-gray-300"
              >
                <Plus className="h-5 w-5" />
                <span>Parte erstellen</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 hover:text-gray-300"
              >
                <LogOut className="h-5 w-5" />
                <span>Abmelden</span>
              </button>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 hover:text-gray-300">
                <Heart className="h-5 w-5" />
                <span>Anmelden</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
