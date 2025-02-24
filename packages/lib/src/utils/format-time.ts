export function formatTime(seconds: number | string): string {
  const s = typeof(seconds) === "number" ? seconds : parseInt(seconds);
  const minutes = Math.floor(s / 60);
  const remainingSeconds = s % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function toSeconds({ minutes, seconds }: { minutes: number; seconds: number }): number {
  return minutes * 60 + seconds;
}

export function splitTime(seconds: number | string): { minutes: number; seconds: number } {
  const s = typeof(seconds) === "number" ? seconds : parseInt(seconds);
  return {
    minutes: Math.floor(s / 60),
    seconds: s % 60,
  };
}