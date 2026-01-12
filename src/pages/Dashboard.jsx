import React, { useEffect, useState } from 'react';
import { getDashboard } from '../api/dashboard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getDashboard();
        setStats(res.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard...</div>;
  if (!stats) return <div className="error-state">Failed to load dashboard data.</div>;

  // Transform data for charts
  const statusData = [
    { name: 'Todo', value: stats.status_counts?.todo || 0, color: '#94a3b8' },
    { name: 'In Progress', value: stats.status_counts?.['in-progress'] || 0, color: '#3b82f6' },
    { name: 'Done', value: stats.status_counts?.done || 0, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'Low', value: stats.priority_counts?.low || 0, fill: '#10b981' },
    { name: 'Medium', value: stats.priority_counts?.medium || 0, fill: '#f59e0b' },
    { name: 'High', value: stats.priority_counts?.high || 0, fill: '#ef4444' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Overview of your productivity</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <AssignmentIcon fontSize="large" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Tasks</p>
            <h3 className="stat-value">{stats.total_tasks || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <PendingIcon fontSize="large" />
          </div>
          <div className="stat-info">
            <p className="stat-label">In Progress</p>
            <h3 className="stat-value">{stats.status_counts?.['in-progress'] || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircleIcon fontSize="large" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Completed</p>
            <h3 className="stat-value">{stats.status_counts?.done || 0}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Task Status Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--border-color)', color: 'var(--color-text-main)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Tasks by Priority</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip
                  cursor={{ fill: 'var(--color-bg-input)' }}
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--border-color)', color: 'var(--color-text-main)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;