import { useEffect } from 'react';
import { toast } from 'sonner';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationToast = () => {
  const { newNotification } = useNotifications();

  useEffect(() => {
    if (newNotification) {
      toast.info(newNotification.message, {
        description: newNotification.title,
        duration: 5000,
      });
    }
  }, [newNotification]);

  return null;
};

export default NotificationToast;
