
import type { FC } from 'hono/jsx';
const SSIComponents = new Map<string,{ Component: FC, script: string }>();
SSIComponents.set("custom-calendar-component/CalendarExample.ssi.tsx", { Component: (await import("./custom-calendar-component/CalendarExample.ssi.tsx")).default, script: "/content/custom-calendar-component/CalendarExample.ssi.js" })
export default SSIComponents;
