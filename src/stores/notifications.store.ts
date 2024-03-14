import { defineStore } from "pinia";
import { ref } from "vue";
import { Notification } from "@/types";
import { nanoid } from "nanoid";
import { TOAST_DISPLAY_TIME } from "@/config";

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref<Notification[]>([]);

  const notify = (notification: Omit<Notification, "id">) => {
    const newNotification = {
      ...notification,
      id: nanoid(),
    };

    notifications.value.push(newNotification);
    setTimeout(dismiss, TOAST_DISPLAY_TIME, newNotification.id);
  };

  const dismiss = (notificationId: string) => {
    notifications.value = notifications.value.filter(
      (notification: Notification) => notification.id !== notificationId,
    );
  };

  const getAll = (): Notification[] => notifications.value;

  return { notify, dismiss, getAll };
});
