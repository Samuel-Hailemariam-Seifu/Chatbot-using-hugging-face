# Troubleshooting Guide

## 🔧 Common Issues and Solutions

### **Environment Variables Not Loading**

#### **Issue**: `supabaseKey is required` or similar errors

#### **Solution**:

1. **Check `.env.local` exists** in project root
2. **Restart development server**: `npm run dev`
3. **Verify variable names** match exactly:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
   GROQ_API_KEY=your_groq_key_here
   ```
4. **Test environment**: Visit `http://localhost:3000/api/env-check`

### **Supabase Connection Issues**

#### **Issue**: Database connection fails

#### **Solution**:

1. **Check Supabase project** is running
2. **Verify URL format**: `https://your-project-id.supabase.co`
3. **Check API keys** in Supabase dashboard
4. **Run database schema**: Execute `supabase-schema.sql`

### **Groq API Issues**

#### **Issue**: "Invalid API key" or rate limits

#### **Solution**:

1. **Get new API key**: [console.groq.com/keys](https://console.groq.com/keys)
2. **Check rate limits**: 14,400 requests/day free
3. **Test API**: Visit `http://localhost:3000/api/test-groq`
4. **Verify key format**: Should start with `gsk_`

### **Authentication Issues**

#### **Issue**: Users can't sign up/sign in

#### **Solution**:

1. **Check Supabase Auth** is enabled
2. **Verify RLS policies** are set up
3. **Check email confirmation** settings
4. **Test with simple email/password**

### **Database Schema Issues**

#### **Issue**: Tables not found or permission errors

#### **Solution**:

1. **Run schema**: Copy `supabase-schema.sql` to Supabase SQL Editor
2. **Check RLS policies** are enabled
3. **Verify user permissions**
4. **Check table names** match exactly

## 🧪 Testing Endpoints

### **Environment Check**

```
GET /api/env-check
```

Returns status of all environment variables.

### **Groq API Test**

```
GET /api/test-groq
```

Tests Groq API connection and returns sample response.

### **Database Test**

```
GET /api/conversations?userId=test
```

Tests database connection (requires valid user).

## 🔍 Debug Steps

### **1. Check Environment Variables**

```bash
# Check if .env.local exists
ls -la .env.local

# Check content (don't share publicly!)
cat .env.local
```

### **2. Test API Endpoints**

```bash
# Test environment
curl http://localhost:3000/api/env-check

# Test Groq
curl http://localhost:3000/api/test-groq
```

### **3. Check Browser Console**

- Open browser dev tools
- Look for error messages
- Check network requests
- Verify API responses

### **4. Check Server Logs**

- Look at terminal output
- Check for error messages
- Verify database connections

## 🚨 Emergency Fallbacks

### **If Supabase Fails**

The app will work in demo mode without database features.

### **If Groq Fails**

The app will provide fallback responses instead of AI.

### **If Everything Fails**

Use the demo version at `/demo` which requires no external services.

## 📞 Getting Help

### **Check These First**:

1. ✅ Environment variables are set
2. ✅ Supabase project is running
3. ✅ Groq API key is valid
4. ✅ Database schema is applied
5. ✅ Development server is running

### **Common Solutions**:

- **Restart server**: `npm run dev`
- **Clear browser cache**: Hard refresh
- **Check API limits**: Both Supabase and Groq
- **Verify credentials**: All API keys are correct

### **Still Having Issues?**

1. Check the browser console for specific errors
2. Verify all environment variables are set correctly
3. Test each API endpoint individually
4. Check Supabase and Groq dashboards for usage/errors

## ✅ Success Indicators

When everything is working, you should see:

- ✅ Environment check: All variables loaded
- ✅ Groq test: API responds successfully
- ✅ User can sign up/sign in
- ✅ Chat messages are saved to database
- ✅ AI responses are fast and relevant

**Your chatbot is ready to use!** 🚀
