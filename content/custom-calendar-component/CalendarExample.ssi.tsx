import { render, useState } from "hono/jsx/dom";
import Calendar from "./Calendar.tsx";
import { css } from "@emotion/css";

export default function CalendarExample() {
  const [state, setState] = useState<string[]>();
  const onSelect = (...dates: string[]) => setState(dates);

  return (
    <div id="calendar" className={styles.wrapper}>
      <Calendar onSelect={onSelect} />
      <div className={styles.result}>
        {!!state?.length && (
          <>
            <br />
            <strong>Selected dates:</strong> <br />
            {state?.join(" - ")}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: css({
    display: "flex",
    gap: "1rem",
    flexDirection: "column",
    alignItems: 'center',
    "@media screen and (min-width: 800px)": {
      flexDirection: "row",
      alignItems: 'flex-start',
    },
  }),
  result: css({
    minHeight: "4rem",
  }),
};

if (typeof document !== "undefined") {
  render(<CalendarExample />, document.getElementById("calendar")!);
}
