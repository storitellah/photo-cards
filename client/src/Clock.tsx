import { useEffect, useState } from "react";

function format(now: Date) {
  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local time";
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(now);
  return { date, time, timeZone };
}

export default function Clock() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { date, time, timeZone } = format(now);

  return (
    <div className="clock" aria-live="polite">
      <span className="clock__time">{time}</span>
      <span className="clock__date">{date}</span>
      <span className="clock__zone">{timeZone}</span>
    </div>
  );
}
