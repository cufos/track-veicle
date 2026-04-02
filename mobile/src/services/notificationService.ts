import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Maintenance } from '../models/types';
import { getMaintenanceStatus } from '../utils/dateUtils';

const LAST_NOTIFICATION_KEY = 'LAST_NOTIFICATION_DATE';

export const notificationService = {
  async checkAndNotify(
    maintenances: Maintenance[],
    reminderDays: number
  ) {
    const today = new Date().toISOString().split('T')[0];
    const lastNotified = await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);

    // Prevent multiple alerts in the same day
    if (lastNotified === today) return;

    const upcoming = maintenances.filter((m) => {
      const status = getMaintenanceStatus(m.dueDate, reminderDays);
      return status === 'upcoming';
    });

    if (upcoming.length > 0) {
      const message = upcoming
        .map((m) => `${m.title} (vence ${m.dueDate})`)
        .join('\n');

      Alert.alert(
        'Recordatorio de mantenimiento',
        message
      );

      await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, today);
    }
  },
};
