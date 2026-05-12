import { Outlet } from 'react-router-dom';

import { Header, PageContainer, Sidebar } from '../components/layout';

export function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
