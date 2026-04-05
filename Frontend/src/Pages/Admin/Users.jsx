import React from "react";
import { FiShield, FiTrash2 } from "react-icons/fi";
import { SectionHeader } from "./AdminComponents";
import { adminApi } from "../../services/api";

const Users = ({ users, adminToken, handleAction }) => {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <SectionHeader title="User Directory" subtitle="Manage customer accounts and access levels" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <div key={user.id} className="group relative rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/[0.08]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-2xl text-white shadow-lg">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white">{user.fullName}</h4>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${user.isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                {user.isBlocked ? "Restricted" : "Active Member"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(() => adminApi.toggleUserBlock(adminToken, user.id, { isBlocked: !user.isBlocked }), user.isBlocked ? "Unblocked" : "Blocked")}
                  className={`p-2 rounded-xl transition-all ${user.isBlocked ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white'}`}
                  title={user.isBlocked ? "Unblock" : "Block"}
                >
                  <FiShield />
                </button>
                <button
                  onClick={() => handleAction(() => adminApi.deleteUser(adminToken, user.id), "Deleted")}
                  className="p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
