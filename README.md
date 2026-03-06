# Task Manager - Full Stack Project

A complete full-stack web application for task management with authentication, role-based access control, and a responsive React frontend.

## 🎯 Overview

This project is built as a **Backend Developer internship assignment** demonstrating:
- RESTful API design and best practices
- User authentication with JWT
- Role-based access control (RBAC)
- MongoDB database operations
- React frontend with Axios integration
- API documentation with Swagger
- Scalable project architecture

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **API Documentation**: Swagger/OpenAPI
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## 📁 Project Structure

```
project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── taskController.js     # Task CRUD logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Role-based access
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── taskRoutes.js         # Task endpoints
│   ├── utils/
│   │   └── errorHandler.js       # Error handling
│   ├── server.js                 # Express app
│   ├── swagger.json              # API documentation
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   ├── Alert.jsx         # Alert component
│   │   │   └── TaskCard.jsx      # Task display component
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Login page
│   │   │   ├── RegisterPage.jsx  # Register page
│   │   │   └── DashboardPage.jsx # Main dashboard
│   │   ├── services/
│   │   │   └── api.js            # Axios API client
│   │   ├── App.jsx               # Main component
│   │   ├── App.css
│   │   ├── index.css             # Tailwind imports
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your configuration**
   ```env
   MONGODB_URI=mongodb://localhost:27017/task_manager
   PORT=5000
   JWT_SECRET=your_super_secret_key_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run backend server**
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:5000`
   - API Docs available at `http://localhost:5000/api/docs`

### Frontend Setup

1. **Navigate to frontend directory** (in another terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env`** (if needed)
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

5. **Run frontend development server**
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)
- `PUT /api/v1/auth/profile` - Update profile (protected)
- `PUT /api/v1/auth/change-password` - Change password (protected)

### Tasks
- `POST /api/v1/tasks` - Create task (protected)
- `GET /api/v1/tasks` - Get all tasks (protected)
- `GET /api/v1/tasks/:id` - Get single task (protected)
- `PUT /api/v1/tasks/:id` - Update task (protected)
- `DELETE /api/v1/tasks/:id` - Delete task (protected)
- `GET /api/v1/tasks/stats/overview` - Get stats (admin only)

## 🔐 Authentication & Security

### Password Hashing
- Passwords are hashed using bcryptjs with 10 salt rounds
- Raw passwords are never stored in the database

### JWT Tokens
- Tokens are signed with a secret key
- Default expiration: 7 days
- Sent as `Bearer {token}` in Authorization header

### Role-Based Access Control
Two roles are supported:
- **user**: Can create/view/edit/delete their own tasks
- **admin**: Can view all tasks and access statistics

### Input Validation
- Email format validation
- Password minimum length (6 characters)
- Title and description length limits
- Enum validation for status and priority

## 📊 Demo Credentials

Test the application with these credentials:

**Regular User**
- Email: `user@example.com`
- Password: `password123`

**Admin User**
- Email: `admin@example.com`
- Password: `password123`

## 🎨 Features

### Frontend Features
- ✅ User registration and login
- ✅ Protected dashboard (requires authentication)
- ✅ Create, read, update, delete tasks
- ✅ Filter tasks by status and priority
- ✅ Task statistics (admin only)
- ✅ Responsive design
- ✅ Real-time error handling
- ✅ Success/error notifications

### Backend Features
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Mongoose ODM for MongoDB
- ✅ Comprehensive error handling
- ✅ Request validation
- ✅ Pagination support
- ✅ Swagger documentation
- ✅ Centralized error middleware

## 🔧 Build & Deployment

### Build Frontend
```bash
cd frontend
npm run build
```
Output: `frontend/dist/`

### Build Backend
Backend doesn't need compilation but ensure all dependencies are installed:
```bash
cd backend
npm install --production
```

### Environment Variables for Production
Update `.env` files with production values:
- Strong JWT_SECRET
- Production MongoDB URI
- NODE_ENV=production
- Correct FRONTEND_URL

## 📈 Scalability Notes

### Current Architecture
The current implementation is suitable for:
- Small to medium-sized applications
- Development and testing environments
- Single server deployments

### Scaling Strategies

#### 1. **Microservices Architecture**
```
- Split into: Auth Service, Task Service, User Service
- Benefits: Independent scaling, easier maintenance
- Tools: Docker, Kubernetes, API Gateway
```

#### 2. **Caching Layer**
```
- Add Redis for:
  - Session caching
  - Task list caching
  - Rate limiting
- Benefits: Reduced database queries, faster response times
```

#### 3. **Database Optimization**
```
- Add indexes on frequently queried fields
- Implement database replication
- Use read replicas for scaling reads
- Consider sharding for very large datasets
```

#### 4. **Load Balancing**
```
- Deploy multiple backend instances
- Use Nginx/HAProxy for load distribution
- Benefits: High availability, fault tolerance
```

#### 5. **CDN & Static Assets**
```
- Host frontend on CDN (CloudFlare, AWS CloudFront)
- Serve static assets from edge locations
- Benefits: Faster content delivery globally
```

#### 6. **Containerization**
```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### 7. **API Rate Limiting**
```javascript
// Add rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

#### 8. **Monitoring & Logging**
```
- Implement centralized logging (ELK Stack, Splunk)
- Monitor application metrics (New Relic, DataDog)
- Set up alerts for errors and performance issues
```

### Production Deployment Checklist
- [ ] Use HTTPS/TLS
- [ ] Enable CORS properly (specific origins)
- [ ] Use environment variables for secrets
- [ ] Implement request logging
- [ ] Set up error tracking (Sentry)
- [ ] Use database transactions for critical operations
- [ ] Implement backup strategy
- [ ] Set up monitoring and alerts
- [ ] Enable rate limiting
- [ ] Use health check endpoints

## 📖 API Documentation

Full API documentation is available at:
- Local: `http://localhost:5000/api/docs`
- Interactive Swagger UI for testing endpoints

## 🧪 Testing

### Manual Testing
Use Postman, Thunder Client, or the Swagger UI to test endpoints.

### Example Test Flow
1. Register a new user → Get JWT token
2. Create a task using token
3. Update the task
4. View all tasks
5. Delete the task
6. Logout

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify MongoDB is accessible (firewall, credentials)

### CORS Error
- Check FRONTEND_URL in backend .env
- Verify VITE_API_URL in frontend .env
- Ensure backend CORS middleware is configured

### JWT Token Invalid
- Clear localStorage in browser
- Re-login to get new token
- Check JWT_SECRET is consistent

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Code Standards

### Naming Conventions
- Variables: camelCase (`userName`, `taskId`)
- Functions: camelCase (`getUserById`, `createTask`)
- Classes: PascalCase (`User`, `Task`)
- Constants: UPPER_SNAKE_CASE (`DB_HOST`, `MAX_RETRIES`)

### File Structure
- One model/controller per file
- Descriptive file names
- Organized folder structure

### Comments
- JSDoc comments for functions
- Inline comments for complex logic
- Remove commented code before commit

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Created as a Backend Developer Internship Assignment

## 🙋 Support & Questions

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `/api/docs`
3. Check console for error messages
4. Verify environment configuration

---

**Happy coding! 🚀**
# CRUD_Assignment
