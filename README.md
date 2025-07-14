# Link Tracker

A modern link tracking and management platform built with React, TypeScript, and Clerk authentication. Create, track, and analyze your links with advanced features like geo-targeting, device detection, and comprehensive analytics.

## 🚀 Features

- **Link Shortening**: Create branded short links with custom domains
- **Analytics Dashboard**: Track clicks, geographic data, and device information
- **Geo-targeting**: Redirect users based on their location
- **QR Code Generation**: Create QR codes for your links
- **User Authentication**: Secure authentication with Clerk
- **Responsive Design**: Works perfectly on all devices
- **Real-time Analytics**: Live tracking and reporting

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a5602899-6ef2-432b-9f6c-72cbc60bedfa) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Routing**: React Router
- **State Management**: TanStack Query
- **Deployment**: Docker + Nginx

## 🚀 Deployment

This project is configured for deployment with **Coolify** on Hostinger VPS.

### Quick Deploy with Coolify

1. **Connect Repository**: Add this GitHub repository to your Coolify instance
2. **Set Environment Variables**:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   ```
3. **Deploy**: Coolify will automatically build and deploy using the included Dockerfile

### Manual Deployment

```bash
# Build the Docker image
docker build -t link-tracker .

# Run the container
docker run -p 3000:80 -e VITE_CLERK_PUBLISHABLE_KEY=your_key link-tracker
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
