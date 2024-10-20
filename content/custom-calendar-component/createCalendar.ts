export default function createCalendar({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const days: Array<Array<number | null>> = [];
  const firstDay = new Date(year, month, 1);
  days.push(new Array(firstDay.getDay()).fill(null));
  const lastDay = new Date(year, month + 1, 0);
  for (let i = 1; i <= lastDay.getDate(); i++) {
    if (days[days.length - 1].length === 7) days.push([]);
    days[days.length - 1].push(i);
  }
  while (days[days.length - 1].length < 7) {
    days[days.length - 1].push(null);
  }
  return days;
}
