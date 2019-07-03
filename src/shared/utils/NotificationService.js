import { NotificationManager } from 'react-notifications';

class NotificationService {

    info(msg, title) {
        NotificationManager.info(msg, title);
    }

    error(msg, title) {
        NotificationManager.error(msg, title);
    }

    success(msg, title) {
        NotificationManager.success(msg, title);
    }

    warning(msg, title) {
        NotificationManager.warning(msg, title);
    }
}

export default new NotificationService();