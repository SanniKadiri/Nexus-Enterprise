
import React, { useState } from 'react';
import { Landing } from './views/Landing';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.LANDING);

  const navigate = (view: ViewMode) => {
    // Basic scroll reset
    window.scrollTo(0, 0);
    setCurrentView(view);
  };

  return (
    <div className="antialiased text-brand-black">
      {currentView === ViewMode.LANDING && (
        <Landing onLogin={() => navigate(ViewMode.LOGIN)} />
      )}
      
      {currentView === ViewMode.LOGIN && (
        <Login onSuccess={() => navigate(ViewMode.DASHBOARD)} />
      )}

      {currentView === ViewMode.DASHBOARD && (
        <Dashboard onLogout={() => navigate(ViewMode.LANDING)} />
      )}
    </div>
  );
};

export default App;
