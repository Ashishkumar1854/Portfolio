import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Shield, User, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const ManageUsers = () => {
  const { data: users, loading } = useApi('/api/auth/users');

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to delete the user "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/api/auth/users/${id}`);
        toast.success(`User ${name} has been deleted`);
        window.location.reload();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to change this user's role to "${newRole}"?`)) {
      try {
        await api.put(`/api/auth/users/${id}/role`, { role: newRole });
        toast.success(`Role updated to ${newRole}`);
        window.location.reload();
      } catch (error) {
        toast.error('Failed to update role');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Users</h1>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">User Profile</th>
                <th className="p-4 font-medium">Email Address</th>
                <th className="p-4 font-medium">System Role</th>
                <th className="p-4 font-medium">Joined Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">Loading registered members...</td>
                </tr>
              ) : users?.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent-blue/10 flex items-center justify-center font-bold text-accent-blue border border-accent-blue/10">
                        {u.avatar || u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary text-sm">{u.name}</div>
                        <div className="text-[10px] text-text-muted font-mono">@{u.username || 'member'}</div>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary text-sm font-mono">{u.email}</td>
                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
                          <Shield size={10} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-bg-primary border border-border-subtle text-text-secondary">
                          <User size={10} /> User
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-mono text-text-secondary">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toggleRole(u._id, u.role)} 
                          className="p-1.5 text-text-muted hover:text-accent-blue transition-colors" 
                          title="Toggle Admin/User Role"
                        >
                          <ShieldAlert size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(u._id, u.name)} 
                          className="p-1.5 text-text-muted hover:text-red-500 transition-colors" 
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageUsers;
