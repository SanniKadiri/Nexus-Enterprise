
import React, { useState, useEffect } from 'react';
import { User, Role, Tenant, AuditLog } from '../types';
import { mockDb } from '../services/mockDb';
import { Button, Card, Badge, Modal, Input, Select, SlideOver } from '../components/UI';
import { Restricted } from '../components/Restricted';
import { Plus, MoreVertical, Shield, Mail, Clock, Trash2, Search, Filter } from 'lucide-react';

interface TeamViewProps {
  activeTenant: Tenant;
  currentUser: User;
}

export const TeamView: React.FC<TeamViewProps> = ({ activeTenant, currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // For SlideOver
  const [userLogs, setUserLogs] = useState<AuditLog[]>([]);

  // Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('VIEWER');

  useEffect(() => {
    loadUsers();
  }, [activeTenant.id]);

  useEffect(() => {
    if (selectedUser) {
       loadUserLogs(selectedUser.id);
    } else {
       setUserLogs([]);
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    setLoading(true);
    const data = await mockDb.getUsers(activeTenant.id);
    setUsers(data);
    setLoading(false);
  };

  const loadUserLogs = async (userId: string) => {
    // In a real app, we might have a specific getUserLogs method, but we can filter the main logs for now
    const allLogs = await mockDb.getAuditLogs(activeTenant.id);
    setUserLogs(allLogs.filter(l => l.userId === userId));
  };

  const handleInvite = async () => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      tenantId: activeTenant.id,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'active',
      lastActive: Date.now()
    };
    await mockDb.addUser(newUser);
    await loadUsers();
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleRemoveUser = async (userId: string) => {
    if (confirm('Are you sure you want to revoke access for this user?')) {
       await mockDb.removeUser(userId);
       await loadUsers();
       setSelectedUser(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Team Directory</h1>
          <p className="text-gray-500 font-mono text-sm">MANAGE ACCESS AND ROLES FOR {activeTenant.name.toUpperCase()}</p>
        </div>
        <Restricted to={['OWNER', 'ADMIN']} user={currentUser}>
          <Button withIcon onClick={() => setShowInviteModal(true)}>
            <Plus size={16} className="mr-2" />
            INVITE MEMBER
          </Button>
        </Restricted>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none font-bold text-sm" placeholder="SEARCH TEAM..." />
         </div>
         <Button variant="outline" withIcon>
            <Filter size={16} className="mr-2" /> FILTER
         </Button>
      </div>

      {/* Data Table */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-gray-50 border-b-2 border-black text-xs font-black uppercase tracking-wider">
               <tr>
                 <th className="p-4">User</th>
                 <th className="p-4">Role</th>
                 <th className="p-4">Status</th>
                 <th className="p-4">Last Active</th>
                 <th className="p-4 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {users.map(user => (
                 <tr 
                   key={user.id} 
                   className="hover:bg-brand-yellow/10 transition-colors cursor-pointer group"
                   onClick={() => setSelectedUser(user)}
                 >
                   <td className="p-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-sm border-2 border-transparent group-hover:border-black group-hover:bg-brand-yellow group-hover:text-black transition-all">
                          {user.name.charAt(0)}
                       </div>
                       <div>
                         <div className="font-bold text-sm">{user.name}</div>
                         <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                       </div>
                     </div>
                   </td>
                   <td className="p-4">
                      <Badge variant="neutral">{user.role}</Badge>
                   </td>
                   <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase">
                         <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                         {user.status}
                      </div>
                   </td>
                   <td className="p-4 text-xs font-mono text-gray-500">
                      {new Date(user.lastActive).toLocaleDateString()}
                   </td>
                   <td className="p-4 text-right">
                      <button className="p-2 hover:bg-black hover:text-white transition-colors">
                         <MoreVertical size={16} />
                      </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

      {/* Invite Modal */}
      <Modal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
        title="Invite Team Member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!inviteName || !inviteEmail}>Send Invite</Button>
          </>
        }
      >
         <div className="space-y-4">
            <Input label="Full Name" value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="e.g. Sarah Connor" />
            <Input label="Email Address" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="sarah@example.com" />
            <Select 
               label="Role" 
               value={inviteRole} 
               onChange={e => setInviteRole(e.target.value as Role)}
               options={[
                 { value: 'VIEWER', label: 'Viewer (Read Only)' },
                 { value: 'EDITOR', label: 'Editor (Can Edit Content)' },
                 { value: 'ADMIN', label: 'Admin (Full Access)' },
                 { value: 'OWNER', label: 'Owner' }
               ]}
            />
            <div className="bg-blue-50 p-3 border border-blue-200 text-xs text-blue-800">
               <p className="font-bold mb-1">Access Level:</p>
               <p>Admins can manage users and billing. Editors can only modify dashboard layouts and data.</p>
            </div>
         </div>
      </Modal>

      {/* User Profile SlideOver */}
      <SlideOver
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Profile"
        actions={
          <Restricted to={['OWNER', 'ADMIN']} user={currentUser}>
             {selectedUser?.id !== currentUser.id && (
               <Button variant="danger" className="w-full" onClick={() => selectedUser && handleRemoveUser(selectedUser.id)}>
                  <Trash2 size={16} className="mr-2" /> Revoke Access
               </Button>
             )}
          </Restricted>
        }
      >
         {selectedUser && (
           <div className="space-y-8">
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-black text-white text-4xl font-black flex items-center justify-center mb-4 shadow-[6px_6px_0px_0px_#FFD600]">
                    {selectedUser.name.charAt(0)}
                 </div>
                 <h2 className="text-2xl font-bold uppercase">{selectedUser.name}</h2>
                 <p className="text-gray-500 font-mono">{selectedUser.email}</p>
              </div>

              <div className="space-y-4">
                 <div className="bg-white p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-gray-400 uppercase text-xs font-bold tracking-wider">
                       <Shield size={14} /> Role
                    </div>
                    <div className="font-black text-lg">{selectedUser.role}</div>
                 </div>

                 <div className="bg-white p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-gray-400 uppercase text-xs font-bold tracking-wider">
                       <Clock size={14} /> Last Active
                    </div>
                    <div className="font-mono">{new Date(selectedUser.lastActive).toLocaleString()}</div>
                 </div>
              </div>

              <div className="border-t-2 border-black pt-6">
                 <h4 className="font-bold uppercase mb-4">Activity Log</h4>
                 <div className="space-y-4 relative border-l border-gray-300 ml-2">
                    {userLogs.length === 0 ? (
                        <div className="pl-6 text-gray-400 text-sm italic">No recent activity recorded.</div>
                    ) : (
                      userLogs.map((log) => (
                         <div key={log.id} className="pl-6 relative">
                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-brand-yellow border border-black rounded-full"></div>
                            <div className="text-xs font-bold">{log.details}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{new Date(log.timestamp).toLocaleString()}</div>
                         </div>
                      ))
                    )}
                 </div>
              </div>
           </div>
         )}
      </SlideOver>
    </div>
  );
};
