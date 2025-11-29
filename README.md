# Campus Lost-and-Found System

A full-stack web application that helps students report and find lost or found items on campus. The system features automatic matching between lost and found items using keyword similarity algorithms.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Report Items**: Students can report lost or found items with image uploads
- **Smart Matching**: Automatic suggestions of potential matches using Jaccard similarity
- **Search & Filter**: Filter items by category, location, and keywords
- **Admin Dashboard**: Verify or remove reported items
- **Image Upload**: Cloudinary integration for secure image storage
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend

- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image uploads
- Multer for file handling

### Frontend

- React.js with Hooks
- React Router for navigation
- Axios for API requests
- CSS for styling

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd campus-lost-and-found
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Set up Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/campus-lost-and-found
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

**To get Cloudinary credentials:**

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret

## Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:9001`

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Option 2: Run Both Concurrently (if you set up concurrently)

From the root directory:

```bash
npm run dev
```

## Default Admin Account

To create an admin account, you'll need to manually update a user's role in MongoDB:

1. Register a new user through the application
2. Open MongoDB (compass or shell)
3. Find the user in the `users` collection
4. Change the `role` field from `"student"` to `"admin"`

Alternatively, you can create a seed script to automatically create an admin account.

## Project Structure

```
campus-lost-and-found/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── items.js
│   │   ├── admin.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── matchItems.js
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ItemCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── LostItems.jsx
│   │   │   ├── FoundItems.jsx
│   │   │   ├── ReportItem.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   └── Admin.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Items

- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (auth required)
- `PUT /api/items/:id` - Update item (auth required)
- `PATCH /api/items/:id/status` - Update item status (auth required)

### Upload

- `POST /api/upload` - Upload image (auth required)

### Admin

- `GET /api/admin/items/pending` - Get unverified items (admin only)
- `PATCH /api/admin/items/:id/verify` - Verify item (admin only)
- `DELETE /api/admin/items/:id` - Delete item (admin only)

## How It Works

### Auto-Matching Algorithm

When a user reports a lost or found item, the system:

1. Finds opposite type items (lost vs found) in the same category
2. Filters by similar location
3. Calculates Jaccard similarity between item descriptions
4. Returns matches with similarity score ≥ 30%
5. Displays potential matches to the user

The Jaccard similarity compares word sets:

```
similarity = (common words) / (total unique words)
```

## Features in Detail

### For Students

- Report lost or found items with photos
- View potential matches automatically
- Search and filter all items
- Update item status (open/matched/closed)

### For Admins

- View all unverified items
- Approve legitimate posts
- Delete suspicious or inappropriate content
- All student features included

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or production.

## Support

For issues or questions, please open an issue on the GitHub repository.

Developed by:

NITHIN KATARIYA V

Student Developer

🔗 GitHub: https://github.com/Nithin-jain22
🔗 LinkedIn: https://www.linkedin.com/in/nithin-katariya-v/
