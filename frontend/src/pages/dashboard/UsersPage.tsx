import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { User, UserRole } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { parseApiError } from '../../api/config';
import { Users, UserPlus, Shield, Mail, Trash2, Edit } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  // Create form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('ZONE_ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await adminApi.createUser({ name, email, password, role });
      toast.success(`User ${created.name} provisioned successfully`);
      setUsers((prev) => [...prev, created]);
      setIsCreateModalOpen(false);
      setName('');
      setEmail('');
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(`Failed to create user: ${parsed.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteUser(userToDelete.id);
      toast.success(`User ${userToDelete.name} removed from registry staff`);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(`Delete failed: ${parsed.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-black text-2xl md:text-3xl text-stone-900">
            Heritage Platform User Management
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Provision and audit credentials for Central Admins, Regional Officers, Zonal Registrars, and Philologists.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Staff</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadUsers} />}

      {loading ? (
        <LoadingSpinner label="Auditing user accounts..." />
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Staff Name</th>
                  <th className="px-4 py-3.5">Email Address</th>
                  <th className="px-4 py-3.5">Assigned Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0C3823] text-[#D4AF37] flex items-center justify-center text-xs font-bold shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-4 py-4 text-stone-600">{u.email}</td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-[#0C3823]/10 text-[#0C3823] uppercase">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Deactivate account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision Authorized Staff Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Staff Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Abebe Bikila"
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@wemezekr.gov.et"
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Initial Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Role Authority Level
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-300 bg-stone-50 focus:ring-2 focus:ring-[#0C3823] focus:outline-none"
            >
              <option value="ZONE_ADMIN">ZONE_ADMIN – Zonal Field Registrar</option>
              <option value="REGIONAL_ADMIN">REGIONAL_ADMIN – Regional Bureau Head</option>
              <option value="RESEARCHER">RESEARCHER – Academic Scholar / Philologist</option>
              <option value="ADMIN">ADMIN – Central National Administrator</option>
              <option value="PUBLIC">PUBLIC – Standard Public User</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#0C3823] text-white text-xs font-bold hover:bg-[#124f33] transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Provisioning...' : 'Provision User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Revoke Staff Credentials"
        message={`Are you sure you want to deactivate and remove ${userToDelete?.name} (${userToDelete?.email})? This staff member will no longer have access to the heritage registry.`}
        confirmLabel="Revoke Credentials"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
