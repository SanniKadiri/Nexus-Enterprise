
import React, { useState, useEffect } from 'react';
import { Card, Input, Switch, Select, Button, Tabs, Badge } from '../components/UI';
import { Save, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Tenant, User, AuditLog } from '../types';
import { mockDb } from '../services/mockDb';

interface SettingsProps {
  activeTenant: Tenant;
  currentUser: User;
}

export const Settings: React.FC<SettingsProps> = ({ activeTenant, currentUser }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [apiKey, setApiKey] = useState('sk_test_51Nxxxxxxxxxxxxxxxxx');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'api', label: 'API Keys' },
    { id: 'billing', label: 'Billing' },
  ];

  useEffect(() => {
    if (activeTab === 'security') {
      fetchAuditLogs();
    }
  }, [activeTab, activeTenant.id]);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    const logs = await mockDb.getAuditLogs(activeTenant.id);
    setAuditLogs(logs);
    setLoadingLogs(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Settings</h1>
          <p className="text-gray-500 font-mono text-sm">MANAGE YOUR WORKSPACE CONFIGURATION</p>
        </div>
        <Button variant="primary" withIcon>
          <Save size={16} className="mr-2" />
          SAVE CHANGES
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card title="Workspace Profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Workspace Name" defaultValue={activeTenant.name} />
              <Input label="Support Email" defaultValue={`support@${activeTenant.name.toLowerCase().replace(/\s/g, '')}.com`} />
              <Select 
                label="Default Language" 
                options={[
                  { value: 'en', label: 'English (US)' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' }
                ]} 
              />
              <Select 
                label="Timezone" 
                options={[
                  { value: 'utc', label: 'UTC' },
                  { value: 'pst', label: 'Pacific Time (PST)' },
                  { value: 'est', label: 'Eastern Time (EST)' }
                ]} 
              />
            </div>
          </Card>

          <Card title="Preferences">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50">
                <div>
                  <div className="font-bold text-sm uppercase">Email Notifications</div>
                  <div className="text-xs text-gray-500">Receive daily summaries and alerts</div>
                </div>
                <Switch checked={notifications} onChange={setNotifications} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card title="Access Control">
             <div className="flex items-center justify-between p-4 border border-gray-200 bg-gray-50 mb-4">
                <div>
                  <div className="font-bold text-sm uppercase">Two-Factor Authentication (2FA)</div>
                  <div className="text-xs text-gray-500">Require 2FA for all workspace members</div>
                </div>
                <Switch checked={twoFactor} onChange={setTwoFactor} />
              </div>
              <Button variant="outline" className="w-full">MANAGE SSO SETTINGS</Button>
          </Card>

          <Card title="Audit Log" className="!p-0 overflow-hidden" 
             action={
               <Button variant="ghost" size="sm" onClick={fetchAuditLogs}>
                 <RefreshCw size={14} className={loadingLogs ? 'animate-spin' : ''} />
               </Button>
             }>
             <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs font-bold uppercase border-b-2 border-black sticky top-0 z-10">
                    <tr>
                      <th className="p-4">Action</th>
                      <th className="p-4">Details</th>
                      <th className="p-4">User</th>
                      <th className="p-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loadingLogs && auditLogs.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading audit trail...</td></tr>
                    ) : auditLogs.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">No logs found.</td></tr>
                    ) : (
                      auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="p-4 font-bold font-mono text-xs">{log.action}</td>
                          <td className="p-4">{log.details}</td>
                          <td className="p-4 text-xs text-gray-500 uppercase">{log.userId}</td>
                          <td className="p-4 text-right text-xs font-mono text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
          </Card>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-6">
           <Card title="API Configuration">
             <div className="bg-black text-white p-4 font-mono text-sm mb-6 relative group">
                {apiKey}
                <button className="absolute top-2 right-2 bg-brand-yellow text-black text-xs px-2 py-1 font-bold opacity-0 group-hover:opacity-100 transition-opacity">COPY</button>
             </div>
             <div className="flex gap-4">
               <Button variant="primary">ROLL KEY</Button>
               <Button variant="outline">CREATE NEW TOKEN</Button>
             </div>
           </Card>
           
           <div className="border-l-4 border-brand-yellow bg-yellow-50 p-4">
             <div className="flex gap-2 font-bold text-yellow-800 uppercase mb-1">
               <AlertTriangle size={16} />
               <span>Warning</span>
             </div>
             <p className="text-sm text-yellow-800">Rolling your API key will immediately invalidate all existing integrations using the current key.</p>
           </div>
        </div>
      )}
    </div>
  );
};
