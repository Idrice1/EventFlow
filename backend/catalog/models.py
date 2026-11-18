from django.db import models
from django.utils.text import slugify


class Event(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        CANCELLED = "cancelled", "Cancelled"

    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField()
    venue = models.CharField(max_length=240)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["starts_at"]

    def save(self, *args: object, **kwargs: object) -> None:
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


class TicketType(models.Model):
    event = models.ForeignKey(
        Event,
        related_name="ticket_types",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.PositiveIntegerField()
    sold = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["price", "name"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(sold__lte=models.F("capacity")),
                name="ticket_sold_not_over_capacity",
            ),
        ]

    @property
    def remaining(self) -> int:
        return max(0, self.capacity - self.sold)

    def __str__(self) -> str:
        return f"{self.event.title} — {self.name}"
