# Shared Calendar — API Contract

Base URL: `http://localhost:8080/api`

All protected routes require:
`Authorization: Bearer <token>`

---

## Auth

### POST /auth/register

**Request:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "password": "abc123",
  "dateOfBirth": "1990-01-01",
  "avatarColor": "#FF5733"
}
```

**Response:**

```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "abc-123",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "avatarColor": "#FF5733",
    "createdAt": "2026-03-23T00:00:00"
  }
}
```

---

### POST /auth/login

**Request:**

```json
{
  "email": "john@example.com",
  "password": "abc123"
}
```

**Response:**

```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "abc-123",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "avatarColor": "#FF5733",
    "createdAt": "2026-03-23T00:00:00"
  }
}
```

---

### POST /auth/logout

**Request:** none (token sent in header)

**Response:**

```json
{ "message": "Successfully logged out" }
```

---

## User

### PUT /user/profile

**Request:**

```json
{
  "email": "newemail@example.com",
  "avatarColor": "#FF5733"
}
```

**Response:**

```json
{
  "id": "abc-123",
  "firstName": "John",
  "lastName": "Smith",
  "email": "newemail@example.com",
  "avatarColor": "#FF5733",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### DELETE /user

**Request:** none (token sent in header)

**Response:**

```json
{ "message": "Account successfully deleted" }
```

---

## Friends

### POST /friends/{userId}

Send a friend request.

**Request:** none

**Response:**

```json
{
  "id": "frnd-123",
  "sender": {
    "id": "abc-123",
    "firstName": "John",
    "lastName": "Smith",
    "avatarColor": "#FF5733"
  },
  "invitee": {
    "id": "xyz-456",
    "firstName": "Jane",
    "lastName": "Doe",
    "avatarColor": "#33FF57"
  },
  "status": "pending",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### PUT /friends/{friendshipId}

Accept or reject a friend request.

**Request:**

```json
{ "status": "accepted" }
```

or

```json
{ "status": "rejected" }
```

**Response:**

```json
{
  "id": "frnd-123",
  "sender": {
    "id": "abc-123",
    "firstName": "John",
    "lastName": "Smith",
    "avatarColor": "#FF5733"
  },
  "invitee": {
    "id": "xyz-456",
    "firstName": "Jane",
    "lastName": "Doe",
    "avatarColor": "#33FF57"
  },
  "status": "accepted",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### GET /friends

Get your full friend list.

**Response:**

```json
[
  {
    "id": "frnd-123",
    "friend": {
      "id": "xyz-456",
      "firstName": "Jane",
      "lastName": "Doe",
      "avatarColor": "#33FF57"
    },
    "status": "accepted",
    "createdAt": "2026-03-23T00:00:00"
  }
]
```

---

### DELETE /friends/{friendshipId}

Remove a friend.

**Response:**

```json
{ "message": "Friend removed" }
```

---

## Groups

### POST /group

**Request:**

```json
{ "name": "Europe Trip 2026" }
```

**Response:**

```json
{
  "id": "grp-123",
  "name": "Europe Trip 2026",
  "owner": {
    "id": "abc-123",
    "firstName": "John",
    "lastName": "Smith",
    "avatarColor": "#FF5733"
  },
  "members": [],
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### GET /group/{groupId}

**Response:**

```json
{
  "id": "grp-123",
  "name": "Europe Trip 2026",
  "owner": {
    "id": "abc-123",
    "firstName": "John",
    "lastName": "Smith",
    "avatarColor": "#FF5733"
  },
  "members": [
    {
      "id": "xyz-456",
      "firstName": "Jane",
      "lastName": "Doe",
      "avatarColor": "#33FF57"
    }
  ],
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### POST /group/{groupId}/invite

Invite a friend to the group.

**Request:**

```json
{ "friendId": "xyz-456" }
```

**Response:**

```json
{ "message": "Invite sent to Jane Doe" }
```

---

### POST /group/{groupId}/join

Join a group via invite.

**Request:**

```json
{ "inviteToken": "tok-abc123" }
```

**Response:**

```json
{
  "id": "grp-123",
  "name": "Europe Trip 2026",
  "members": [
    {
      "id": "xyz-456",
      "firstName": "Jane",
      "lastName": "Doe",
      "avatarColor": "#33FF57"
    }
  ]
}
```

---

### DELETE /group/{groupId}/leave

**Request:** none

**Response:**

```json
{ "message": "You have left the group" }
```

---

## Calendar

### POST /calendar

Import a calendar from Google or Apple.

**Request:**

```json
{
  "source": "google",
  "name": "My Google Calendar"
}
```

**Response:**

```json
{
  "id": "cal-123",
  "name": "My Google Calendar",
  "source": "google",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### GET /calendar

Get all your calendars.

**Response:**

```json
[
  {
    "id": "cal-123",
    "name": "My Google Calendar",
    "source": "google",
    "createdAt": "2026-03-23T00:00:00"
  }
]
```

---

### DELETE /calendar/{calendarId}

**Response:**

```json
{ "message": "Calendar deleted" }
```

---

## Calendar Events

### POST /calendar/{calendarId}/events

Add a manual event to a calendar.

**Request:**

```json
{
  "title": "Doctor appointment",
  "startDateTime": "2026-06-14T09:00:00",
  "endDateTime": "2026-06-14T10:00:00"
}
```

**Response:**

```json
{
  "id": "evt-123",
  "calendarId": "cal-123",
  "title": "Doctor appointment",
  "startDateTime": "2026-06-14T09:00:00",
  "endDateTime": "2026-06-14T10:00:00",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### GET /calendar/{calendarId}/events

Get all events in a calendar.

**Response:**

```json
[
  {
    "id": "evt-123",
    "calendarId": "cal-123",
    "title": "Doctor appointment",
    "startDateTime": "2026-06-14T09:00:00",
    "endDateTime": "2026-06-14T10:00:00",
    "createdAt": "2026-03-23T00:00:00"
  }
]
```

---

### PUT /calendar/{calendarId}/events/{eventId}

Update a calendar event.

**Request:**

```json
{
  "title": "Doctor appointment (updated)",
  "startDateTime": "2026-06-14T10:00:00",
  "endDateTime": "2026-06-14T11:00:00"
}
```

**Response:**

```json
{
  "id": "evt-123",
  "calendarId": "cal-123",
  "title": "Doctor appointment (updated)",
  "startDateTime": "2026-06-14T10:00:00",
  "endDateTime": "2026-06-14T11:00:00",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### DELETE /calendar/{calendarId}/events/{eventId}

**Response:**

```json
{ "message": "Event deleted" }
```

---

## Availability

### GET /group/{groupId}/availability

Get merged availability for all group members.

**Response:**

```json
{
  "members": [
    {
      "user": {
        "id": "abc-123",
        "firstName": "John",
        "lastName": "Smith",
        "avatarColor": "#FF5733"
      },
      "blockedDates": ["2026-06-14", "2026-06-15"]
    }
  ],
  "freeDays": ["2026-06-17", "2026-06-18"]
}
```

---

## Trips

### POST /trip

**Request:**

```json
{
  "name": "Europe Trip 2026",
  "dest": "Lisbon",
  "cover": "🇵🇹",
  "groupId": "grp-123",
  "startDate": "2026-06-17",
  "endDate": "2026-06-24"
}
```

**Response:**

```json
{
  "id": "trp-123",
  "name": "Europe Trip 2026",
  "dest": "Lisbon",
  "cover": "🇵🇹",
  "groupId": "grp-123",
  "startDate": "2026-06-17",
  "endDate": "2026-06-24",
  "status": "planning",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### GET /trip

Get all your trips.

**Response:**

```json
[
  {
    "id": "trp-123",
    "name": "Europe Trip 2026",
    "dest": "Lisbon",
    "cover": "🇵🇹",
    "groupId": "grp-123",
    "startDate": "2026-06-17",
    "endDate": "2026-06-24",
    "status": "planning",
    "createdAt": "2026-03-23T00:00:00"
  }
]
```

---

### GET /trip/{tripId}

**Response:** same shape as single trip above

---

### DELETE /trip/{tripId}

**Response:**

```json
{ "message": "Trip deleted" }
```

---

## Itinerary

### POST /trip/{tripId}/itinerary

**Request:**

```json
{ "notes": "Focus on food and culture" }
```

**Response:**

```json
{
  "id": "itn-123",
  "tripId": "trp-123",
  "notes": "Focus on food and culture",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### GET /trip/{tripId}/itinerary

**Response:** same shape as above

---

## Events

### POST /itinerary/{itineraryId}/events

**Request:**

```json
{
  "name": "Sunset dinner at Alfama",
  "description": "Traditional Fado restaurant",
  "location": "Alfama, Lisbon",
  "address": "Rua de São Pedro 12",
  "startTime": "2026-06-18T19:00:00",
  "endTime": "2026-06-18T21:00:00",
  "date": "2026-06-18",
  "scope": "group"
}
```

**Response:**

```json
{
  "id": "ev-123",
  "itineraryId": "itn-123",
  "name": "Sunset dinner at Alfama",
  "description": "Traditional Fado restaurant",
  "location": "Alfama, Lisbon",
  "address": "Rua de São Pedro 12",
  "startTime": "2026-06-18T19:00:00",
  "endTime": "2026-06-18T21:00:00",
  "date": "2026-06-18",
  "scope": "group",
  "status": "pending",
  "createdBy": "abc-123",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### GET /itinerary/{itineraryId}/events

**Response:** array of event objects above

---

### PUT /itinerary/{itineraryId}/events/{eventId}

**Request:** same fields as POST, all optional

**Response:** updated event object

---

### DELETE /itinerary/{itineraryId}/events/{eventId}

**Response:**

```json
{ "message": "Event deleted" }
```

---

## RSVP

### POST /event/{eventId}/rsvp

Confirm attendance.

**Request:** none (token identifies the user)

**Response:**

```json
{
  "id": "rsvp-123",
  "eventId": "ev-123",
  "userId": "abc-123",
  "createdAt": "2026-03-23T00:00:00"
}
```

---

### GET /event/{eventId}/rsvp

Get all confirmed attendees.

**Response:**

```json
[
  {
    "id": "rsvp-123",
    "eventId": "ev-123",
    "user": {
      "id": "abc-123",
      "firstName": "John",
      "lastName": "Smith",
      "avatarColor": "#FF5733"
    },
    "createdAt": "2026-03-23T00:00:00"
  }
]
```

---

### DELETE /event/{eventId}/rsvp

Cancel attendance.

**Response:**

```json
{ "message": "RSVP cancelled" }
```

---

## Blocked Dates

Managed automatically by the server when a trip is confirmed. No public endpoints needed.
