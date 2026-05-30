import type { InAppNotification } from '../../../shared/api';
import { NotificationList } from './NotificationList';

export const NotificationDropdown = ({
  isOpen,
  notifications,
  onClickNotification,
  onMarkAllRead,
  onViewAll,
}: {
  isOpen: boolean;
  notifications: InAppNotification[];
  onClickNotification?: (notification: InAppNotification) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <section aria-label="Notifications">
      <NotificationList notifications={notifications} onClickNotification={onClickNotification} />
      <button onClick={onMarkAllRead} type="button">
        Mark all read
      </button>
      <button onClick={onViewAll} type="button">
        View all
      </button>
    </section>
  );
};
