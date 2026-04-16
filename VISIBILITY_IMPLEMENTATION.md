# Visibility Feature Implementation Guide

## Overview
This guide explains how the visibility feature works in your Pollify application. Users can now set polls as either **Public** (accessible to everyone) or **Private** (only visible to the poll owner).

---

## Step 1: Database Migration ✅
**File:** `supabase/migrations/add_visibility_to_polls.sql`

### What it does:
- Adds `visibility` column to `polls` table (values: 'public' or 'private')
- Creates an index for faster queries
- Updates RLS policies to check visibility status
- Sets default visibility to 'public'

### To apply the migration:
```bash
# Run Supabase migrations
npx supabase migration up
```

---

## Step 2: Backend API Updates ✅

### A. Visibility Toggle API
**File:** `app/api/polls/[pollId]/visibility/route.ts`

**Endpoint:** `PATCH /api/polls/{pollId}/visibility`

**Request Body:**
```json
{
  "visibility": "public" // or "private"
}
```

**Example Usage:**
```javascript
const response = await fetch('/api/polls/poll-123/visibility', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ visibility: 'private' })
})
```

### B. Poll Creation API
**File:** `app/api/polls/create/route.ts`

**Updated:** Now accepts `visibility` in settings

**Settings Parameter:**
```json
{
  "visibility": "public",
  "allowMultiple": false,
  "shareWithoutImage": false,
  "shareWithoutOptions": false
}
```

---

## Step 3: Frontend Components ✅

### A. VisibilityToggle Component
**File:** `components/pollsAll/VisibilityToggle.tsx`

**Usage:**
```tsx
import VisibilityToggle from '@/components/pollsAll/VisibilityToggle'

<VisibilityToggle 
  pollId="poll-id-123"
  currentVisibility="public"
  onVisibilityChange={(newVis) => console.log(newVis)}
/>
```

**Features:**
- Toggle between Public and Private
- Shows current visibility status
- Handles API calls automatically
- Error handling and loading states

### B. VisibilityBadge Component
**File:** `components/pollsAll/VisibilityBadge.tsx`

**Usage:**
```tsx
import VisibilityBadge from '@/components/pollsAll/VisibilityBadge'

<VisibilityBadge visibility="public" size="md" />
```

**Props:**
- `visibility`: 'public' | 'private'
- `size`: 'sm' | 'md' (optional, defaults to 'md')

---

## Step 4: Dashboard Integration ✅
**File:** `app/dashboard/poll/[pollId]/page.tsx`

**Changes:**
- Added new "Settings" tab in poll dashboard
- Integrated VisibilityToggle component
- Updated Poll interface to include visibility field

**New Tab Navigation:**
```
Result | Preview | Share | Settings
```

---

## How It Works

### Access Control (via RLS Policies)

**Public Poll:**
- Accessible to everyone when `is_published = true`
- Anyone can view, but only owner can edit

**Private Poll:**
- Only visible to the poll owner
- Hidden from all other users

### RLS Policy Logic:
```sql
-- Users can see:
-- 1. Public polls that are published (visibility='public' AND is_published=true)
-- 2. Or their own polls (regardless of visibility/published status)

(visibility = 'public' AND is_published = true)
OR
auth.uid() = user_id
```

---

## Usage Instructions for Users

### Setting Poll Visibility During Creation

1. Go to Create Poll page
2. In the settings, set `visibility` to either:
   - **Public** - Anyone can see and vote
   - **Private** - Only you can see the poll

### Changing Visibility After Creation

1. Go to Dashboard → Choose a Poll
2. Click on **Settings** tab
3. Click the visibility button:
   - 🌐 **Public** - Make poll accessible to everyone
   - 🔒 **Private** - Make poll only visible to you
4. Status updates automatically

---

## Database Schema

### Updated Polls Table
```sql
CREATE TABLE polls (
  id uuid primary key,
  user_id uuid,
  title text,
  description text,
  poll_image_url text,
  is_published boolean,
  is_closed boolean,
  visibility varchar(10) DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  allow_multiple boolean,
  share_without_image boolean,
  share_without_options boolean,
  created_at timestamp,
  updated_at timestamp
);
```

---

## API Examples

### Create a Public Poll
```javascript
const formData = new FormData();
formData.append('title', 'My Poll');
formData.append('description', 'A public poll');
formData.append('settings', JSON.stringify({ 
  visibility: 'public',
  allowMultiple: false 
}));
formData.append('pollImage', imageFile);
formData.append('options', JSON.stringify([
  { text: 'Option 1' },
  { text: 'Option 2' }
]));

const response = await fetch('/api/polls/create', {
  method: 'POST',
  body: formData
});
```

### Create a Private Poll
```javascript
// Same as above, but with:
formData.append('settings', JSON.stringify({ 
  visibility: 'private',
  allowMultiple: false 
}));
```

### Toggle Visibility
```javascript
// Make poll private
fetch('/api/polls/poll-123/visibility', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ visibility: 'private' })
});

// Make poll public
fetch('/api/polls/poll-123/visibility', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ visibility: 'public' })
});
```

---

## File Checklist

✅ Database Migration: `supabase/migrations/add_visibility_to_polls.sql`
✅ API Route - Visibility: `app/api/polls/[pollId]/visibility/route.ts`
✅ API Route - Create: `app/api/polls/create/route.ts`
✅ Component - Toggle: `components/pollsAll/VisibilityToggle.tsx`
✅ Component - Badge: `components/pollsAll/VisibilityBadge.tsx`
✅ Dashboard Page: `app/dashboard/poll/[pollId]/page.tsx`

---

## Next Steps

1. **Run the migration:**
   ```bash
   npx supabase migration up
   ```

2. **Test the feature:**
   - Create a new poll with visibility setting
   - Toggle visibility in Settings tab
   - Try accessing polls with different visibility levels

3. **Display visibility status:**
   - Add `<VisibilityBadge />` to poll cards in your dashboard
   - Show visibility in poll previews

4. **Update publish/visibility logic:**
   - Consider if `is_published` and `visibility` should work together
   - Current setup: Private polls are always hidden, Public polls only show when published

---

## Troubleshooting

### Poll not visible after changing visibility
- Check if `is_published = true`
- Verify visibility setting in database
- Check RLS policies are applied

### Can't update visibility
- Ensure you're the poll owner (poll.user_id = current user.id)
- Check API response for error messages
- Verify authentication token is valid

### Migration error
- Run: `npx supabase migration reset` to reset database
- Then reapply migrations

---

## Security Notes

- ✅ All visibility changes require authentication
- ✅ Only poll owners can change visibility
- ✅ RLS policies prevent unauthorized access
- ✅ Private polls are completely hidden from non-owners

---

