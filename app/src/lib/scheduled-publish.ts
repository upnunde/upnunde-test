const MIN_SCHEDULE_LEAD_MINUTES = 10;

export function toInputDateValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toInputTimeValue(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
}

/** 예약 공개 기본값: 1시간 뒤, 분은 00 */
export function getDefaultScheduleInputValues(): { date: string; time: string } {
  const next = new Date();
  next.setHours(next.getHours() + 1, 0, 0, 0);
  return {
    date: toInputDateValue(next),
    time: toInputTimeValue(next),
  };
}

export function buildScheduledPublishIso(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function isScheduledPublishValid(date: string, time: string): boolean {
  if (!date || !time) return false;
  const target = new Date(`${date}T${time}:00`);
  if (Number.isNaN(target.getTime())) return false;
  const minLeadMs = MIN_SCHEDULE_LEAD_MINUTES * 60 * 1000;
  return target.getTime() - Date.now() >= minLeadMs;
}

export const SCHEDULE_MIN_LEAD_MINUTES = MIN_SCHEDULE_LEAD_MINUTES;
