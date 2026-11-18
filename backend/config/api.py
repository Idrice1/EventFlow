from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema

from catalog.models import Event as EventModel
from catalog.models import TicketType

api = NinjaAPI(
    title="EventFlow API",
    description="REST API for the EventFlow event and ticketing platform.",
    version="0.1.0",
    urls_namespace="eventflow_api",
)


@api.get("/health", tags=["System"])
def health(request) -> dict[str, str]:
    return {"status": "ok", "service": "eventflow-api"}


class TicketSchema(Schema):
    id: int
    name: str
    price: str
    capacity: int
    remaining: int


class EventSchema(Schema):
    id: int
    title: str
    slug: str
    description: str
    starts_at: str
    venue: str
    status: str
    tickets: list[TicketSchema]


@api.get("/events", response=list[EventSchema], tags=["Events"])
def list_events(request) -> list[dict[str, object]]:
    events = EventModel.objects.filter(
        status=EventModel.Status.PUBLISHED
    ).prefetch_related(
        Prefetch(
            "ticket_types",
            queryset=TicketType.objects.filter(active=True),
        )
    )
    return [serialize_event(event) for event in events]


@api.get("/events/{slug}", response=EventSchema, tags=["Events"])
def get_event(request, slug: str) -> dict[str, object]:
    event = get_object_or_404(
        EventModel.objects.filter(
            status=EventModel.Status.PUBLISHED
        ).prefetch_related(
            Prefetch(
                "ticket_types",
                queryset=TicketType.objects.filter(active=True),
            )
        ),
        slug=slug,
    )
    return serialize_event(event)


def serialize_event(event: EventModel) -> dict[str, object]:
    return {
        "id": event.id,
        "title": event.title,
        "slug": event.slug,
        "description": event.description,
        "starts_at": event.starts_at.isoformat(),
        "venue": event.venue,
        "status": event.status,
        "tickets": [
            {
                "id": ticket.id,
                "name": ticket.name,
                "price": str(ticket.price),
                "capacity": ticket.capacity,
                "remaining": ticket.remaining,
            }
            for ticket in event.ticket_types.all()
        ],
    }
