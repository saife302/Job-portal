# HireHub - Full Stack MERN Job Portal

HireHub is a full stack job portal application that connects job seekers with recruiters. Users can explore jobs and apply, while recruiters can post jobs, manage applicants, and schedule interviews.

This project was built to simulate a real-world system with both user and recruiter workflows, along with features like resume uploads, email notifications, and video interviews.

## Live Demo

Frontend: https://job-portal-nine-azure.vercel.app  
Backend: https://job-portal-sj36.onrender.com  

## Tech Stack

Frontend: React (Vite), Tailwind CSS, Axios  
Backend: Node.js, Express.js, MongoDB, JWT Authentication  
Other tools: Cloudinary, Multer, Nodemailer, Jitsi Meet  

## Features

User side  
Users can register and log in securely  
Browse and search job listings  
Apply for jobs  
Upload resumes  
Track their applications  

Recruiter side  
Recruiters can log in and manage job postings  
Create job listings  
View applicants  
Manage jobs
Schedule interviews  
Send interview emails  

Interview system  
Interviews can be scheduled from the dashboard  
Candidates receive email notifications  
Video interviews are handled using Jitsi Meet  

## Deployment

The frontend is deployed on Vercel and the backend is deployed on Render.

Since the backend is running on a free tier, some actions like sending emails may take a few seconds due to server cold starts.

## Local Setup

Clone the repository:

git clone <your-repo-link>

Frontend:

cd client  
npm install  
npm run dev  

Backend:

cd server  
npm install  
npm start  

## About

This project helped me understand how to build and deploy a complete full stack application, including authentication, API integration, file handling, and third-party services.

## Author

Saif Ahmad
