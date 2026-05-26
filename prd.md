CodeArena — Product Requirements Document (PRD)
Project Name

CodeArena

Project Type

Real-time competitive coding battle platform

Product Vision

CodeArena is a production-grade real-time coding battle platform where developers compete in 1v1 coding matches using live synchronized battle rooms.

The project is focused heavily on:

backend engineering
real-time systems
WebSocket architecture
scalable application design
authentication systems
state synchronization
production-grade development practices

This is NOT a CRUD-based portfolio project.

The main purpose is to deeply learn and demonstrate:

scalable backend architecture
real-time communication systems
distributed state synchronization
secure authentication systems
database design
modern full-stack engineering
1. Problem Statement

Most beginner coding platforms focus only on:

static coding problems
simple dashboards
basic CRUD functionality

They do NOT teach:

real-time systems
synchronization
event-driven architecture
scalable backend engineering

CodeArena solves this by creating:

real-time coding battles
synchronized battle state
room-based architecture
live updates
competitive interactions
2. Primary Goals
Engineering Goals

The project should help learn:

WebSocket systems
scalable backend architecture
JWT authentication
refresh token systems
Redis caching
room-based socket architecture
event-driven systems
PostgreSQL relational design
modular monolith architecture
production-grade engineering practices
Product Goals

Build a platform where users can:

signup/login securely
create battle rooms
join battles
compete in real time
see live battle updates
track match history
3. Target Users
Primary Users
college students
DSA learners
competitive programmers
developers preparing for interviews
Secondary Users
developers wanting coding practice
friends competing together
coding communities
4. Core Features
Feature 1 — Authentication System
Description

Secure authentication system for platform access.

Functional Requirements
Signup

Users can:

create account
enter username
enter email
enter password
Login

Users can:

login using credentials
receive authenticated session
Logout

Users can:

invalidate session securely
Protected Routes

Only authenticated users can:

create battles
join battles
access history
Email Verification

Users must:

verify email using OTP code
Google OAuth

Users can:

login using Google OAuth
Technical Requirements
Authentication Stack
JWT authentication
refresh tokens
HTTP-only cookies
bcrypt hashing
Security Requirements
hashed passwords
protected cookies
token expiration
refresh rotation
secure middleware
Feature 2 — 1v1 Coding Battles
Description

Core feature of the platform.

Users compete in real-time coding matches.

Functional Requirements
Create Battle

User can:

create battle room
select topic
select difficulty
Join Battle

Users can:

join using room code
Battle Timer

System should:

synchronize timer for both users
Battle State

System should synchronize:

room state
participants
battle progress
submissions
winner state
Winner Detection

System determines:

first accepted solution
battle completion
Match Completion

After battle:

results displayed
history stored
Supported Topics
Arrays
Strings
Trees
Graphs
Dynamic Programming
Recursion
Sliding Window
Greedy
Stack & Queue
Difficulty Levels
Easy
Medium
Hard
Feature 3 — Match History
Description

Stores previous battles.

Functional Requirements

Users can view:

win/loss history
timestamps
opponent details
battle topics
difficulty
match result
5. Non-Functional Requirements
Scalability

Architecture should support:

increasing rooms
increasing socket connections
future Redis scaling
Maintainability

Codebase must:

use modular architecture
separate concerns
avoid large controllers
Security

Application must:

validate tokens
hash passwords
use secure cookies
protect APIs
Performance

Real-time updates should:

have low latency
minimize unnecessary events
avoid polling
Reliability

Battle state synchronization must:

remain consistent
prevent duplicate winner events
avoid race conditions
6. System Architecture
Architecture Style

Modular Monolith

Reason:

easier debugging
easier development
scalable enough initially
Future Scalability

Future separation possible:

auth service
battle service
socket service

But NOT initially.

7. Frontend Architecture
Stack
Next.js
TypeScript
Tailwind CSS
Zustand
TanStack Query
Socket.IO Client
Responsibilities

Frontend handles:

UI rendering
API requests
socket connections
battle interface
state management
8. Backend Architecture
Stack
Node.js
Express.js
TypeScript
Prisma ORM
Socket.IO
JWT
Redis (later)
Responsibilities

Backend handles:

authentication
battle logic
socket events
synchronization
room management
DB operations
9. Database Design
Database

PostgreSQL using Neon

ORM

Prisma ORM

Core Models
User

Stores:

username
email
password
verification status
Battle

Stores:

topic
difficulty
room code
status
winner
BattleParticipant

Stores:

participant relation
result
submission timing
10. Real-Time Architecture
Why WebSockets?

Battles require:

instant updates
synchronized state
live timer updates

HTTP polling is inefficient.

Real-Time Events
Battle Events
battle:create
battle:join
battle:start
battle:update
battle:end
Timer Events
timer:start
timer:update
timer:end
Room-Based Architecture

Each battle uses isolated socket rooms.

Benefits:

isolated communication
scalable socket management
clean synchronization