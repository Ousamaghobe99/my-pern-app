# Factory Storage System - Backend API

A comprehensive PERN stack backend for managing industrial factory storage systems with advanced features including interface tracking, maintenance management, location management, and user authentication.

## 🏗️ Architecture

- **Framework**: Express.js with Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role-based access control
- **Security**: Rate limiting, input validation, CORS protection

## 📊 Features

### Core Functionality
- **User Management**: Role-based user system with permissions
- **Interface Management**: Equipment/device tracking with status management
- **Location Management**: Facility location tracking and management
- **Maintenance System**: Comprehensive maintenance ticket system
- **Usage Logging**: Equipment usage tracking and history
- **Movement Tracking**: Equipment location change history

### Security Features
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting for different endpoint types
- Input validation and sanitization
- Password hashing with bcrypt
- CORS protection

### Advanced Features
- Comprehensive API documentation
- Pagination and filtering
- Search functionality
- Statistics and analytics endpoints
- Database seeding
- Comprehensive logging
- Error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database**
   ```bash
   # Create database
   createdb factory_storage
   
   # Push schema to database
   npm run prisma:push
   
   # Seed database with initial data
   npm run prisma:seed
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/change-password` - Change password
- `POST /auth/logout` - User logout
- `GET /auth/verify` - Verify token

### User Management
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/roles` - Get all roles
- `GET /users/statistics` - Get user statistics

### Interface Management
- `GET /interfaces` - Get all interfaces (paginated, filterable)
- `GET /interfaces/:id` - Get interface by ID
- `POST /interfaces` - Create new interface
- `PUT /interfaces/:id` - Update interface
- `DELETE /interfaces/:id` - Delete interface
- `POST /interfaces/:id/move` - Move interface to different location
- `GET /interfaces/statistics` - Get interface statistics

### Location Management
- `GET /locations` - Get all locations (paginated)
- `GET /locations/:id` - Get location by ID
- `POST /locations` - Create new location
- `PUT /locations/:id` - Update location
- `DELETE /locations/:id` - Delete location
- `GET /locations/list` - Get simple locations list
- `GET /locations/statistics` - Get location statistics

### Maintenance Management
- `GET /maintenance` - Get all maintenance tickets (paginated, filterable)
- `GET /maintenance/:id` - Get maintenance ticket by ID
- `POST /maintenance` - Create new maintenance ticket
- `PUT /maintenance/:id` - Update maintenance ticket
- `DELETE /maintenance/:id` - Delete maintenance ticket
- `POST /maintenance/:id/logs` - Add log to maintenance ticket
- `GET /maintenance/statistics` - Get maintenance statistics

## 🔐 Authentication & Authorization

### User Roles
1. **Administrator** - Full system access
2. **Manager** - Management level access
3. **Technician** - Technical operations access
4. **Operator** - Basic operational access

### Permissions
- `user:read`, `user:write`, `user:delete`
- `interface:read`, `interface:write`, `interface:delete`
- `location:read`, `location:write`, `location:delete`
- `maintenance:read`, `maintenance:write`, `maintenance:delete`
- `reports:read`
- `admin:all`

### Usage
Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

### Core Models
- **User**: User accounts with role assignments
- **Role**: User roles with permission mappings
- **Permission**: System permissions
- **Interface**: Equipment/devices being tracked
- **Location**: Physical locations in the facility
- **MaintenanceTicket**: Maintenance requests and tickets
- **MaintenanceLog**: Maintenance activity logs
- **UsageLog**: Equipment usage tracking
- **InterfaceMovementLog**: Equipment movement history

## 🛠️ Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with initial data

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/factory_storage"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## 🧪 Testing

### Run Tests
```bash
# Start test server
node test-server.js

# Run API tests
node test-api.js
```

### Default Admin Account
- **Email**: admin@factory.com
- **Password**: admin123
- **Role**: Administrator

## 🚀 Deployment

### Production Checklist
- [ ] Update JWT_SECRET to a secure random string
- [ ] Set NODE_ENV to "production"
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Monitoring & Logging

The application includes comprehensive logging:
- Request/response logging
- Error logging with stack traces
- Database query logging (development)
- Authentication events
- Security events

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens have configurable expiration
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- CORS configured for specific origins
- Error messages don't expose sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the error logs
- Contact the development team

