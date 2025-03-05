export function formatTimeSpan(seconds: number | string): string {
  const s = typeof(seconds) === "number" ? seconds : parseInt(seconds);
  const minutes = Math.floor(s / 60);
  const remainingSeconds = s % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function formatTime(seconds: number | string, skipSeconds: boolean = false): string {
  const s = typeof(seconds) === "number" ? seconds : parseInt(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const t = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const d = new Date(`1970-01-01T${t}Z`);
  const formattedTime = d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: skipSeconds ? undefined : 'numeric',
  });

  return formattedTime;
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

export function formatTimeForInput(seconds?: number | string): string {
  const totalSeconds = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;
  if (typeof totalSeconds === 'undefined' || isNaN(totalSeconds) || totalSeconds < 0) {
    return "00:00";
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (num: number) => num < 10 ? `0${num}` : num.toString();
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

export function parseFullTime(value: string): number | undefined {
  const parts = value.trim().split(':');
  if (parts.length !== 2 && parts.length !== 3) {
    return undefined;
  }
  const numbers = parts.map(part => parseInt(part, 10));
    if (numbers.some(num => isNaN(num))) {
    return undefined;
  }
  if (parts.length === 2) {
    const [minutes, seconds] = numbers;
    return minutes * 60 + seconds;
  } else { // parts.length === 3
    const [hours, minutes, seconds] = numbers;
    return hours * 3600 + minutes * 60 + seconds;
  }
}