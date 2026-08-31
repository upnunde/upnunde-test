"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  loadNotificationPreferences,
  NOTIFICATION_PREFERENCE_ITEMS,
  saveNotificationPreferences,
  type NotificationPreferenceId,
  type NotificationPreferences,
} from "@/lib/notification-preferences";
import { SettingsList, SettingsSwitchRow } from "@/components/profile/settings-rows";

export function ProfileNotificationSettingsView() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES,
  );

  useEffect(() => {
    setPreferences(loadNotificationPreferences());
  }, []);

  const togglePreference = (id: NotificationPreferenceId, checked: boolean) => {
    setPreferences((prev) => {
      const next = { ...prev, [id]: checked };
      saveNotificationPreferences(next);
      return next;
    });
  };

  return (
    <SettingsList>
      {NOTIFICATION_PREFERENCE_ITEMS.map(({ id, label }) => (
        <SettingsSwitchRow
          key={id}
          label={label}
          checked={preferences[id]}
          onCheckedChange={(checked) => togglePreference(id, checked)}
        />
      ))}
    </SettingsList>
  );
}
