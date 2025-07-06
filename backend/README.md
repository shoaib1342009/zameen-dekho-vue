# Zameen Dekho Backend API

A fast, secure, and reliable Node.js backend for the Zameen Dekho real estate platform.

## Features

- 🚀 **Lightning Fast**: Node.js with TypeScript for optimal performance
- 🔒 **Secure**: JWT authentication, rate limiting, helmet security
- 📊 **SQLite Database**: Zero-configuration database that's perfect for hosting
- 🎯 **Type Safe**: Full TypeScript implementation with validation
- 🛡️ **Error Handling**: Comprehensive error handling and validation
- 📱 **Mobile Ready**: CORS enabled for cross-platform support

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **API will be available at**: `http://localhost:3001`

### Production Deployment (Hostinger)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload files to your hosting**:
   - Upload the entire `backend` folder to your hosting
   - Make sure Node.js is enabled on your hosting plan

3. **Start the server**:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://yourdomain.com
UPLOAD_MAX_SIZE=10485760
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property (auth required)
- `PUT /api/properties/:id` - Update property (auth required)
- `DELETE /api/properties/:id` - Delete property (auth required)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (auth required)
- `PUT /api/auth/profile` - Update profile (auth required)
- `GET /api/auth/my-properties` - Get user's properties (auth required)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (auth required)
- `POST /api/wishlist/toggle/:propertyId` - Toggle wishlist (auth required)
- `GET /api/wishlist/count` - Get wishlist count (auth required)

## Database

The API uses SQLite database which is:
- ✅ Zero configuration required
- ✅ Perfect for hosting providers
- ✅ Fast and reliable
- ✅ Automatic initialization with sample data

Database file is created automatically at `backend/data/zameen_dekho.db`

## Features

### Property Management
- Full CRUD operations for properties
- Advanced filtering (location, price, type, beds, etc.)
- Image galleries and amenities
- Geolocation support
- User-specific properties

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- User profile management
- Email verification support

### Wishlist System
- Add/remove properties from wishlist
- Toggle wishlist status
- Wishlist count and management

### Security Features
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS protection
- Input validation with Zod
- SQL injection protection

### Performance Features
- Compression middleware
- Optimized database queries
- Efficient pagination
- Memory-safe file uploads

## Deployment Notes

### For Hostinger:
1. Ensure Node.js is enabled in your hosting control panel
2. Upload all files to your domain's public_html or subdirectory
3. Install dependencies: `npm install --production`
4. Set environment variables in your hosting panel
5. Start with: `npm start`

### Environment Setup:
- Make sure to change `JWT_SECRET` in production
- Set `CORS_ORIGIN` to your frontend domain
- Set `NODE_ENV=production` for production deployment

## Health Check

The API includes a health check endpoint:
- `GET /health` - Returns server status and version

## API Documentation

Visit `GET /api` for interactive API documentation with all available endpoints.

## Support

For issues or questions, the API includes comprehensive error messages and logging.

---

Built with ❤️ for fast, reliable real estate management.