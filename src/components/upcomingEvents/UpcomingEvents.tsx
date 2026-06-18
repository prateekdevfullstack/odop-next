"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type EventItem } from "./event";
import { fetchPublicEvents, type PublicEvent } from "@/services/events.service";


const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WEEKDAYS_HI = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const MONTHS_HI = [
    "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर",
];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_NAMES_HI = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const ACCENT = "hsl(25 95% 45%)";

function weekdayName(d: Date, isHi = false) {
    return (isHi ? WEEKDAY_NAMES_HI : WEEKDAY_NAMES)[d.getDay()];
}

function ordinal(n: number) {
    const s = n % 10, t = n % 100;
    if (s === 1 && t !== 11) return `${n}st`;
    if (s === 2 && t !== 12) return `${n}nd`;
    if (s === 3 && t !== 13) return `${n}rd`;
    return `${n}th`;
}

function buildMonthGrid(year: number, month: number) {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
}

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function eventsStartingOnDate(date: Date, list: EventItem[]) {
    const target = startOfDate(date);
    return list.filter((e) => startOfDate(new Date(e.startDate)) === target);
}

function hasEventStartingOnDate(date: Date, list: EventItem[]) {
    return eventsStartingOnDate(date, list).length > 0;
}

type MonthGroup = { key: string; year: number; month: number; items: EventItem[] };

function groupEventsByMonth(list: EventItem[]): MonthGroup[] {
    const sorted = [...list].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    const map = new Map<string, MonthGroup>();
    for (const e of sorted) {
        const d = new Date(e.startDate);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!map.has(key)) {
            map.set(key, { key, year: d.getFullYear(), month: d.getMonth(), items: [] });
        }
        map.get(key)!.items.push(e);
    }
    return Array.from(map.values());
}

type UpcomingEventsProps = {
    startDate?: string;
    endDate?: string;
    isHi?: boolean;
};

export function UpcomingEvents({ startDate, endDate, isHi = false }: UpcomingEventsProps = {}) {
    const months = isHi ? MONTHS_HI : MONTHS;
    const weekdays = isHi ? WEEKDAYS_HI : WEEKDAYS;
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    async function loadEvents() {
        setLoading(true);
        try {
            const today = new Date();
            const formatApiDate = (date: Date) => date.toISOString().slice(0, 10);

            const start =
                startDate || formatApiDate(new Date(today.getFullYear(), today.getMonth(), 1));
            const end = endDate || formatApiDate(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()));

            const params: any = {
                limit: 6000,
                startDate: start,
                endDate: end,
            };

            const response = await fetchPublicEvents(params);
            if (response.success && response.data) {
                const resData = response.data;
                const rows = Array.isArray(resData.rows)
                    ? resData.rows
                    : Array.isArray((resData as any).data)
                        ? (resData as any).data
                        : Array.isArray(resData)
                            ? (resData as any)
                            : [];

                const eventItems = rows.map((event: PublicEvent): EventItem => ({
                    id: event.id,
                    title: event.title,
                    slug: event.slug ?? "",
                    shortDescription: event.shortDescription ?? null,
                    startDate: event.startDate ?? "",
                    endDate: event.endDate ?? event.startDate ?? "",
                    venueName: event.venueName ?? null,
                    city: event.city ?? event.venueName ?? null,
                    address: event.address ?? null,
                    eventTheme: null,
                    bannerImage: null,
                    category: event.category
                        ? { id: event.category.id, name: event.category.name }
                        : null,
                    eventDateType: event.eventDateType,
                }));
                setEvents(eventItems);
            }
        } catch (err) {
            console.error("Failed to load events", err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadEvents();
    }, [startDate, endDate]);

    const dateEvents = useMemo(
        () => {
            const todayStart = startOfDate(new Date());
            return events.filter(
                (e) =>
                    e.eventDateType?.toUpperCase() !== "MONTH" &&
                    startOfDate(new Date(e.startDate)) >= todayStart
            );
        },
        [events]
    );

    const groups = useMemo(() => groupEventsByMonth(dateEvents), [dateEvents]);
    const firstEvent = groups[0]?.items[0];
    const firstEventDate = firstEvent ? new Date(firstEvent.startDate) : new Date();

    const [selectedId, setSelectedId] = useState<number | null>(firstEvent?.id ?? null);
    const [selectedDate, setSelectedDate] = useState<Date>(firstEventDate);
    const [viewMonth, setViewMonth] = useState(firstEventDate.getMonth());
    const [viewYear, setViewYear] = useState(firstEventDate.getFullYear());

    const didInitialSelect = useRef(false);
    useEffect(() => {
        if (didInitialSelect.current || dateEvents.length === 0) return;
        didInitialSelect.current = true;
        setSelectedId(firstEvent?.id ?? null);
        setSelectedDate(firstEventDate);
        if (firstEvent) {
            setViewMonth(firstEventDate.getMonth());
            setViewYear(firstEventDate.getFullYear());
        }
    }, [dateEvents, firstEvent, firstEventDate]);

    // When the viewed month/year changes, select the first date in that month with events
    useEffect(() => {
        const monthEvents = dateEvents
            .filter((e) => {
                const d = new Date(e.startDate);
                return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
            })
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        if (monthEvents.length > 0) {
            setSelectedDate(new Date(monthEvents[0].startDate));
            setSelectedId(monthEvents[0].id);
        } else {
            setSelectedDate(new Date(viewYear, viewMonth, 1));
            setSelectedId(null);
        }
    }, [viewMonth, viewYear, dateEvents]);

    // Events of type MONTH that fall in the selected (viewed) month/year.
    const monthOnlyEvents = useMemo(
        () =>
            events.filter((e) => {
                if (e.eventDateType?.toUpperCase() !== "MONTH") return false;
                const d = new Date(e.startDate);
                return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
            }),
        [events, viewYear, viewMonth]
    );

    const cells = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

    const prevMonth = () => {
        const m = viewMonth - 1;
        if (m < 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(m);
    };
    const nextMonth = () => {
        const m = viewMonth + 1;
        if (m > 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(m);
    };

    const onDateClick = (d: Date) => {
        setSelectedDate(d);
        const startEvents = eventsStartingOnDate(d, dateEvents);
        setSelectedId(startEvents[0]?.id ?? null);
    };
    const [activeTab, setActiveTab] = useState<"date" | "month">("date");
    const selDate = selectedDate;
    const dayEvents = eventsStartingOnDate(selDate, dateEvents);
    return (
        <section className="mx-auto w-full max-w-7xl px-4">
            <h3 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>
                {months[selDate.getMonth()]} {selDate.getFullYear()}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
                {/* LEFT — selected event */}
                <div>
                    <div className="flex items-center gap-2 mb-4 border-b" style={{ borderColor: "hsl(33 100% 90%)" }}>
                        <button
                            type="button"
                            onClick={() => setActiveTab("date")}
                            className="px-4 py-2 text-sm font-semibold"
                            style={
                                activeTab === "date"
                                    ? { color: ACCENT, borderBottom: `2px solid ${ACCENT}` }
                                    : { color: "#6B7280" }
                            }
                        >
                            {isHi ? "तारीख़ घोषित" : "Date Announced"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("month")}
                            className="px-4 py-2 text-sm font-semibold"
                            style={
                                activeTab === "month"
                                    ? { color: ACCENT, borderBottom: `2px solid ${ACCENT}` }
                                    : { color: "#6B7280" }
                            }
                        >
                            {isHi ? "तारीख़ शीघ्र घोषित की जाएगी" : "Date to be Announced"}
                        </button>
                    </div>

                    {activeTab === "month" && (
                        monthOnlyEvents.length === 0 ? (
                            <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
                                {isHi ? "इस महीने कोई कार्यक्रम नहीं है।" : "No events this month."}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {monthOnlyEvents.map((e) => {
                                    const d = new Date(e.startDate);
                                    return (
                                        <div
                                            key={e.id}
                                            className="rounded-2xl border bg-card overflow-hidden"
                                            style={{ borderColor: ACCENT }}
                                        >
                                            <div className="flex flex-col sm:flex-row items-stretch">
                                                <div
                                                    className="flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 px-6 py-3 sm:py-5 min-w-0 sm:min-w-[110px] border-b sm:border-b-0 sm:border-r"
                                                    style={{ background: "hsl(33 100% 96%)", color: ACCENT, borderColor: ACCENT }}
                                                >
                                                    <div className="text-lg font-bold leading-none">{isHi ? months[d.getMonth()] : MONTHS[d.getMonth()].slice(0, 3).toUpperCase()}</div>
                                                    <div className="text-sm mt-0 sm:mt-1">{d.getFullYear()}</div>
                                                </div>

                                                <div className="flex-1 p-5 flex flex-col gap-2">
                                                    <div className="font-semibold text-lg" style={{ color: "#0f2749" }}>{e?.category?.name}</div>
                                                    <div className="font-semibold text-md">{e?.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {e.city ?? e.venueName}
                                                    </div>
                                                    {e?.shortDescription && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {e?.shortDescription}
                                                        </p>
                                                    )}
                                                    {e?.eventTheme && (
                                                        <div
                                                            className="text-xs font-semibold tracking-wide mt-2"
                                                            style={{ color: ACCENT }}
                                                        >
                                                            {e?.eventTheme}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    )}

                    {activeTab === "date" && (() => {
                        const ev = dateEvents.find((e) => e.id === selectedId) ?? firstEvent;
                        if (!ev || dayEvents.length === 0) {
                            return (
                                <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
                                    {isHi ? "कोई आगामी कार्यक्रम नहीं है।" : "No upcoming events."}
                                </div>
                            );
                        }
                        return (
                            <>

                                <div className="space-y-4">
                                    {dayEvents.map((e) => {
                                        const d = new Date(e.startDate);
                                        const ed = new Date(e.endDate);
                                        const multi = d.toDateString() !== ed.toDateString();
                                        return (
                                            <div
                                                key={e.id}
                                                className="rounded-2xl border bg-card overflow-hidden"
                                                style={{ borderColor: ACCENT }}
                                            >
                    
                                                <div className="flex flex-col sm:flex-row items-stretch">
                                                    <div
                                                        className="flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 px-6 py-3 sm:py-5 min-w-0 sm:min-w-[110px] border-b sm:border-b-0 sm:border-r"
                                                        style={{ background: "hsl(33 100% 96%)", color: ACCENT, borderColor: ACCENT }}
                                                    >
                                                        <div className="text-3xl font-bold leading-none">{d.getDate()}</div>
                                                        <div className="text-sm mt-0 sm:mt-1">{weekdayName(d, isHi)}</div>
                                                    </div>

                                                    <div className="flex-1 p-5 flex flex-col gap-2">
                                                        <div className="flex items-center gap-3 text-sm" style={{ color: ACCENT }}>
                                                            <span className="font-semibold">
                                                                {weekdayName(d, isHi)} {d?.getDate()} {months[d?.getMonth()]}
                                                            </span>
                                                            {multi && (
                                                                <span className="text-muted-foreground">
                                                                    → {ed.getDate()} {isHi ? months[ed?.getMonth()] : MONTHS[ed?.getMonth()]?.slice(0, 3)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="font-semibold text-lg" style={{color:"#0f2749"}}>{e?.category?.name}</div>
                                                        <div className="font-semibold text-md">{e?.title}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {e.city ?? e.venueName}
                                                        </div>
                                                        {e?.shortDescription && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {e?.shortDescription}
                                                            </p>
                                                        )}
                                                        {e?.eventTheme && (
                                                            <div
                                                                className="text-xs font-semibold tracking-wide mt-2"
                                                                style={{ color: ACCENT }}
                                                            >
                                                                {e?.eventTheme}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="mt-4 text-xs text-muted-foreground">
                                    {isHi
                                        ? "उस दिन के कार्यक्रम देखने के लिए कैलेंडर में हाइलाइट की गई तारीख पर क्लिक करें।"
                                        : "Click a highlighted date on the calendar to view that day's events."}
                                </p>
                            </>
                        );
                    })()}

                </div>

                {/* RIGHT — calendar */}
                <div className="lg:sticky lg:top-6 self-start w-full">
                    <div className="rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={prevMonth}
                                aria-label={isHi ? "पिछला महीना" : "Previous month"}
                                style={{ color: ACCENT }}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <div className="font-semibold" style={{ color: ACCENT }}>
                                {months[viewMonth]} {viewYear}
                            </div>
                            <button
                                onClick={nextMonth}
                                aria-label={isHi ? "अगला महीना" : "Next month"}
                                style={{ color: ACCENT }}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-y-3 text-center">
                            {weekdays.map((w) => (
                                <div key={w} className="text-xs font-semibold" style={{ color: ACCENT }}>{w}</div>
                            ))}
                            {cells.map((d, i) => {
                                if (!d) return <div key={i} />;
                                const isSelected = sameDay(d, selectedDate);
                                const hasEvent = hasEventStartingOnDate(d, dateEvents);


                                return (
                                    <button
                                        key={i}
                                        onClick={() => onDateClick(d)}
                                        disabled={!hasEvent}
                                        className={[
                                            "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                                            hasEvent ? "cursor-pointer" : "cursor-default text-foreground/60",
                                        ].join(" ")}
                                        style={
                                            isSelected && hasEvent
                                                ? { background: ACCENT, color: "white", fontWeight: 600 }
                                                : hasEvent
                                                    ? { color: ACCENT, fontWeight: 600 }
                                                    : undefined
                                        }
                                    >
                                        {d.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground text-center">
                        {isHi ? "चयनित:" : "Selected:"} {weekdayName(selectedDate, isHi)} {isHi ? selectedDate.getDate() : ordinal(selectedDate.getDate())}{" "}
                        {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </p>
                </div>
            </div>
        </section>
    );
}