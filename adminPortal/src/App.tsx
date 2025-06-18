import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ViolationsLog from './components/ViolationsLog';
import SafetyRecords from './components/SafetyRecords';
import WorkerOverview from './components/WorkerOverview';
import AdminSettings from './components/AdminSettings';
import TestViolation from './components/TestViolation';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'violations':
        return <ViolationsLog />;
      case 'records':
        return <SafetyRecords />;
      case 'workers':
        return <WorkerOverview />;
      case 'settings':
        return <AdminSettings />;
      case 'test':
        return <TestViolation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-16">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;