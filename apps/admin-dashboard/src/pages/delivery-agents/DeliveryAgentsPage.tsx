import { EmptyState, Table, type TableColumn } from '../../components/common';

type DeliveryAgentRow = {
  id: string;
  status: string;
};

const columns: TableColumn<DeliveryAgentRow>[] = [
  { header: 'Agent ID', key: 'id' },
  { header: 'Status', key: 'status' },
];

const rows: DeliveryAgentRow[] = [];

export function DeliveryAgentsPage() {
  return (
    <>
      <h1>Delivery Agents</h1>
      <Table columns={columns} data={rows} emptyMessage="No delivery agents yet." rowKey="id" />
      {rows.length === 0 ? (
        <EmptyState
          description="Delivery agent data will be added in the delivery operations module."
          title="No delivery agents yet"
        />
      ) : null}
    </>
  );
}
