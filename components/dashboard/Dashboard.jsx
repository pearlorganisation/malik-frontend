
import React from 'react';

const DashboardUI = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Marhaba, Khalid! 👋</h1>
        <p className="text-slate-500 mt-2 text-lg">Experience the pinnacle of Dubai luxury with your personalized travel hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Bookings', value: '03', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { label: 'Total Experiences', value: '12', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
          { label: 'Loyalty Points', value: '2.5k', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="p-3 bg-slate-50 text-[#c5a059] rounded-2xl w-fit mb-6 group-hover:bg-[#c5a059] group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DashboardUI;
