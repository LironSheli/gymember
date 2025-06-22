# Gymember - Workout Tracking App

A modern workout tracking application built with Next.js, featuring real authentication, email notifications, and comprehensive training management.

## Features

- 🔐 **Real Authentication** - JWT-based login/register with password reset
- 📧 **Email Notifications** - Password reset and account verification
- 💪 **Workout Tracking** - Complete exercise and set management
- 📊 **Workout History** - Track your progress over time
- 🌐 **Multi-language** - Hebrew and English support with RTL
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Beautiful, intuitive interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Authentication**: JWT
- **Email**: Nodemailer
- **Icons**: Lucide React

## Local Development

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd gymember
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   JWT_SECRET=your_jwt_secret_here
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   EMAIL_HOST=your_email_host
   EMAIL_PORT=587
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Step 1: Prepare Your Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Ensure your repository is public or you have a paid Vercel plan

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**
5. **Configure project settings**:
   - Framework Preset: Next.js
   - Root Directory: `./` (or your project root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Set Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add each variable from your `.env.local`:
   ```
   JWT_SECRET=your_jwt_secret_here
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   EMAIL_HOST=your_email_host
   EMAIL_PORT=587
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   ```

### Step 4: Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Connecting Custom Domain

### Step 1: Add Domain in Vercel

1. Go to your project dashboard
2. Click **Settings** → **Domains**
3. Add your domain (e.g., `app.yourdomain.com`)
4. Vercel will provide DNS records to configure

### Step 2: Configure DNS

In your domain provider's DNS settings, add these records:

**For root domain (yourdomain.com):**

```
Type: A
Name: @
Value: 76.76.19.19
```

**For subdomain (app.yourdomain.com):**

```
Type: CNAME
Name: app
Value: your-project-name.vercel.app
```

### Step 3: Verify Domain

1. Wait for DNS propagation (can take up to 48 hours)
2. Vercel will automatically verify your domain
3. Your app will be accessible at your custom domain

## Database Setup

### Option 1: Local MySQL

1. Install MySQL locally
2. Create a database
3. Run the setup script from `database-setup.sql`

### Option 2: Cloud Database (Recommended for Production)

- **PlanetScale** (Free tier available)
- **Railway** (Free tier available)
- **Supabase** (Free tier available)
- **AWS RDS** (Paid)

## Email Configuration

### Hostinger SMTP (Current Setup)

```
Host: smtp.hostinger.com
Port: 587
Security: STARTTLS
```

### Alternative Providers

- **Gmail SMTP**
- **SendGrid**
- **Mailgun**
- **AWS SES**

## Free Tier Limitations

### Vercel Free Tier

- ✅ **Unlimited deployments**
- ✅ **Custom domains**
- ✅ **SSL certificates**
- ⚠️ **100GB bandwidth/month**
- ⚠️ **100GB storage**
- ⚠️ **Serverless function timeout: 10s**

### Database Free Tiers

- **PlanetScale**: 1 database, 1 billion reads/month
- **Railway**: $5 credit/month
- **Supabase**: 500MB database, 50MB file storage

## Troubleshooting

### Common Issues

1. **Build Fails**

   - Check environment variables are set
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**

   - Verify database credentials
   - Check if database is accessible from Vercel
   - Ensure database allows external connections

3. **Email Not Working**
   - Verify SMTP credentials
   - Check email provider settings
   - Test with a simple email first

### Support

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Create an issue in this repository

## License

MIT License - feel free to use this project for personal or commercial purposes.
