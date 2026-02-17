# LiveSeat – Real-Time Smart Event Booking Platform

LiveSeat is a real-time event booking web application that allows users to visually explore stage layouts, select seats interactively, and reserve them with live availability tracking.

It solves the problem of unclear seat visibility, fake urgency, and chaotic booking experiences by providing a transparent, real-time seat selection system.

---

#  Ideation And Scope

##  Clear Problem

Users booking tickets for events (concerts, theaters, shows) often:
- Cannot clearly see the stage perspective from their seat
- Experience seat conflicts during booking
- Lose seats during payment due to lack of temporary locking

LiveSeat solves this by providing a real-time visual seat map with temporary locking and live updates.

---

##  Project

LiveSeat is a real-time event booking platform with an interactive seat map.  
Users can visually explore the venue layout, select seats, and reserve them with live availability tracking.

---

## Main User

**Event Attendee**
- Wants to book tickets
- Wants to see stage visibility before choosing
- Wants to avoid losing seats during checkout

---

## Core Workflow

1. User browses events
2. User opens event seat map
3. User selects available seat
4. System locks seat for 2 minutes
5. User confirms reservation
6. Seat becomes permanently reserved

---

#  Design And Product Thinking

##  Main User Flow

Browse Events  
→ View Event Details  
→ Open Interactive Seat Map  
→ Select Seat  
→ Seat Locked
→ Confirm Reservation  
→ Success Screen  

---

##  Main Screens

1. Event Listing Page
2. Interactive Seat Map Page
3. Reservation Confirmation Page
4. Organizer Event Creation Page 

---

##  User Stories

### 1. Browse Events
**As a user**, I want to view available events so that I can choose one to attend.  
**Acceptance Criteria:**
- Event list displays title, date, location
- Clicking event opens details page

---

### 2. View Seat Map
**As a user**, I want to see a visual layout of seats so I can choose where to sit.  
**Acceptance Criteria:**
- Seats display in grid/layout format
- Available seats are clearly distinguishable
- Reserved seats are marked differently

---

### 3. Select Seat
**As a user**, I want to click on a seat to reserve it.  
**Acceptance Criteria:**
- Clicking an available seat locks it
- Locked seat changes color
- Countdown timer appears (2 minutes)

---

### 4. Prevent Double Booking
**As a user**, I want real-time updates so I don’t select an already taken seat.  
**Acceptance Criteria:**
- Seat availability updates instantly
- If another user reserves a seat, it updates live

---

### 5. Confirm Reservation
**As a user**, I want to confirm my booking before timeout.  
**Acceptance Criteria:**
- Confirmation button finalizes reservation
- Seat status becomes permanently reserved

---

### 6. Auto Release Seat
**As a system**, I want to release locked seats after timeout.  
**Acceptance Criteria:**
- After 2 minutes without confirmation
- Seat becomes available again

---

### 7. Organizer Creates Event
**As an organizer**, I want to create an event and define seat layout.  
**Acceptance Criteria:**
- Organizer can define event name, date
- Organizer selects a seat layout template
- Event is published

---

##  Basic Data Model

### User
- id
- name
- email
- role (attendee | organizer)

---

### Event
- id
- title
- availableSeats
- date
- location
- organizerId
- stage
- type

---

### Seat
- id
- eventId
- row
- number
- price
- status (available | locked | reserved)
- lockedBy (userId)
- lockExpiresAt

---

### Reservation
- id
- userId
- eventId
- seatId
- status (pending | confirmed)
- createdAt

