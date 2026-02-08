# Troubleshooting Supabase Authentication 400 Error

## Understanding the Error

The error `Failed to load resource: the server responded with a status of 400` from Supabase's `/auth/v1/token?grant_type=password` endpoint indicates that the authentication request was rejected by Supabase.

## Common Causes and Solutions

### 1. **Invalid Credentials** (Most Common)
- **Cause**: The email or password is incorrect
- **Solution**: 
  - Double-check that you're using the correct email and password
  - Ensure there are no extra spaces in the email or password fields
  - Try resetting your password if you're unsure

### 2. **User Doesn't Exist**
- **Cause**: You're trying to sign in with an email that hasn't been registered
- **Solution**: 
  - Sign up first using the "Sign up" option
  - Check if the user exists in your Supabase Dashboard → Authentication → Users

### 3. **Email Not Confirmed**
- **Cause**: Supabase requires email confirmation, but the user hasn't confirmed their email
- **Solution**: 
  - Check your email inbox (and spam folder) for the confirmation email
  - Click the confirmation link in the email
  - **OR** disable email confirmation in Supabase Dashboard:
    1. Go to Authentication → Settings
    2. Under "Email Auth", disable "Enable email confirmations"
    3. Save changes

### 4. **Incorrect Supabase Configuration**
- **Cause**: Missing or incorrect environment variables
- **Solution**: 
  - Check your `.env.local` file has:
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```
  - Verify these values match your Supabase project settings
  - Restart your development server after changing environment variables

### 5. **Account Disabled**
- **Cause**: The user account has been disabled in Supabase
- **Solution**: 
  - Check Supabase Dashboard → Authentication → Users
  - Look for the user and ensure they're not disabled
  - Re-enable the account if needed

### 6. **Password Requirements Not Met**
- **Cause**: The password doesn't meet Supabase's minimum requirements
- **Solution**: 
  - Ensure password is at least 6 characters (Supabase default)
  - Check Supabase Dashboard → Authentication → Settings for password requirements

## Debugging Steps

1. **Check Browser Console**: 
   - Open Developer Tools (F12)
   - Look at the Console tab for detailed error messages
   - The improved error handling will now show more specific error messages

2. **Check Network Tab**:
   - Open Developer Tools → Network tab
   - Try signing in again
   - Click on the failed request to `/auth/v1/token`
   - Check the "Response" tab for the exact error message from Supabase

3. **Verify Supabase Configuration**:
   - Check that your `.env.local` file exists and has correct values
   - Verify the Supabase URL format: `https://xxxxx.supabase.co`
   - Ensure the anon key is correct (starts with `eyJ...`)

4. **Test in Supabase Dashboard**:
   - Go to Supabase Dashboard → Authentication → Users
   - Try creating a test user manually
   - Verify the user exists and is confirmed

## Quick Fixes

### Disable Email Confirmation (Development Only)
1. Go to Supabase Dashboard
2. Navigate to Authentication → Settings
3. Under "Email Auth", toggle off "Enable email confirmations"
4. Save changes

### Create Test User via Supabase Dashboard
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" or "Create User"
3. Enter email and password
4. **Important**: Uncheck "Auto Confirm User" if you want to test email confirmation, or leave it checked to skip confirmation
5. Click "Create User"

### Reset Password
If you've forgotten your password:
1. Use the "Forgot Password" feature (if implemented)
2. OR reset via Supabase Dashboard → Authentication → Users → Select User → Reset Password

## Error Message Reference

The improved error handling will now show specific messages:
- **"Invalid email or password"**: Wrong credentials or user doesn't exist
- **"Please check your email and confirm your account"**: Email confirmation required
- **"No account found with this email"**: User doesn't exist, need to sign up first

## Still Having Issues?

1. Check the browser console for the full error details
2. Verify your Supabase project is active and not paused
3. Check Supabase status page for any service outages
4. Review Supabase logs in Dashboard → Logs → Auth Logs
