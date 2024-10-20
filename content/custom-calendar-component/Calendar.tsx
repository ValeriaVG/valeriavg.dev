import CalendarView from "./CalendarView.tsx";
import createCalendar from "./createCalendar.ts";
import { useReducer, useEffect } from "hono/jsx";
import { Day } from "./types.ts";

const createDefaultState = (
  selectedDates?: [string] | [string, string]
): CalendarState => {
  const today = selectedDates?.length ? new Date(selectedDates[0]) : new Date();
  const selectedDays = selectedDates?.map((d) => {
    const date = new Date(d);
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isDirty: false,
    };
  }) as [Day] | [Day, Day] | undefined;
  // Mimic one date selected
  if (selectedDays?.length === 1) selectedDays.push(selectedDays[0]);
  return {
    month: today.getMonth(),
    year: today.getFullYear(),
    selectedDays,
    isDirty: false,
  };
};

type CalendarState = {
  month: number;
  year: number;
  selectedDays?: [Day] | [Day, Day];
  hoverDay?: Day;
  isDirty: boolean;
};

type CalendarAction =
  | {
      type: "select_day";
      day: Day;
    }
  | {
      type: "hover_day";
      day: Day;
    };

const calendarReducer = (
  prevState: CalendarState,
  action: CalendarAction
): CalendarState => {
  if (action.type === "select_day") {
    if (prevState.selectedDays?.length === 1)
      return {
        ...prevState,
        hoverDay: undefined,
        selectedDays: [prevState.selectedDays[0], action.day].sort(
          (a, b) =>
            new Date(a.year, a.month, a.day).getTime() -
            new Date(b.year, b.month, b.day).getTime()
        ) as [Day, Day],
        isDirty: true,
      };

    return {
      ...prevState,
      hoverDay: undefined,
      selectedDays: [action.day] as [Day],
      isDirty: true,
    };
  }
  if (action.type === "hover_day" && prevState.selectedDays?.length === 1) {
    console.log(action);
    return { ...prevState, hoverDay: action.day };
  }
  return prevState;
};

export default function Calendar({
  onSelect,
  selectedDates,
}: {
  onSelect: (...dates: string[]) => void;
  selectedDates?: [string] | [string, string];
}) {
  const [state, dispatch] = useReducer(
    calendarReducer,
    createDefaultState(selectedDates)
  );
  const days = createCalendar({ month: state.month, year: state.year });

  const onDayClick = (day: Day) => {
    dispatch({ type: "select_day", day });
  };

  const onDayHover = (day: Day) => {
    dispatch({ type: "hover_day", day });
  };

  useEffect(() => {
    if (state.isDirty && state.selectedDays?.length === 2) {
      if (
        state.selectedDays[0].day === state.selectedDays[1].day &&
        state.selectedDays[0].month === state.selectedDays[1].month &&
        state.selectedDays[0].year === state.selectedDays[1].year
      )
        return onSelect(
          new Date(
            state.selectedDays[0].year,
            state.selectedDays[0].month,
            state.selectedDays[0].day,
            12
          )
            .toISOString()
            .split("T")
            .shift()!
        );
      onSelect(
        ...(state.selectedDays.map(
          (d) =>
            new Date(d.year, d.month, d.day, 12)
              .toISOString()
              .split("T")
              .shift()!
        ) as [string, string])
      );
    }
  }, [state.isDirty, state.selectedDays]);

  const hoverDays: Day[] | undefined = (() => {
    if (!state.hoverDay || state.selectedDays?.length !== 1) return undefined;
    return [state.selectedDays[0], state.hoverDay].sort(
      (a, b) =>
        new Date(a.year, a.month, a.day).getTime() -
        new Date(b.year, b.month, b.day).getTime()
    );
  })();

  return (
    <CalendarView
      month={state.month}
      year={state.year}
      days={days}
      onDayClick={onDayClick}
      selectedDays={state.selectedDays}
      onDayHover={onDayHover}
      hoverDays={hoverDays}
    />
  );
}
