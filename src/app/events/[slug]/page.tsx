import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";

import { getPublicEvent } from "@/lib/public-event";
import { ShareButton } from "./share-button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getPublicEvent(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: `${event.title} — Tickets`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
    },
  };
}

export default async function PublicEventPage({ params }: Props) {
  const { slug } = await params;
  const event = getPublicEvent(slug);
  if (!event) notFound();

  return (
    <main className="public-event">
      <nav className="public-nav" aria-label="Event navigation">
        <Link className="public-brand" href="/">
          <span className="public-brand-mark" />
          <span>eventflow</span>
        </Link>
        <ShareButton title={event.title} />
      </nav>

      <article className={`public-hero public-hero--${event.accent}`}>
        <div className="public-hero-glow" />
        <Link className="public-back" href="/">
          <ArrowLeft size={16} />
          <span>All events</span>
        </Link>
        <div className="public-hero-copy">
          <span className="public-category">{event.category}</span>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <div className="public-meta">
            <span>
              <CalendarDays size={17} />
              <span>
                <strong>{event.date}</strong>
                <small>{event.time}</small>
              </span>
            </span>
            <span>
              <MapPin size={17} />
              <span>
                <strong>{event.venue}</strong>
                <small>{event.address}</small>
              </span>
            </span>
          </div>
        </div>
      </article>

      <section className="public-content" aria-label="Event details and tickets">
        <div className="public-details">
          <span className="public-section-kicker">About the event</span>
          <h2>An evening built around discovery.</h2>
          <p>
            {event.description} Move easily between intimate moments and
            full-volume headline sets, with thoughtful food, drinks, and light
            installations throughout the pier.
          </p>
          <div className="public-organizer">
            <span>SN</span>
            <div>
              <small>Presented by</small>
              <strong>{event.organizer}</strong>
            </div>
          </div>
        </div>

        <aside className="ticket-panel" aria-label="Available tickets">
          <div className="ticket-panel-heading">
            <div>
              <span>Tickets</span>
              <h2>Choose your experience</h2>
            </div>
            <Ticket size={20} />
          </div>
          {event.tickets.map((ticket) => (
            <Link
              className="ticket-option"
              href={`/events/${event.slug}/checkout?ticket=${ticket.id}`}
              key={ticket.id}
            >
              <div>
                <strong>{ticket.name}</strong>
                <span>{ticket.description}</span>
                <small>{ticket.remaining} remaining</small>
              </div>
              <div>
                <strong>${ticket.price}</strong>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
          <p className="ticket-fee-note">All prices include applicable fees.</p>
        </aside>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description: event.description,
            startDate: "2026-12-05T19:00:00-08:00",
            location: {
              "@type": "Place",
              name: event.venue,
              address: event.address,
            },
            organizer: {
              "@type": "Organization",
              name: event.organizer,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
