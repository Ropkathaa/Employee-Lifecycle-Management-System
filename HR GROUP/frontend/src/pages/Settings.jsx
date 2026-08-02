import React from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { FiSettings } from 'react-icons/fi';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Settings Page"
        breadcrumbs={[{ label: 'Settings', path: '/settings' }]}
      />

      {/* Grid: System Settings + Organization Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card title="System Settings" subtitle="Global configuration settings" className="lg:col-span-2">
          <div className="space-y-4 max-w-lg">
            <Input label="Organization Name" placeholder="e.g. Acme Corp" defaultValue="Acme HR Corp" />
            <Input label="Support Email" type="email" placeholder="e.g. support@acme.com" defaultValue="hr-admin@acme.com" />
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="email-notif" className="h-4 w-4 text-primary focus:ring-primary border-border rounded" defaultChecked />
              <label htmlFor="email-notif" className="text-xs text-slate-600 dark:text-slate-400">
                Trigger email alerts automatically on employee profile setups
              </label>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={() => console.log('Save settings')}>
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>

        {/* System Meta details */}
        <Card title="Build Metadata" subtitle="Release specifications">
          <div className="space-y-4 text-xs">
            <p className="text-slate-500 leading-relaxed">
              Details on running instances and platform build versions:
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-slate-400">Environment</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Development</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-slate-400">React Core</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">v18.3.1</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-slate-400">Vite Bundler</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">v5.3.0</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span className="text-slate-400">Tailwind Engine</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">v3.4.0</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
