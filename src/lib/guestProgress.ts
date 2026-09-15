export const GUEST_COMPLETED_KEY = "ferbe_guest_completed_lessons";
export const GUEST_PROGRESS_EVENT = "ferbe_guest_progress_change";

export function markGuestLessonCompleted(lessonId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getGuestCompletedLessonIds();
    if (!list.includes(lessonId)) {
      list.push(lessonId);
      localStorage.setItem(GUEST_COMPLETED_KEY, JSON.stringify(list));
      window.dispatchEvent(
        new CustomEvent(GUEST_PROGRESS_EVENT, { detail: lessonId })
      );
    }
  } catch {
    // ignore storage quota errors
  }
}

export function getGuestCompletedLessonIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_COMPLETED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
