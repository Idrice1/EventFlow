export type PublicTicket = {
  id: string;
  name: string;
  description: string;
  price: number;
  remaining: number;
};

export type PublicEvent = {
  slug: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  category: string;
  description: string;
  organizer: string;
  accent: "afterglow" | "studio" | "table";
  tickets: PublicTicket[];
};

export const publicEvents: PublicEvent[] = [
  {
    slug: "afterglow-festival",
    title: "Afterglow Festival",
    date: "SATURDAY, DECEMBER 5",
    time: "7:00 PM",
    venue: "Pier 27",
    address: "Pier 27, The Embarcadero, San Francisco",
    category: "Music & nightlife",
    organizer: "Studio North",
    accent: "afterglow",
    description:
      "An open-air night of immersive live music, warm lights, and late-city energy. Discover emerging voices and headline performances across two stages.",
    tickets: [
      {
        id: "general",
        name: "General admission",
        description: "Entry to both stages",
        price: 60,
        remaining: 658,
      },
      {
        id: "early",
        name: "Early entry",
        description: "Venue access from 6 PM",
        price: 82,
        remaining: 128,
      },
      {
        id: "vip",
        name: "VIP terrace",
        description: "Terrace access and private bar",
        price: 145,
        remaining: 36,
      },
    ],
  },
];

export function getPublicEvent(slug: string) {
  return publicEvents.find((event) => event.slug === slug);
}
