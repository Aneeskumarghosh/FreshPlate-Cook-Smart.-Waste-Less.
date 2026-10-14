import React, { useState } from 'react';
import { X, UserPlus, Users, Link, Copy, Check, Bell, ShieldCheck } from 'lucide-react';
import { FamilyMember, ActivityFeedItem } from '../types';

interface FamilySharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  activities: ActivityFeedItem[];
  onShowToast: (title: string, message?: string) => void;
}

export const FamilySharingModal: React.FC<FamilySharingModalProps> = ({
  isOpen,
  onClose,
  members,
  activities,
  onShowToast,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [syncAlerts, setSyncAlerts] = useState(true);

  if (!isOpen) return null;

  const inviteLink = 'https://freshplate.app/join/kitchen-carlos-782';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
    }
    setInviteCopied(true);
    onShowToast('Invite Link Copied!', 'Anyone with this link can view and update your fridge.');
    setTimeout(() => setInviteCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-100">
        {/* Header */}
        <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h2 className="text-sm font-bold">Kitchen Household Sharing</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
          {/* Summary Banner */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-950">Carlos's Kitchen Clan</p>
              <p className="text-[11px] text-emerald-700">{members.length} members actively tracking groceries</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-700 shadow-2xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Family Members</h3>
            <div className="space-y-1.5">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${member.bgColor}`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {member.name} {member.isCurrentUser && <span className="text-emerald-600">(You)</span>}
                      </p>
                      <p className="text-[10px] text-slate-400">{member.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Kitchen Settings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Shared Sync</h3>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-medium">Broadcast expiry reminders to all</span>
                <input
                  type="checkbox"
                  checked={syncAlerts}
                  onChange={(e) => setSyncAlerts(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Real-time cloud backup enabled for this household</span>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Recent Activity</h3>
            <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-2xs">
              {activities.map((act) => (
                <div key={act.id} className="p-2.5 flex items-center gap-2.5 text-xs">
                  <span className="text-xl shrink-0">{act.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium">
                      <strong>{act.userName}</strong> {act.action}: <span className="text-slate-600">{act.detail}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{act.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* SUB-MODAL: INVITE CODE / LINK */}
      {showInviteModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-slate-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-xl">
              ✉️
            </div>
            <h3 className="text-sm font-bold text-slate-900">Invite Household Member</h3>
            <p className="text-xs text-slate-500 leading-snug">
              Share this private link with your roommates or family members so you can manage groceries together.
            </p>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-600 break-all select-all">
              {inviteLink}
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              {inviteCopied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{inviteCopied ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>

            <button
              onClick={() => setShowInviteModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer pt-1"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
