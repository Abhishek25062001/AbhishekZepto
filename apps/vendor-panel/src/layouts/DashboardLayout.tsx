import { Outlet } from 'react-router-dom';

import { Header, PageContainer, Sidebar } from '../components/layout';
import { useVendorRealtimeEvents } from '../modules/realtime-store-operations/hooks/useVendorRealtimeEvents';
import { useVendorRealtimeSocket } from '../modules/realtime-store-operations/hooks/useVendorRealtimeSocket';

export function DashboardLayout() {
  useVendorRealtimeSocket();
  useVendorRealtimeEvents();

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
