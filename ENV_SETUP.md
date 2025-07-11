# Environment Setup Guide for ATS Website

## 🔧 Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Database Configuration for ATS Website (forms, chat storage)
DB_ATS_HOST=172.16.12.83
DB_ATS_PORT=3306
DB_ATS_USER=appuser
DB_ATS_PASSWORD=App#uSer#2024
DB_ATS_DATABASE=ats_website

# Database Configuration for School Admin Login (legacy system)
DB_SCHOOL_HOST=10.0.6.122
DB_SCHOOL_PORT=3306
DB_SCHOOL_USER=bindu.pillai1
DB_SCHOOL_PASSWORD=your_school_password_here
DB_SCHOOL_DATABASE=educatio_educat

# Authentication & Security
JWT_SECRET=your_strong_jwt_secret_minimum_32_characters_long
SCHOOL_AUTH_PASSWORD=your_secure_school_password_here

# OpenAI API Configuration (Optional - for AI chatbot)
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Environment
NODE_ENV=development
```

## 🚨 **IMPORTANT NOTES**

### **Database Password**
- The `DB_ATS_PASSWORD=App#uSer#2024` is the correct password for the ATS website database
- This must be set exactly as shown for the chat storage to work

### **JWT Secret**
- Generate a strong JWT secret (minimum 32 characters)
- You can use: `openssl rand -base64 32` or any password generator
- Example: `JWT_SECRET=abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx`

### **School Authentication Password**
- Replace `your_secure_school_password_here` with your actual school authentication password
- This replaces the old hardcoded 'ats2025' password

### **OpenAI API Key (Optional)**
- The chatbot will work without OpenAI API key using intelligent fallback responses
- If you want AI-powered responses, get an API key from https://platform.openai.com/
- If not provided, the system will use pre-programmed responses

## 🔍 **Troubleshooting Common Issues**

### **Database Connection Errors**
```
Error: Access denied for user 'appuser'@'...' (using password: YES)
```
**Solution:** Ensure `DB_ATS_PASSWORD=App#uSer#2024` is set correctly in `.env.local`

### **Chat Health Check Failing**
```
GET /api/chat/health 503 (Service Unavailable)
```
**Solution:** 
1. Check database credentials in `.env.local`
2. Ensure database server is accessible
3. Chat will fallback to localStorage if database is unavailable

### **OpenAI API Errors**
```
OpenAI API error: 401 Unauthorized
```
**Solution:** 
1. Add `OPENAI_API_KEY` to `.env.local` OR
2. Leave it unset - the system will use intelligent fallback responses

### **JWT Token Errors**
```
JWT_SECRET environment variable is required
```
**Solution:** Add a strong JWT secret to `.env.local`

## 📋 **Setup Checklist**

- [ ] Create `.env.local` file in project root
- [ ] Add all required database credentials
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Set SCHOOL_AUTH_PASSWORD
- [ ] Optionally add OPENAI_API_KEY for AI responses
- [ ] Restart development server (`npm run dev`)
- [ ] Test chat functionality
- [ ] Verify database connection in chat storage

## 🚀 **After Setup**

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test the chat functionality:**
   - Open the website
   - Click on the chat icon
   - Send a test message
   - Check if database storage is working (green checkmark in chat)

3. **Verify school login:**
   - Go to `/for-schools/login`
   - Try logging in with school credentials

## 🔐 **Security Notes**

- ✅ All sensitive credentials are now in environment variables
- ✅ No hardcoded passwords in the codebase
- ✅ Chat export functionality disabled for security
- ✅ Error logs sanitized to prevent credential exposure
- ✅ JWT secrets required for all authentication

## 📞 **Support**

If you continue to experience issues after following this setup:

1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Ensure the database server is accessible
4. Contact the development team with specific error details

---

**Remember:** The `.env.local` file should never be committed to version control. It's already included in `.gitignore`. 