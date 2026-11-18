"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, LockKeyhole, Minus, Plus, Ticket } from "lucide-react";
import { useState } from "react";

import { getPublicEvent } from "@/lib/public-event";

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const event = getPublicEvent(slug);
  const selectedId = searchParams.get("ticket") ?? event.tickets[0].id;
  const selected = event.tickets.find((ticket) => ticket.id === selectedId) ?? event.tickets[0];
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const subtotal = selected.price * quantity;
  const fees = Math.round(subtotal * 0.08);
  const total = subtotal + fees;

  if (step === 3) {
    return (
      <main className="checkout-shell">
        <nav className="checkout-nav">
          <Link className="public-brand" href="/">
            <span className="public-brand-mark" />
            <span>eventflow</span>
          </Link>
        </nav>
        <section className="checkout-confirmation" aria-live="polite">
          <span className="confirmation-check"><Check size={28} /></span>
          <span className="checkout-kicker">Demo order preview</span>
          <h1>Your order is ready to preview.</h1>
          <p>
            This demo does not collect payment or issue tickets. A real order will
            only be confirmed after secure payment is integrated.
          </p>
          <div className="confirmation-ticket">
            <span className="confirmation-art">{event.title.slice(0, 2).toUpperCase()}</span>
            <div>
              <small>{event.date} · {event.time}</small>
              <strong>{event.title}</strong>
              <span>{quantity} × {selected.name}</span>
            </div>
          </div>
          <button className="checkout-primary" disabled type="button">Ticket delivery coming soon</button>
          <Link className="confirmation-link" href={`/events/${event.slug}`}>
            Back to event
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-shell">
      <nav className="checkout-nav">
        <Link className="checkout-back" href={`/events/${event.slug}`}>
          <ArrowLeft size={16} />
          <span>Back to event</span>
        </Link>
        <span className="checkout-nav-brand">
          <span className="public-brand-mark" />
          <strong>eventflow</strong>
        </span>
        <span className="checkout-secure"><LockKeyhole size={14} /> Secure checkout</span>
      </nav>

      <div className="checkout-layout">
        <section className="checkout-form">
          <div className="checkout-progress" aria-label={`Step ${step} of 2`}>
            <div className={step >= 1 ? "active" : ""}><span>1</span><strong>Tickets</strong></div>
            <i />
            <div className={step >= 2 ? "active" : ""}><span>2</span><strong>Details</strong></div>
          </div>

          {step === 1 ? (
            <div className="checkout-step">
              <span className="checkout-kicker">Your order</span>
              <h1>Select tickets</h1>
              <div className="checkout-ticket-row">
                <span className="checkout-ticket-icon"><Ticket size={21} /></span>
                <div>
                  <strong>{selected.name}</strong>
                  <small>${selected.price} each</small>
                </div>
                <div className="quantity-control" aria-label="Ticket quantity">
                  <button
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    type="button"
                  >
                    <Minus size={15} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    disabled={quantity >= 6}
                    onClick={() => setQuantity((value) => Math.min(6, value + 1))}
                    type="button"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <button className="checkout-primary" onClick={() => setStep(2)} type="button">
                Continue to details
              </button>
            </div>
          ) : (
            <div className="checkout-step">
              <span className="checkout-kicker">Contact details</span>
              <h1>Who’s going?</h1>
              <div className="checkout-fields">
                <label>
                  Full name
                  <input
                    autoFocus
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Alex Morgan"
                    value={name}
                  />
                </label>
                <label>
                  Email address
                  <input
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="alex@example.com"
                    type="email"
                    value={email}
                  />
                </label>
              </div>
              <div className="payment-placeholder">
                <LockKeyhole size={16} />
                <div>
                  <strong>Demo checkout only</strong>
                  <span>No payment is collected and no ticket is issued.</span>
                </div>
              </div>
              <div className="checkout-actions">
                <button className="checkout-secondary" onClick={() => setStep(1)} type="button">
                  Back
                </button>
                <button
                  className="checkout-primary"
                  disabled={!name.trim() || !email.includes("@")}
                  onClick={() => setStep(3)}
                  type="button"
                >
                  Preview order · ${total}
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="checkout-summary" aria-label="Order summary">
          <span className="summary-art">{event.title.slice(0, 2).toUpperCase()}</span>
          <div className="summary-event">
            <span>{event.date}</span>
            <strong>{event.title}</strong>
            <small>{event.venue} · {event.time}</small>
          </div>
          <div className="summary-lines">
            <div><span>{quantity} × {selected.name}</span><strong>${subtotal}</strong></div>
            <div><span>Fees</span><strong>${fees}</strong></div>
          </div>
          <div className="summary-total"><span>Total</span><strong>${total}</strong></div>
        </aside>
      </div>
    </main>
  );
}
