// 'use client';

import { useEffect, useState } from 'react';
import { Card, LineChart, List, ListItem } from '@tremor/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const data = [
  { date: 'Jan 26', Competency: 58, 'Learning path': 15, 'Assessment score': 62 },
  { date: 'Feb 26', Competency: 61, 'Learning path': 25, 'Assessment score': 65 },
  { date: 'Mar 26', Competency: 63, 'Learning path': 33, 'Assessment score': 67 },
  { date: 'Apr 26', Competency: 67, 'Learning path': 41, 'Assessment score': 70 },
  { date: 'May 26', Competency: 70, 'Learning path': 50, 'Assessment score': 74 },
  { date: 'Jun 26', Competency: 74, 'Learning path': 59, 'Assessment score': 78 },
  { date: 'Jul 26', Competency: 81, 'Learning path': 68, 'Assessment score': 81 },
];

const summary = [
  { name: 'Competency', value: 81 },
  { name: 'Learning path', value: 68 },
  { name: 'Assessment score', value: 81 },
];

const valueFormatter = (number) => `${number}%`;

const statusColor = {
  Competency: { light: 'bg-blue-600', dark: 'bg-cyan-500' },
  'Learning path': { light: 'bg-teal-600', dark: 'bg-lime-500' },
  'Assessment score': { light: 'bg-violet-600', dark: 'bg-pink-500' },
};

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

  return (
    <>
      <Card
        className="sm:mx-auto sm:max-w-md border-0 ring-0 rounded-2xl shadow-none"
        style={{
          background: isDark ? '#101d2d' : '#fff',
          color: isDark ? '#edf5ff' : '#19365b',
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#edf5ff' : '#19365b' }}>
          Learner progress by month
        </h3>
        <LineChart
          data={data}
          index="date"
          categories={['Competency', 'Learning path', 'Assessment score']}
          colors={isDark ? ['cyan', 'lime', 'pink'] : ['blue', 'teal', 'violet']}
          valueFormatter={valueFormatter}
          showLegend={false}
          showYAxis={false}
          startEndOnly={true}
          className="progress-trend-chart mt-6 h-32"
        />
        <List className="mt-2" style={{ color: isDark ? '#d7e4f3' : '#52677f' }}>
          {summary.map((item) => (
            <ListItem key={item.name}>
              <div className="flex items-center space-x-2">
                <span
                  className={classNames(statusColor[item.name][isDark ? 'dark' : 'light'], 'h-0.5 w-3')}
                  aria-hidden={true}
                />
                <span style={{ color: isDark ? '#d7e4f3' : '#52677f' }}>{item.name}</span>
              </div>
              <span style={{ color: isDark ? '#f1f6fc' : '#19365b', fontWeight: 600 }}>
                {valueFormatter(item.value)}
              </span>
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
}
