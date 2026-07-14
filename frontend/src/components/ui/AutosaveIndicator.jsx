import React from 'react';

export default function AutosaveIndicator({ saved }) {
  return (
    <div className={`fixed right-6 top-24 z-50 transition-opacity ${saved ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="rounded-full bg-emerald-500/90 px-3 py-2 text-sm font-medium text-white shadow">Draft saved</div>
    </div>
  );
}
