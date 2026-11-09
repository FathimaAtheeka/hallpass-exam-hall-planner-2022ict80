export const DEPARTMENTS = ['Computer Science', 'Engineering', 'Management', 'Science', 'Law'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const pad = (n) => String(n).padStart(2, '0');

export function localISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysLeft(iso) {
  return Math.round((parseISO(iso) - parseISO(localISO(0))) / 86400000);
}

export function isValidDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(y, m - 1, d);
  return t.getFullYear() === y && t.getMonth() === m - 1 && t.getDate() === d;
}

export const isValidTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

export function countdownLabel(d) {
  if (d < 0) return 'Done';
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  return `${d} days`;
}

export function countdownColor(d) {
  if (d < 0) return '#9A98B5';
  if (d === 0) return '#E5484D';
  if (d <= 3) return '#F59E0B';
  return '#18A47A';
}

export const dayNum = (iso) => pad(parseISO(iso).getDate());
export const monthShort = (iso) => MONTHS[parseISO(iso).getMonth()].toUpperCase();

export function formatDate(iso) {
  const d = parseISO(iso);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${ap}`;
}

export function endTime(t, minutes) {
  const [h, m] = t.split(':').map(Number);
  const total = h * 60 + m + Number(minutes);
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}
