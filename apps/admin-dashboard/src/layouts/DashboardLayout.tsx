import { Outlet } from 'react-router-dom';

import { Header, PageContainer, Sidebar } from '../components/layout';
import { useAdminRealtimeEvents } from '../modules/realtime-control-tower/hooks/useAdminRealtimeEvents';
import { useAdminRealtimeSocket } from '../modules/realtime-control-tower/hooks/useAdminRealtimeSocket';

export function DashboardLayout() {
  useAdminRealtimeSocket();
  useAdminRealtimeEvents();

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
