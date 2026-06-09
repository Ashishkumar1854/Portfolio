import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex bg-bg-primary" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto pt-4 pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
