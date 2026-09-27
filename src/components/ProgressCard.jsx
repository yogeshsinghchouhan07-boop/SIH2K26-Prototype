// 'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { date: 'Jan 26', Competency: 58, 'Learning path': 15, 'Assessment score': 62 },
  { date: 'Feb 26', Competency: 61, 'Learning path': 25, 'Assessment score': 65 },
  { date: 'Mar 26', Competency: 63, 'Learning path': 33, 'Assessment score': 67 },
  { date: 'Apr 26', Competency: 67, 'Learning path': 41, 'Assessment score': 70 },
  { date: 'May 26', Competency: 70, 'Learning path': 50, 'Assessment score': 74 },
  { date: 'Jun 26', Competency: 74, 'Learning path': 59, 'Assessment score': 78 },
  { date: 'Jul 26', Competency: 81, 'Learning path': 68, 'Assessment score': 81 },
];

export default function ProgressCard() {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark',
  );

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setIsDark(root.getAttribute('data-theme') === 'dark');
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    updateTheme();
    return () => observer.disconnect();
  }, []);

  const axisColor = isDark ? '#9db3ca' : '#8790a2';
  const gridColor = isDark ? 'rgba(160,183,219,.14)' : '#eef0f5';
  return (
    <div style={{ background: isDark ? '#101d2d' : '#fff', color: isDark ? '#edf5ff' : '#19365b', width: '100%' }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#edf5ff' : '#19365b', margin: '0 0 12px' }}>
        Learner progress by month
      </h3>
      <div style={{ height: 238, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="progressCompetencyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5148d8" stopOpacity={0.18}/><stop offset="100%" stopColor="#5148d8" stopOpacity={0}/></linearGradient>
              <linearGradient id="progressPathFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#20a486" stopOpacity={0.12}/><stop offset="100%" stopColor="#20a486" stopOpacity={0}/></linearGradient>
              <linearGradient id="progressAssessmentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#eda64d" stopOpacity={0.12}/><stop offset="100%" stopColor="#eda64d" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} vertical={false}/>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: axisColor, fontSize: 10 }}/>
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: axisColor, fontSize: 10 }} tickFormatter={(v) => `${v}%`}/>
            <Tooltip formatter={(value) => [`${value}%`]} contentStyle={{ background: isDark ? '#13243a' : '#fff', borderColor: gridColor, borderRadius: 8, color: isDark ? '#edf5ff' : '#19365b' }}/>
            <Legend iconType="circle" wrapperStyle={{ fontSize: 10, color: axisColor }}/>
            <Area type="monotone" dataKey="Competency" stroke="#5148d8" strokeWidth={2.5} fill="url(#progressCompetencyFill)"/>
            <Area type="monotone" dataKey="Learning path" stroke="#20a486" strokeWidth={2} fill="url(#progressPathFill)"/>
            <Area type="monotone" dataKey="Assessment score" stroke="#eda64d" strokeWidth={2} fill="url(#progressAssessmentFill)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
