# Generic DataGrid 

A full-stack web application featuring a generic DataGrid component built with React and MUI X Data Grid for frontend, Express.js for backend and MySQL database. It showcases the implementation of a DataGrid component that can handle any structural data with N columns.


## Project Overview

## Demo Materials


### Video
 [Link to Demo Video](https://youtu.be/dAOVxGVYEno)

### Presentation
[Link to Presentation](https://drive.google.com/file/d/1bD8isc6VyXLU0LT_puEA1EXecz0wayQn/view?usp=drive_link)


## Features

### Core Functionality
- **Generic DataGrid Component**: Handles any structural data with N columns
- **Actions Column**: Built-in "View" and "Delete" actions for each row
- **Detail View**: Navigate to detailed pages with back navigation
- **Search Functionality**: Real-time search with backend API integration
- **Advanced Filtering**: Multiple filter criteria 

### Technical Features
- **Full-stack TypeScript**: End-to-end type safety
- **RESTful API**: Well-structured Express.js backend
- **MySQL Integration**: Robust data persistence


## Project Structure

```
generic-datagrid/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── apis/              # API service layer
│   │   ├── components/        # Reusable components
│   │   ├── views/             # Page components
│   │   └── ...
│   └── package.json
├── server/                     # Express Backend
│   ├── src/
│   │   ├── configs/           # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── imports/           # Add data to database
│   │   └── server.ts          # Main server file
│   └── package.json
├── database/
│   └── init.sql              # Database initialization script
└── README.md
```

## Local Setup

### Prerequisites
- Node.js 
- MySQL 
- npm manager
- Docker (optionally)

### 1. Clone the Repository
```bash
git clone https://github.com/AndreeaLupu2000/generic-datagrid.git
cd generic-datagrid
```

### If Docker installed:
```bash
docker compose up --build
```
### If Docker not available
### 2. Database Setup
```bash
mysql -u root -p
source database/init.sql
```

### 3. Backend Setup
```bash
cd server
npm install
npm run import-csv  # only for the first time setup 
npm run start-local 
```

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev      
```

### 5. Access the Application
- Frontend: 
  - local: `http://localhost:5173` 
  - on Docker `http://localhost:3000`
- Backend API: 
  - `http://localhost:8080`

## API Endpoints

### GET `/api/schema`
- **Description**: Retrieves the schema of the database (tables and columns)

### GET `/api/data/:table`
- **Description**: Retrieve all records 
- **Parameters**: `table` - Table name

### POST `/api/data/:table`
- **Description**: Retrieve all records with filtering
- **Parameters**: `table` - Table name
- **Query Parameters**:
  - `field`: Filter column name 
  - `op`: Filter operator 
  - `value`: Filter value 

### GET `/details/:table/:id`
- **Description**: Retrieve a specific car record by ID
- **Parameters**: `table` - Table name
- **Parameters**: `id` - Record ID

### DELETE `/api/data/:table/:id`
- **Description**: Delete a specific record
- **Parameters**: `table` - Table name
- **Parameters**: `id` - Record ID


## Usage Guide

### Viewing Data
1. Navigate to the main DataGrid view
2. Browse through the paginated data
3. Use the filter bar for quick filtering of the input
4. Click column headers to sort data

### Filtering Data
1. Click the filter icon in the toolbar
2. Select a column to filter
3. Choose an operator (contains, equals, etc.)
4. Enter the filter value
5. Apply the filter to see results

### Viewing Details
1. Click the "View" button in the Actions column
2. Review detailed information for the selected item
3. Use the back button to return to the grid

### Deleting Records
1. Click the "Delete" button in the Actions column
2. Confirm the deletion in the dialog
3. The record will be removed from both the grid and database


## 📝 Technical Solution

### Architecture
The application follows a clean **Three-Tier Architecture**:
- **Presentation Layer**: React frontend with Material-UI components
- **Business Logic Layer**: Express.js controllers and services
- **Data Layer**: MySQL database with structured schema

### Architectural Patterns Used

**MVC Pattern (Model-View-Controller)**

- **Views**: React components (DataGridView, ShowDetailsComponent)
- **Controllers**: Express controllers (dataControllers.ts)
-  **Model**: Database schema and data access layer


### Key Design Decisions
1. **MUI X Data Grid**: Chosen for its robust feature set and Material Design compliance
2. **TypeScript**: Ensures type safety across the full stack
3. **Modular Structure**: Separates concerns for maintainability
4. **RESTful API**: Standard HTTP methods for intuitive API design
