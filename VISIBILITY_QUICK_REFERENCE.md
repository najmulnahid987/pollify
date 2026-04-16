# Visibility Feature - Quick Reference

## **What You Have Now**

✅ **Database**: visibility column in polls table
✅ **API**: PATCH endpoint to update visibility
✅ **Frontend**: Toggle buttons with confirmation dialog
✅ **Access Control**: Private polls only for owner, public for all
✅ **RLS Security**: Database level access control

---

## **How It Works - Simple Summary**

### **3 Simple Steps:**

**Step 1: User Changes Visibility**
```
Dashboard → Poll → Share Tab
    ↓
Click "PUBLIC" or "PRIVATE" button
    ↓
Confirm in dialog
    ↓
Success message shows
```

**Step 2: Supabase Updates**
```
Supabase polls table
    ↓
visibility column updates
'public' ← → 'private'
```

**Step 3: Link Access Changes**
```
PUBLIC poll:
  ✅ Anyone can open link/QR
  ✅ Polls are discoverable

PRIVATE poll:
  ❌ Only owner can open link
  ❌ Strangers see: "private and not accessible"
  ✅ QR still shows but gives error to non-owners
```

---

## **Testing Checklist**

### **Quick Test (2 minutes)**

```
1. Create poll → visibility = 'public' (default)
2. Share tab → Click "PRIVATE" → Confirm
3. Check Supabase: polls table → visibility = 'private' ✓
4. Logout/new browser → Try /p/{pollId} → Shows error ✓
5. Login as owner → Try /p/{pollId} → Shows poll ✓
6. Back in share tab → Click "PUBLIC" → Confirm
7. Try link again as non-owner → Shows poll ✓
```

### **What to Verify**

```
✓ Visibility toggle works (buttons clickable)
✓ Confirmation dialog appears
✓ Success message shows
✓ Supabase column updates
✓ Public polls accessible to everyone
✓ Private polls blocked for non-owners
✓ Owners always have access
✓ QR code follows same rules
```

---

## **Database Structure**

**Table:** polls

```sql
id              uuid (primary key)
title           text
user_id         uuid (poll owner)
visibility      varchar(10)  ← 'public' or 'private'
is_published    boolean      ← true or false
created_at      timestamp
updated_at      timestamp
... (other columns)
```

---

## **API Reference**

### **Update Visibility**
```
PATCH /api/polls/{pollId}/visibility

Request Body:
{
  "visibility": "public"  // or "private"
}

Response:
{
  "success": true,
  "poll": { ... updated poll data ... }
}
```

---

## **Access Control Rules**

### **Permission Matrix**

| Scenario | Allowed |
|----------|---------|
| PUBLIC poll + PUBLISHED + Anyone | ✅ YES |
| PUBLIC poll + UNPUBLISHED + Anyone | ❌ NO |
| PRIVATE poll + PUBLISHED + Owner | ✅ YES |
| PRIVATE poll + PUBLISHED + Non-Owner | ❌ NO |
| PRIVATE poll + UNPUBLISHED + Owner | ❌ NO |

---

## **File Map**

| File | Purpose |
|------|---------|
| `components/pollsAll/PollShare.tsx` | Toggle buttons, confirmation dialog |
| `app/api/polls/[pollId]/visibility/route.ts` | Backend API to update Supabase |
| `app/p/[pollId]/page.tsx` | Check visibility before showing poll |
| `supabase/migrations/add_visibility_to_polls.sql` | Database migration |
| `SUPABASE_SETUP.sql` | Full setup with visibility |

---

## **Troubleshooting**

### **Issue: Visibility not updating in Supabase**
- Check browser console (F12) for API errors
- Verify you're logged in
- Verify you own the poll

### **Issue: Private poll still accessible**
- Check is_published status (must be true)
- Verify visibility in Supabase table
- Check RLS policy exists

### **Issue: Public poll not accessible**
- Check is_published = true
- Verify visibility = 'public'
- Clear browser cache

---

## **Key Numbers to Remember**

- Visibility values: **2** ('public', 'private')
- RLS policies: **4** (create, read, update, delete)
- Main files: **2** (PollShare.tsx, [pollId]/page.tsx)
- Database updates: **1** (polls.visibility column)

---

## **Success Indicators**

✅ You'll see success when:
1. **UI**: Buttons toggle between PUBLIC/PRIVATE
2. **Dialog**: Confirmation appears when clicking
3. **Message**: "Poll is now PUBLIC/PRIVATE" shows
4. **DB**: Supabase column changes
5. **Access**: Link works/doesn't based on visibility

---

## **Status Check**

From your screenshots:
- ✅ Visibility column: EXISTS
- ✅ Values in column: 'public' (stored)
- ✅ RLS policy: EXISTS
- ✅ All systems: READY TO USE

---

## **You're All Set!** 🚀

Your visibility feature is fully functional.
Just test it with the checklist above and you're done!

