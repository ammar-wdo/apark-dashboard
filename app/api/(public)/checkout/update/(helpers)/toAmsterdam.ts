import { utcToZonedTime } from 'date-fns-tz';

export function getCurrentDateInNetherlands() {
  const timeZone = 'Europe/Amsterdam';
  const nowUtc = new Date();
  const nowInNetherlands = utcToZonedTime(nowUtc, timeZone);
  return nowInNetherlands;
}