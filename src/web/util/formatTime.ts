const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const MAX_RELATIVE_TIME = 7 * DAY;

export function formatTimeRelative(time: Date) {
  const relativeTime = Date.now() - time.getTime();
  if (relativeTime > MAX_RELATIVE_TIME) {
    return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`;
  }
  if (relativeTime > 2 * DAY) {
    return `${Math.floor(relativeTime / DAY)} 天前`;
  }
  if (relativeTime > HOUR) {
    return `${Math.floor(relativeTime / HOUR)} 小时前`;
  }
  if (relativeTime > MINUTE) {
    return `${Math.floor(relativeTime / MINUTE)} 分钟前`;
  }
  return `${Math.floor(relativeTime / SECOND)} 秒前`;
}

export function formatDurationCoarse(milliseconds: number) {
  if (milliseconds > 10 * DAY) {
    return ` ${Math.floor(milliseconds / DAY)} 天`;
  } else if (milliseconds > HOUR) {
    const day = Math.floor(milliseconds / DAY);
    const hour = Math.floor((milliseconds % DAY) / HOUR);
    if (hour === 0) {
      return ` ${day} 天`;
    } else {
      return ` ${day} 天 ${hour} 小时`;
    }
  } else {
    return '不到一小时';
  }
}

export function formatTimeSimple(time: Date) {
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ` +
    `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}
