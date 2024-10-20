import { css, cx } from "@emotion/css";
import type { Day } from "./types.ts";

export default function CalendarView({
  month,
  year,
  days,
  onDayClick = () => {
    /*noop*/
  },
  onDayHover = () => {
    /*noop*/
  },
  selectedDays,
  hoverDays,
}: {
  month: number;
  year: number;
  days: Array<Array<number | null>>;
  onDayClick?: (day: Day) => void;
  onDayHover?: (day: Day) => void;
  selectedDays?: Day[];
  hoverDays?: Day[];
}) {
  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;
  const monthName = new Date(2024, month, 1).toLocaleString("default", {
    month: "long",
  });
  const isSelected = (day: number) =>
    !!selectedDays?.find(
      (d) => d.year === year && d.month === month && d.day === day
    );

  const isBetweenHovered = (day: number) => {
    if (hoverDays?.length !== 2) return false;
    const interval = hoverDays.map((d) => new Date(d.year, d.month, d.day));
    const date = new Date(year, month, day);
    return (
      interval[0].getTime() <= date.getTime() &&
      interval[1].getTime() >= date.getTime()
    );
  };

  const isBetweenSelected = (day: number) => {
    if (selectedDays?.length !== 2) return false;
    const interval = selectedDays.map((d) => new Date(d.year, d.month, d.day));
    const date = new Date(year, month, day);
    return (
      interval[0].getTime() <= date.getTime() &&
      interval[1].getTime() >= date.getTime()
    );
  };

  const isFirstSelected = (day: number) => {
    if (!selectedDays?.length) return false;
    const d = selectedDays[0];
    return d.year === year && d.month === month && d.day === day;
  };

  const isLastSelected = (day: number) => {
    if (selectedDays?.length !== 2) return false;
    const d = selectedDays[1];
    return d.year === year && d.month === month && d.day === day;
  };

  const isFirstHovered = (day: number) => {
    if (!hoverDays?.length) return false;
    const d = hoverDays[0];
    return d.year === year && d.month === month && d.day === day;
  };

  const isLastHovered = (day: number) => {
    if (!hoverDays?.length) return false;
    const d = hoverDays[1];
    return d.year === year && d.month === month && d.day === day;
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        {monthName}, {year}
      </header>
      <table cellpadding={0} cellspacing={0}>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {days.map((row) => (
            <tr>
              {row.map((day) => (
                <td>
                  {!!day && (
                    <button
                      className={cx(
                        styles.day,
                        isBetweenSelected(day) && styles.hovered,
                        isFirstSelected(day) && styles.isFirstSelected,
                        isLastSelected(day) && styles.isLastSelected,
                        isBetweenHovered(day) && styles.hovered,
                        isFirstHovered(day) && styles.isFirstSelected,
                        isLastHovered(day) && styles.isLastSelected
                      )}
                      onClick={() => onDayClick({ day, month, year })}
                      onMouseOver={() => onDayHover({ day, month, year })}
                      onFocus={() => onDayHover({ day, month, year })}
                    >
                      <span
                        className={cx(
                          styles.day,
                          isToday(day) && styles.today,
                          isSelected(day) && styles.selected
                        )}
                      >
                        {day}
                      </span>
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const styles = {
  wrapper: css({
    width: "min-content",
    table: {
      borderSpacing: 0,
      borderCollapse: "collapse",
      th: {
        fontSize: "1rem",
      },
    },
  }),
  day: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.5rem",
    height: "2.5rem",
    minWidth: "2.5rem",
    minHeight: "2.5rem",
    borderRadius: "0.5rem",
    border: "1px solid transparent",
    background: "transparent",
    padding: 0,
    "&:hover": {
      cursor: "pointer",
      background: "gainsboro",
    },
    color: 'black',
  }),
  today: css({
    borderColor: "black",
    borderStyle: "dashed",
  }),
  selected: css({
    borderColor: "black",
    color: "white",
    background: "black",
    "&:hover": {
      background: "black",
    },
  }),
  header: css({
    textAlign: "center",
  }),
  hovered: css({
    background: "pink",
    borderRadius: 0,
  }),
  isFirstSelected: css({
    borderTopLeftRadius: "0.5rem",
    borderBottomLeftRadius: "0.5rem",
  }),
  isLastSelected: css({
    borderTopRightRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
  }),
};
