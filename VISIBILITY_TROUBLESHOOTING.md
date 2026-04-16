# Visibility Feature - Troubleshooting Guide

## Issue: "Poll not found" Error

### Common Causes & Solutions

---

## **1. Check if Visibility Column Exists**

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Check polls table structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'polls' AND table_schema = 'public'
ORDER BY ordinal_position;
```

**Expected Result:**
- Should see `visibility` column with type `character varying`
- Default value should be `'public'`

---

## **2. Check RLS Policies**

```sql
-- Check current policies on polls table
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'polls';
```

**Expected Result:**
- Should see `"Users can read polls by visibility"` policy

---

## **3. Check Existing Polls Data**

```sql
-- View all polls and their visibility
SELECT id, title, user_id, is_published, visibility, created_at
FROM polls
ORDER BY created_at DESC
LIMIT 10;
```

**What to Look For:**
- ✅ If `visibility` is NULL → Update to default 'public'
- ✅ If `visibility` has values → Good!
- ❌ If `visibility` column missing → Run the migration again

---

## **4. Fix NULL Visibility Values**

If visibility column exists but has NULL values:

```sql
-- Update all NULL visibility values to 'public'
UPDATE polls
SET visibility = 'public'
WHERE visibility IS NULL;

-- Verify the update
SELECT COUNT(*), visibility FROM polls GROUP BY visibility;
```

---

## **5. Test Poll Access**

### Test 1: Create a NEW poll
1. Go to create poll page
2. Set visibility to "Public" 
3. Complete poll creation
4. Verify in Supabase:
   ```sql
   SELECT id, title, visibility, is_published FROM polls ORDER BY created_at DESC LIMIT 1;
   ```
   - Should see your new poll with `visibility = 'public'`

### Test 2: Access Public Poll
```
Browser: http://localhost:3000/p/{pollId}
Expected: Poll loads successfully
```

### Test 3: Change to Private
1. Go to Dashboard → Poll → Share
2. Click "Private" button
3. Confirm change
4. Verify in Supabase:
   ```sql
   SELECT id, visibility FROM polls WHERE id = '{pollId}';
   ```
   - Should show `visibility = 'private'`

---

## **6. Reset Visibility for All Existing Polls**

If you want all existing polls to be public:

```sql
UPDATE polls
SET visibility = 'public'
WHERE visibility IS NULL OR visibility = '';
```

---

## **7. Check Browser Console & Network Tab**

1. Open **Developer Tools** (F12)
2. Go to **Console** tab
3. Go to **Network** tab
4. Try accessing a poll
5. Look for:
   - ❌ Failed API calls
   - ❌ 403 Forbidden errors
   - ❌ Database query errors

---

## **8. Verify API Response**

In Network tab, click the `/api/polls/[pollId]` request and check:
- Response should include `visibility` field
- Status should be 200 (success)

---

## **9. Quick Fix Checklist**

- [ ] Run the migration: `supabase migrations up`
- [ ] Check visibility column exists in Supabase
- [ ] Update NULL visibility values to 'public'
- [ ] Create a NEW poll (should auto-save visibility)
- [ ] Access it via `/p/{pollId}` link
- [ ] Toggle visibility in Share tab

---

## **Still Getting Error?**

Run these commands in Supabase SQL Editor:

```sql
-- 1. Check table structure
\d polls

-- 2. Check policies
SELECT policyname FROM pg_policies WHERE tablename = 'polls';

-- 3. Check sample polls
SELECT id, title, visibility, is_published, user_id FROM polls LIMIT 5;

-- 4. Check for errors in RLS
SELECT * FROM polls WHERE id = '{your-poll-id}';
```

Copy the output and share it for further debugging.

---
