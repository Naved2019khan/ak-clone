# Vacation CRM Backend

Node.js + Express + MongoDB backend for managing travel packages, countries, locations, and travel types.

## Setup

1. Make sure MongoDB is running locally (or update `.env` with your connection string)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## API Endpoints

### Travel Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/travel-types` | Get all travel types |
| GET | `/api/travel-types/:id` | Get single travel type |
| POST | `/api/travel-types` | Create travel type (form-data: name, description, image) |
| PUT | `/api/travel-types/:id` | Update travel type |
| DELETE | `/api/travel-types/:id` | Delete travel type |

### Countries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/countries` | Get all countries |
| GET | `/api/countries/:id` | Get single country |
| POST | `/api/countries` | Create country (form-data: name, code, description, image) |
| PUT | `/api/countries/:id` | Update country |
| DELETE | `/api/countries/:id` | Delete country |

### Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Get all locations (filter: ?country=ID) |
| GET | `/api/locations/:id` | Get single location |
| POST | `/api/locations` | Create location (form-data: name, country, description, image) |
| PUT | `/api/locations/:id` | Update location |
| DELETE | `/api/locations/:id` | Delete location |

### Packages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/packages` | Get all packages (filters: ?country=ID&location=ID&travelType=ID&featured=true) |
| GET | `/api/packages/:id` | Get single package |
| POST | `/api/packages` | Create package (form-data with multiple images) |
| PUT | `/api/packages/:id` | Update package |
| DELETE | `/api/packages/:id` | Delete package |

## Data Model

```
TravelType (Adventure, Honeymoon, Family, etc.)
Country → has many Locations
Location → belongs to Country
Package → belongs to Country, Location, and TravelType
```

PORT=5000
MONGODB_URI=/vacation-crm
NODE_ENV=development
JWT_SECRET=vacation-crm-secret-key-2024

