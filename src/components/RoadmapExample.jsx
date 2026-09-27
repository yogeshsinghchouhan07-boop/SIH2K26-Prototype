import React, { useEffect, useState, useCallback } from 'react';
import RoadmapCanvas from './RoadmapCanvas';

/**
 * Example page showing RoadmapCanvas wired to a backend.
 * Swap the fetch URLs for your real API routes.
 */
export default function RoadmapExample() {
  const [nodes, setNodes] = useState([]);

  const loadRoadmap = useCallback(async () => {
    // const res = await fetch('/api/roadmap');
    // const rows = await res.json();
    const rows = SAMPLE_ROWS; // ← replace with the line above
    setNodes(rows);
  }, []);

  useEffect(() => {
    loadRoadmap();
    // Poll (or better: subscribe over WebSocket/SSE) so the board reflects
    // status changes made elsewhere — e.g. a worker marking a task "done".
    const interval = setInterval(loadRoadmap, 5000);
    return () => clearInterval(interval);
  }, [loadRoadmap]);

  const handleUpdate = (id, patch) => {
    // fetch(`/api/roadmap/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify(patch) });
    console.log('node-update', id, patch);
  };
  const handleMove = (id, x, y) => {
    // fetch(`/api/roadmap/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ x, y }) });
    console.log('node-move', id, x, y);
  };
  const handleAdd = (node) => {
    // fetch('/api/roadmap', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(node) });
    console.log('node-add', node);
  };
  const handleDelete = (id) => {
    // fetch(`/api/roadmap/${id}`, { method: 'DELETE' });
    console.log('node-delete', id);
  };

  return (
    <div style={{ padding: 24, background: '#08090c', minHeight: '100vh' }}>
      <h1 style={{ color: '#e7e9ee', fontSize: 19, marginBottom: 4 }}>Roadmap</h1>
      <p style={{ color: '#8b8f9a', fontSize: 13.5, marginBottom: 20 }}>
        Drag a card, double-click a title or description to edit it, click a
        status dot to cycle its status, or click "+ Add step".
      </p>
      <RoadmapCanvas
        nodes={nodes}
        editable
        height={560}
        onNodeUpdate={handleUpdate}
        onNodeMove={handleMove}
        onNodeAdd={handleAdd}
        onNodeDelete={handleDelete}
      />
    </div>
  );
}

const SAMPLE_ROWS = [
  { id: 'discovery', title: 'Discovery & scoping', subtitle: 'Interviews, competitive scan, success metrics.', status: 'done', dependsOn: [], tag: 'Milestone', assignee: { name: 'Kate', color: '#3ec5f7' } },
  { id: 'schema', title: 'Design database schema', subtitle: 'Tables for users, orders, and inventory.', status: 'done', dependsOn: ['discovery'], assignee: { name: 'Paul', color: '#ffc857' } },
  { id: 'api', title: 'Build core API', subtitle: 'Auth, CRUD endpoints, rate limiting.', status: 'active', dependsOn: ['schema'], assignee: { name: 'Mario', color: '#ff8fa3' } },
  { id: 'ui', title: 'Roadmap UI component', subtitle: 'This exact widget, wired to live data.', status: 'active', dependsOn: ['schema'], tag: 'In progress', assignee: { name: 'Kate', color: '#3ec5f7' } },
  { id: 'billing', title: 'Billing integration', subtitle: 'Stripe subscriptions + invoices.', status: 'pending', dependsOn: ['api'] },
  { id: 'beta', title: 'Private beta', subtitle: 'Invite 25 teams, collect feedback.', status: 'pending', dependsOn: ['api', 'ui'] },
  { id: 'launch', title: 'Public launch', subtitle: 'Announce, monitor, iterate.', status: 'pending', dependsOn: ['billing', 'beta'] },
];
