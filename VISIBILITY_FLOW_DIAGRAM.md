# Visibility Feature - Visual Flow

## **Complete System Flow**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STEP 1: USER SETS VISIBILITY                   │
└─────────────────────────────────────────────────────────────────────────┘

User on Share Page
       │
       ├─→ Sees Toggle Buttons:
       │   ┌──────────────┬──────────────┐
       │   │  🌐 PUBLIC   │  🔒 PRIVATE  │
       │   └──────────────┴──────────────┘
       │
       └─→ Clicks Button (e.g., "PRIVATE")
            │
            ├─→ Show Confirmation Dialog ✓
            │   "Are you sure?"
            │
            └─→ User Clicks "Yes, Change to PRIVATE"
                 │
                 └─→ Send API Request to Backend

┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 2: BACKEND UPDATES SUPABASE                       │
└─────────────────────────────────────────────────────────────────────────┘

API Endpoint: PATCH /api/polls/[pollId]/visibility
│
├─→ Receive: { visibility: "private" }
│
├─→ Check User Authorization
│   ├─ Is user logged in? → YES
│   └─ Is user the poll owner? → YES (user_id matches)
│
├─→ Update SQL Query:
│   UPDATE polls 
│   SET visibility = 'private' 
│   WHERE id = '{pollId}'
│
└─→ Supabase Database Updated ✓

┌─────────────────────────────────────────────────────────────────────────┐
│              STEP 3: SUPABASE DATABASE STATE                            │
└─────────────────────────────────────────────────────────────────────────┘

Before Update:
┌─────────────────────────────────────┐
│ polls table                         │
├─────────────────┬───────────────────┤
│ id              │ poll-123          │
│ title           │ My Poll           │
│ visibility      │ public            │
│ is_published    │ true              │
│ user_id         │ user-456          │
└─────────────────┴───────────────────┘

After Update:
┌─────────────────────────────────────┐
│ polls table                         │
├─────────────────┬───────────────────┤
│ id              │ poll-123          │
│ title           │ My Poll           │
│ visibility      │ private    ← CHANGED
│ is_published    │ true              │
│ user_id         │ user-456          │
└─────────────────┴───────────────────┘

Frontend Shows Success Message:
┌──────────────────────────────────────────┐
│ ✓ Poll is now PRIVATE!                   │
└──────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│           STEP 4: USER TRIES TO ACCESS VIA LINK/QR CODE                │
└─────────────────────────────────────────────────────────────────────────┘

User Opens Link: http://localhost:3000/p/poll-123
       │
       └─→ Page Loads: app/p/[pollId]/page.tsx
            │
            ├─→ Fetch Poll from Supabase
            │   ├─ Query: SELECT * FROM polls WHERE id = 'poll-123'
            │   └─ Gets: { visibility: 'private', is_published: true, ... }
            │
            ├─→ Get Current User
            │   ├─ If USER IS LOGGED IN as owner (user_id matches)
            │   │  └─→ isOwner = TRUE
            │   │
            │   └─ If USER IS NOT LOGGED IN
            │      └─→ isOwner = FALSE (user = null)
            │
            └─→ ACCESS CONTROL CHECK
                ├─ Is poll PRIVATE?
                │  ├─ YES: Check if user is owner
                │  │  ├─ IF OWNER: ✅ LOAD POLL (allow access)
                │  │  └─ IF NOT OWNER: ❌ SHOW ERROR
                │  │            "This poll is private and not accessible"
                │  │
                │  └─ NO (poll is PUBLIC): Check if published
                │     ├─ IF PUBLISHED: ✅ LOAD POLL (anyone can access)
                │     └─ IF NOT PUBLISHED: ❌ SHOW ERROR
                │              "Poll not found or is not published"

┌─────────────────────────────────────────────────────────────────────────┐
│                    DECISION MATRIX: LINK/QR WORKS?                      │
└─────────────────────────────────────────────────────────────────────────┘

Scenario 1: PUBLIC Poll (visibility = 'public')
┌──────────────────────────────────────────────────────────────────────┐
│ is_published = TRUE                                                 │
│ ├─ OWNER clicks link → ✅ WORKS                                     │
│ ├─ STRANGER clicks link → ✅ WORKS                                  │
│ └─ QR Code Works → ✅ YES                                           │
│                                                                      │
│ is_published = FALSE                                                │
│ ├─ OWNER clicks link → ❌ "Poll not found or not published"        │
│ ├─ STRANGER clicks link → ❌ "Poll not found or not published"     │
│ └─ QR Code Works → ❌ NO                                            │
└──────────────────────────────────────────────────────────────────────┘

Scenario 2: PRIVATE Poll (visibility = 'private')
┌──────────────────────────────────────────────────────────────────────┐
│ is_published = TRUE                                                 │
│ ├─ OWNER clicks link → ✅ WORKS                                     │
│ ├─ STRANGER clicks link → ❌ "This poll is private"                 │
│ └─ QR Code Working for OWNER ONLY → ⚠️ SELECTIVE                    │
│                                                                      │
│ is_published = FALSE                                                │
│ ├─ OWNER clicks link → ❌ "Poll not found or not published"        │
│ ├─ STRANGER clicks link → ❌ "This poll is private"                 │
│ └─ QR Code Works → ❌ NO                                            │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                   RLS SECURITY: DATABASE LEVEL                          │
└─────────────────────────────────────────────────────────────────────────┘

Supabase RLS Policy Name: "Users can read polls by visibility"

Policy Logic:
┌──────────────────────────────────────────────────────────────┐
│ User can SELECT from polls IF:                               │
│                                                              │
│ (visibility = 'public' AND is_published = true)              │
│     OR                                                       │
│ auth.uid() = user_id (user is the owner)                    │
└──────────────────────────────────────────────────────────────┘

This means:
├─ Public Published Polls → Anyone reads them
├─ Public Unpublished Polls → Query returns empty (blocked)
├─ Private Polls from Owner → Owner reads them
└─ Private Polls from Others → Query returns empty (blocked)

┌─────────────────────────────────────────────────────────────────────────┐
│                  FILES INVOLVED IN THIS SYSTEM                          │
└─────────────────────────────────────────────────────────────────────────┘

📁 FRONTEND:
├─ components/pollsAll/PollShare.tsx
│  ├─ Shows visibility toggle buttons
│  ├─ Shows confirmation dialog
│  └─ Sends API request with { visibility: 'public'|'private' }
│
└─ app/p/[pollId]/page.tsx
   ├─ Fetches poll from Supabase
   ├─ Checks visibility column
   ├─ Determines access (owner only / public)
   ├─ Shows error if not accessible
   └─ Loads poll preview if accessible

📁 BACKEND:
└─ app/api/polls/[pollId]/visibility/route.ts
   ├─ Receives PATCH request
   ├─ Validates user is poll owner
   ├─ Updates Supabase: visibility column
   └─ Returns success/error

📁 DATABASE:
└─ supabase/migrations/add_visibility_to_polls.sql
   ├─ Adds visibility column
   ├─ Creates RLS policy
   └─ Creates index for performance

📁 SETUP:
└─ SUPABASE_SETUP.sql
   ├─ Main setup file with visibility included
   └─ RLS policies for access control

┌─────────────────────────────────────────────────────────────────────────┐
│                         KEY POINTS TO REMEMBER                          │
└─────────────────────────────────────────────────────────────────────────┘

✓ Visibility stored in: polls.visibility column
✓ Values: 'public' or 'private'
✓ Default: 'public' (backward compatible)

✓ Update happens when:
  └─ User clicks toggle → Confirms → API updates → Supabase saves

✓ Access controlled by TWO layers:
  ├─ FRONTEND: app/p/[pollId]/page.tsx checks visibility
  └─ BACKEND: Supabase RLS policy enforces access

✓ Link works based on:
  ├─ PUBLIC + published → Anyone
  ├─ PUBLIC + unpublished → Nobody
  ├─ PRIVATE + published → Owner only
  └─ PRIVATE + unpublished → Nobody

✓ QR Code same as link:
  └─ Works based on same rules above
