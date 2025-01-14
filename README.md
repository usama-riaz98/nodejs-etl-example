# University Data ETL Service

## Overview

This project demonstrates an ETL (Extract, Transform, Load) process built using NestJS. The service fetches university data from the [Hipo Labs University Domains API](http://universities.hipolabs.com/search?country=United+States), processes and stores it in a MySQL database, and exposes endpoints for retrieving data and exporting it as a CSV file.

Key features include automated daily data fetching via a scheduled cron job, batch processing, duplicate prevention, and robust error handling.

---

## Features

- **Automated Data Fetching**: Scheduled daily data refresh at midnight UTC.
- **Manual Data Fetch**: Trigger data fetch on demand via an API.
- **Data Storage**: MySQL database with a well-defined schema.
- **Data Transformation**: Ensures schema conformity and removes duplicates.
- **CSV Export**: Provides an API endpoint to export university data as a CSV file.
- **Robust Error Handling**: Centralized exception management and logging.
- **Batch Processing**: Efficient data handling for large datasets.

---

## Tech Stack

- **Backend Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL with TypeORM
- **HTTP Client**: Axios
- **Scheduling**: Node.js Schedule Module
- **ETL Process**: Custom logic implemented in services

---

## Database Schema

### Universities

| Column Name   | Type         | Constraints |
| ------------- | ------------ | ----------- |
| id            | bigint       | Primary key |
| name          | varchar(150) | Unique      |
| alphaTwoCode  | varchar(2)   |             |
| country       | varchar(100) |             |
| stateProvince | varchar(100) | Nullable    |
| createdAt     | datetime     |             |
| updatedAt     | datetime     |             |

### Domains

| Column Name  | Type         | Constraints                |
| ------------ | ------------ | -------------------------- |
| id           | bigint       | Primary key                |
| domain       | varchar(255) | Unique                     |
| universityId | bigint       | Foreign key (Universities) |
| createdAt    | datetime     |                            |
| updatedAt    | datetime     |                            |

### Web Pages

| Column Name  | Type         | Constraints                |
| ------------ | ------------ | -------------------------- |
| id           | int          | Primary key                |
| url          | varchar(255) | Unique                     |
| universityId | bigint       | Foreign key (Universities) |
| createdAt    | datetime     |                            |
| updatedAt    | datetime     |                            |

---

## API Endpoints

### **Fetch University Data**

`GET /universities/fetch-data`  
Triggers the data fetch process from the Hipo Labs API. This endpoint is also triggered automatically daily at midnight UTC.

### **Export CSV**

`GET /universities/csv`  
Exports the stored university data to a downloadable CSV file.

---

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/university-data-etl-service.git
   cd university-data-etl-service

   ```

2. Install dependencies

```
npm install
```

3. Configure environment variables in .env

```
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database
PORT=3000
```

4. Run migrations

```
npm run migration:run
```

5. Start the server

```
npm run start
```

## Project Structure

```
src/
├── constants/          # Application constants
├── database/           # Database configuration and migrations
│   └── migrations/     # Generated migrations
├── enums/              # Enums for reusable constants
├── exceptions/         # Custom exception filters
├── modules/            # Feature modules
│   ├── app/            # App-level configurations
│   └── universities/   # University module
│       ├── entities/   # Database entities
│       ├── university.controller.ts
│       ├── university.service.ts
│       └── university.module.ts
├── types/              # Type definitions
└── main.ts             # Application entry point

```

## Available Scripts

- `npm run build`: Build the application
- `npm run start:dev`: Start in development mode
- `npm run start:prod`: Start in production mode
- `npm run migration:generate`: Generate new migration
- `npm run migration:run`: Run pending migrations
- `npm run migration:revert`: Revert last migration
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Data Flow

1. Scheduled cron job or manual API trigger initiates data fetch
2. Application fetches US universities from Hipo Labs API
3. Data is transformed to match database schema
4. Universities are inserted with duplicate prevention
5. Related domains and web pages are batch inserted
6. Data can be exported as CSV on demand

## Error Handling

- Global exception filter for consistent error responses
- Duplicate entry handling using unique constraints
- API error logging
- Type-safe data transformations
