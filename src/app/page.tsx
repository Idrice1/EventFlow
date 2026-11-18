"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  Download,
  Ellipsis,
  Filter,
  LayoutDashboard,
  MapPin,
  Moon,
  Plus,
  Search,
  Settings2,
  Sun,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { createEventSchema, eventSchema, type EventItem } from "@/lib/events";

const initialEvents: EventItem[] = [
  {
    id: 1,
    name: "Afterglow Festival",
    date: "Dec 05, 2026",
    venue: "Pier 27, San Francisco",
    sold: 1842,
    capacity: 2500,
    revenue: 110520,
    status: "Live",
    art: "event-art--afterglow",
    initials: "AF",
  },
  {
    id: 2,
    name: "Studio Sessions: Vol. 4",
    date: "Dec 11, 2026",
    venue: "The Midway, San Francisco",
    sold: 328,
    capacity: 450,
    revenue: 14760,
    status: "Live",
    art: "event-art--studio",
    initials: "SS",
  },
  {
    id: 3,
    name: "Sunday Table — Summer Edition",
    date: "Dec 19, 2026",
    venue: "The Progress, San Francisco",
    sold: 84,
    capacity: 120,
    revenue: 10500,
    status: "Live",
    art: "event-art--table",
    initials: "ST",
  },
  {
    id: 4,
    name: "Designing for Tomorrow",
    date: "Jan 09, 2027",
    venue: "The Pearl, San Francisco",
    sold: 120,
    capacity: 120,
    revenue: 9600,
    status: "Sold out",
    art: "event-art--design",
    initials: "DT",
  },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Events", icon: CalendarDays },
  { label: "Orders", icon: Ticket },
  { label: "Audience", icon: Users },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const formatCount = (amount: number) =>
  new Intl.NumberFormat("en-US").format(amount);

function subscribeTheme(callback: () => void) {
  window.addEventListener("eventflow-theme-change", callback);
  return () => window.removeEventListener("eventflow-theme-change", callback);
}

function getThemeSnapshot() {
  return window.localStorage.getItem("eventflow-theme") === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

function saveTheme(darkMode: boolean) {
  window.localStorage.setItem("eventflow-theme", darkMode ? "dark" : "light");
  window.dispatchEvent(new Event("eventflow-theme-change"));
}

function subscribeEvents(callback: () => void) {
  window.addEventListener("eventflow-events-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("eventflow-events-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getEventsSnapshot() {
  return window.localStorage.getItem("eventflow-events");
}

function getServerEventsSnapshot() {
  return null;
}

function parseSavedEvents(snapshot: string | null) {
  if (snapshot === null) return initialEvents;
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) return initialEvents;
    return parsed.flatMap((item) => {
      const result = eventSchema.safeParse(item);
      return result.success ? [result.data] : [];
    });
  } catch {
    window.localStorage.removeItem("eventflow-events");
    return initialEvents;
  }
}

function RevenueChart() {
  return (
    <div className="chart-wrap" aria-label="Revenue grew steadily this month">
      <div className="chart-y-labels" aria-hidden="true">
        <span>$12k</span>
        <span>$9k</span>
        <span>$6k</span>
        <span>$3k</span>
        <span>$0</span>
      </div>
      <svg
        className="revenue-chart"
        viewBox="0 0 640 220"
        role="img"
        aria-labelledby="chart-title chart-desc"
        preserveAspectRatio="none"
      >
        <title id="chart-title">Revenue over the last 30 days</title>
        <desc id="chart-desc">
          Daily revenue increased from around $2,000 to $10,000.
        </desc>
        <defs>
          <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity=".16" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 65, 110, 155, 200].map((y) => (
          <line
            key={y}
            x1="0"
            x2="640"
            y1={y}
            y2={y}
            className="chart-grid"
          />
        ))}
        <path
          d="M0 176 C24 170 29 164 48 164 S78 174 96 154 S126 151 144 157 S174 132 192 137 S222 133 240 115 S270 123 288 112 S318 118 336 99 S366 105 384 87 S414 98 432 80 S462 84 480 61 S510 72 528 57 S558 65 576 43 S606 48 624 30 S638 26 640 21 L640 220 L0 220 Z"
          fill="url(#chart-fill)"
        />
        <path
          d="M0 176 C24 170 29 164 48 164 S78 174 96 154 S126 151 144 157 S174 132 192 137 S222 133 240 115 S270 123 288 112 S318 118 336 99 S366 105 384 87 S414 98 432 80 S462 84 480 61 S510 72 528 57 S558 65 576 43 S606 48 624 30 S638 26 640 21"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="640" cy="21" r="5" fill="#4f46e5" />
        <circle cx="640" cy="21" r="9" fill="#4f46e5" opacity=".14" />
      </svg>
      <div className="chart-x-labels" aria-hidden="true">
        <span>Oct 19</span>
        <span>Oct 26</span>
        <span>Nov 02</span>
        <span>Nov 09</span>
        <span>Nov 18</span>
      </div>
    </div>
  );
}

function EventDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (event: EventItem) => void;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("200");
  const [error, setError] = useState("");

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function trapFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled])',
    );
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = createEventSchema.safeParse({ name, date, venue, capacity });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the event details and try again.");
      return;
    }

    onCreate({
      id: Date.now(),
      name: parsed.data.name,
      date: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(`${parsed.data.date}T12:00:00`)),
      venue: parsed.data.venue,
      sold: 0,
      capacity: parsed.data.capacity,
      revenue: 0,
      status: "Draft",
      art: "event-art--new",
      initials: name.trim().slice(0, 2).toUpperCase(),
    });
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="dialog-backdrop"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={onClose}
      transition={{ duration: 0.18 }}
    >
      <motion.section
        aria-labelledby="create-event-title"
        aria-modal="true"
        className="event-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={trapFocus}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        role="dialog"
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="dialog-top">
          <div className="dialog-icon">
            <CalendarDays size={20} />
          </div>
          <button
            aria-label="Close dialog"
            className="icon-button dialog-close"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>
        </div>
        <h2 id="create-event-title">Create an event</h2>
        <p className="dialog-copy">
          Start with the essentials. You can add tickets and polish your page next.
        </p>
        <form className="create-form" onSubmit={submit}>
          <label>
            Event name
            <input
              autoFocus
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Summer rooftop sessions"
              value={name}
            />
          </label>
          <div className="form-grid">
            <label>
              Date
              <input onChange={(event) => setDate(event.target.value)} type="date" value={date} />
            </label>
            <label>
              Capacity
              <input
                min="1"
                onChange={(event) => setCapacity(event.target.value)}
                type="number"
                value={capacity}
              />
            </label>
          </div>
          <label>
            Venue
            <input
              onChange={(event) => setVenue(event.target.value)}
              placeholder="Venue or online"
              value={venue}
            />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="dialog-actions">
            <button className="button button-quiet" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="button button-primary" type="submit">
              Create draft <ArrowUpRight size={16} />
            </button>
          </div>
        </form>
      </motion.section>
    </motion.div>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All events");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const darkMode = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const savedEvents = useSyncExternalStore(
    subscribeEvents,
    getEventsSnapshot,
    getServerEventsSnapshot,
  );
  const events = useMemo(() => parseSavedEvents(savedEvents), [savedEvents]);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const visibleEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesQuery =
          `${event.name} ${event.venue}`.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = statusFilter === "All events" || event.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [events, query, statusFilter],
  );

  function createEvent(event: EventItem) {
    const nextEvents = [event, ...events];
    window.localStorage.setItem("eventflow-events", JSON.stringify(nextEvents));
    window.dispatchEvent(new Event("eventflow-events-change"));
    setDialogOpen(false);
    setNotice(`${event.name} is ready to edit.`);
    window.setTimeout(() => setNotice(""), 3800);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link aria-label="EventFlow home" className="brand" href="/">
          <span className="brand-mark"><span /></span>
          <span>eventflow</span>
        </Link>

        <button aria-label="Switch workspace" className="workspace-switcher">
          <span className="workspace-avatar">S</span>
          <span className="workspace-copy">
            <strong>Studio North</strong>
            <small>Free plan</small>
          </span>
          <ChevronDown size={16} />
        </button>

        <div className="sidebar-group">
          <span className="sidebar-label">WORKSPACE</span>
          <nav aria-label="Main navigation" className="side-nav">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                aria-label={label}
                aria-current={activeNav === label ? "page" : undefined}
                className={`nav-item ${activeNav === label ? "nav-item--active" : ""}`}
                key={label}
                onClick={() => setActiveNav(label)}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {label === "Orders" && <span className="nav-count">12</span>}
              </button>
            ))}
            <button aria-label="Reports" className="nav-item" onClick={() => setActiveNav("Reports")}>
              <BarChart3 size={18} strokeWidth={1.8} /><span>Reports</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-group sidebar-group--tools">
          <span className="sidebar-label">TOOLS</span>
          <button aria-label="Attendees" className="nav-item" onClick={() => setNotice("Audience tools are coming soon.")}>
            <Users size={18} strokeWidth={1.8} /><span>Attendees</span>
          </button>
          <button aria-label="Integrations" className="nav-item" onClick={() => setNotice("Integrations are coming soon.")}>
            <Command size={18} strokeWidth={1.8} /><span>Integrations</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-card-icon"><CircleHelp size={17} /></span>
            <strong>Need a hand?</strong>
            <p>Our team is here to help you grow.</p>
            <button onClick={() => setNotice("Support chat will be available soon.")}>
              Visit help center <ArrowUpRight size={13} />
            </button>
          </div>
          <button aria-label="Settings" className="nav-item" onClick={() => setNotice("Settings are coming soon.")}>
            <Settings2 size={18} strokeWidth={1.8} /><span>Settings</span>
          </button>
          <button aria-label="Account menu for Alex Morgan" className="profile-switcher">
            <span className="profile-avatar">AM</span>
            <span className="profile-copy"><strong>Alex Morgan</strong><small>alex@studionorth.co</small></span>
            <Ellipsis size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Studio North</span><ChevronRight size={15} /><strong>{activeNav}</strong>
          </div>
          <div className="topbar-actions">
            <button aria-label="Toggle dark mode" className="icon-button" onClick={() => saveTheme(!darkMode)}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button aria-label="Notifications" className="icon-button notification-button" onClick={() => setNotice("You’re all caught up.")}>
              <Bell size={18} /><i />
            </button>
            <span className="topbar-divider" />
            <button className="avatar-button" aria-label="Account menu">AM</button>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> WEDNESDAY, NOVEMBER 18, 2026</div>
              <h1>Good morning, Alex <span className="wave">✦</span></h1>
              <p className="welcome-copy">Here’s what’s happening with your events today.</p>
            </div>
            <button className="button button-primary create-button" onClick={() => setDialogOpen(true)}>
              <Plus size={18} /> Create event
            </button>
          </div>

          <section aria-label="Performance overview" className="stats-grid">
            <article className="stat-card">
              <div className="stat-top"><span className="stat-label">Total revenue</span><span className="stat-icon stat-icon--purple"><Ticket size={17} /></span></div>
              <div className="stat-value">$145,380</div>
              <div className="stat-foot"><span className="trend trend--up"><ArrowUpRight size={14} /> 12.8%</span><span>vs. last month</span></div>
              <div className="stat-spark stat-spark--purple" aria-hidden="true"><svg viewBox="0 0 120 30"><path d="M0 25 C15 24 12 18 27 20 S42 11 56 16 S72 18 84 8 S102 15 120 2" /></svg></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-label">Tickets sold</span><span className="stat-icon stat-icon--blue"><Ticket size={17} /></span></div>
              <div className="stat-value">2,374</div>
              <div className="stat-foot"><span className="trend trend--up"><ArrowUpRight size={14} /> 8.2%</span><span>vs. last month</span></div>
              <div className="stat-spark stat-spark--blue" aria-hidden="true"><svg viewBox="0 0 120 30"><path d="M0 22 C16 22 15 15 31 18 S43 14 57 16 S72 10 87 12 S105 6 120 3" /></svg></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-label">Page views</span><span className="stat-icon stat-icon--orange"><Users size={17} /></span></div>
              <div className="stat-value">18,642</div>
              <div className="stat-foot"><span className="trend trend--up"><ArrowUpRight size={14} /> 24.6%</span><span>vs. last month</span></div>
              <div className="stat-spark stat-spark--orange" aria-hidden="true"><svg viewBox="0 0 120 30"><path d="M0 25 C14 21 19 24 32 17 S50 19 60 12 S76 17 89 9 S105 12 120 2" /></svg></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-label">Conversion rate</span><span className="stat-icon stat-icon--green"><ArrowUpRight size={17} /></span></div>
              <div className="stat-value">12.7%</div>
              <div className="stat-foot"><span className="trend trend--down"><ArrowDownRight size={14} /> 1.4%</span><span>vs. last month</span></div>
              <div className="stat-spark stat-spark--green" aria-hidden="true"><svg viewBox="0 0 120 30"><path d="M0 5 C12 8 19 7 31 12 S48 8 62 13 S78 11 91 18 S106 14 120 23" /></svg></div>
            </article>
          </section>

          <section className="insights-grid">
            <article className="panel revenue-panel">
              <div className="panel-heading">
                <div><h2>Revenue over time</h2><p>Keep an eye on how your events are performing.</p></div>
                <button className="select-button">Last 30 days <ChevronDown size={15} /></button>
              </div>
              <div className="revenue-total"><strong>$48,290</strong><span className="trend trend--up"><ArrowUpRight size={14} /> 18.4%</span><small>vs. previous 30 days</small></div>
              <RevenueChart />
            </article>

            <article className="panel activity-panel">
              <div className="panel-heading">
                <div><h2>Recent activity</h2><p>Latest updates from your events.</p></div>
                <button aria-label="More activity options" className="icon-button panel-more"><Ellipsis size={19} /></button>
              </div>
              <div className="activity-list">
                <div className="activity-item"><span className="activity-icon activity-icon--ticket"><Ticket size={16} /></span><div><p><strong>12 tickets</strong> sold for Afterglow Festival</p><small>8 minutes ago · $720.00</small></div></div>
                <div className="activity-item"><span className="activity-icon activity-icon--user"><Users size={16} /></span><div><p><strong>Jamie Chen</strong> joined your audience</p><small>34 minutes ago · Studio Sessions</small></div></div>
                <div className="activity-item"><span className="activity-icon activity-icon--check"><Check size={16} /></span><div><p>Event page <strong>Studio Sessions</strong> published</p><small>2 hours ago · By you</small></div></div>
                <div className="activity-item"><span className="activity-icon activity-icon--ticket"><Ticket size={16} /></span><div><p><strong>4 tickets</strong> sold for Sunday Table</p><small>3 hours ago · $500.00</small></div></div>
              </div>
              <button className="activity-link" onClick={() => setActiveNav("Orders")}>View all activity <ArrowUpRight size={14} /></button>
            </article>
          </section>

          <section className="panel events-panel">
            <div className="events-heading">
              <div><h2>Your events <span className="event-count">{events.length}</span></h2><p>Manage and track all your events in one place.</p></div>
              <div className="event-controls">
                <label className="search-field">
                  <Search size={16} /><span className="sr-only">Search events</span>
                  <input onChange={(event) => setQuery(event.target.value)} placeholder="Search events..." value={query} />
                  <kbd>/</kbd>
                </label>
                <label className="filter-button"><Filter size={15} /><span className="sr-only">Filter by status</span><select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>All events</option><option>Live</option><option>Draft</option><option>Sold out</option></select><ChevronDown size={14} /></label>
                <button className="icon-button export-button" aria-label="Export events" onClick={() => setNotice("Your event export is being prepared.")}><Download size={17} /></button>
              </div>
            </div>

            {visibleEvents.length > 0 ? (
              <div className="events-table-wrap">
                <table className="events-table">
                  <thead><tr><th>EVENT</th><th>DATE & VENUE</th><th>TICKETS SOLD</th><th>REVENUE</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>{visibleEvents.map((event) => {
                    const percentage = Math.min(100, Math.round((event.sold / event.capacity) * 100));
                    return <tr key={event.id}>
                      <td><div className="event-name-cell"><span className={`event-art ${event.art}`}><span>{event.initials}</span></span>{event.id === 1 ? <Link href="/events/afterglow-festival"><strong>{event.name}</strong></Link> : <strong>{event.name}</strong>}</div></td>
                      <td><div className="date-cell"><strong>{event.date}</strong><span><MapPin size={12} />{event.venue}</span></div></td>
                      <td><div className="sold-cell"><strong>{formatCount(event.sold)} <span>/ {formatCount(event.capacity)}</span></strong><div className="progress-track"><span style={{ width: `${percentage}%` }} /></div></div></td>
                      <td className="revenue-cell">{formatCurrency(event.revenue)}</td>
                      <td><span className={`status-pill status-pill--${event.status.toLowerCase().replace(" ", "-")}`}><i />{event.status}</span></td>
                      <td><button aria-label={`More options for ${event.name}`} className="icon-button row-more" onClick={() => setNotice(`More options for ${event.name} are coming soon.`)}><Ellipsis size={18} /></button></td>
                    </tr>;
                  })}</tbody>
                </table>
                <div className="mobile-events">{visibleEvents.map((event) => <article className="mobile-event-card" key={event.id}>
                  <div className="mobile-event-top"><span className={`event-art ${event.art}`}><span>{event.initials}</span></span><div className="mobile-event-name"><strong>{event.name}</strong><span><MapPin size={12} />{event.venue}</span></div><button aria-label={`More options for ${event.name}`} className="icon-button"><Ellipsis size={18} /></button></div>
                  <div className="mobile-event-bottom"><span>{event.date}</span><strong>{formatCurrency(event.revenue)}</strong><span className={`status-pill status-pill--${event.status.toLowerCase().replace(" ", "-")}`}><i />{event.status}</span></div>
                  <div className="mobile-progress"><span>{event.sold} / {event.capacity} tickets</span><div className="progress-track"><span style={{ width: `${Math.min(100, (event.sold / event.capacity) * 100)}%` }} /></div></div>
                </article>)}</div>
                <div className="table-footer"><span>Showing <strong>{visibleEvents.length}</strong> of <strong>{events.length}</strong> events</span><div><button aria-label="Previous page" className="pagination-button" disabled><ChevronLeft size={16} /></button><button className="pagination-current">1</button><button aria-label="Next page" className="pagination-button" disabled><ChevronRight size={16} /></button></div></div>
              </div>
            ) : <div className="empty-state"><span><Search size={21} /></span><strong>No events found</strong><p>Try adjusting your search or filters.</p><button className="button button-quiet" onClick={() => { setQuery(""); setStatusFilter("All events"); }}>Clear filters</button></div>}
          </section>

          <footer className="page-footer"><span>© 2026 EventFlow, Inc.</span><span><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#status"><i className="footer-status" /> All systems operational</a></span></footer>
        </div>
      </main>

      <AnimatePresence>{dialogOpen && <EventDialog onClose={() => setDialogOpen(false)} onCreate={createEvent} />}</AnimatePresence>
      {notice && <div className="toast" role="status"><span><Check size={16} /></span>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={16} /></button></div>}
      <button className="mobile-create" onClick={() => setDialogOpen(true)} aria-label="Create event"><Plus size={23} /></button>
    </div>
  );
}
