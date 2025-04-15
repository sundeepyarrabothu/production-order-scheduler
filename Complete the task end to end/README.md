# Production Order Scheduler

A focused web application to manage and schedule Production Orders onto predefined Resources. This application allows users to create orders, assign them to a resource with a time slot, and visualize the status of orders and resources.

## Features Implemented

### Core Features
- Production Order Management with Create/Edit functionality
- Resource assignment and scheduling
- Order status tracking
- Tanstack Table for data display with sorting and filtering
- Dashboard with Recharts visualizations
- Form validation with Zod
- End-to-end testing with Playwright

### Technical Implementation
- Next.js with TypeScript
- Tailwind CSS for responsive styling
- Zustand for state management
- React Hook Form for form handling
- Date-fns for date manipulation

## Setup Instructions

### Prerequisites
- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/production-order-scheduler.git
cd production-order-scheduler
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Testing Approach

The application includes comprehensive end-to-end tests using Playwright that cover the main user flows:

- Order Creation: Tests creating orders with valid data and validation for invalid data
- Order Editing & Scheduling: Tests editing existing orders and scheduling them to resources
- Scheduling Validation: Tests validation logic for scheduling (e.g., end time must be after start time)
- Table Interaction: Tests filtering functionality in the orders table
- Dashboard Display: Tests that charts and visualizations render correctly

### Running Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run the tests
npm run test:e2e
# or
yarn test:e2e
```

## Technical Decisions

### State Management
- Used Zustand for state management due to its simplicity and minimal boilerplate compared to Redux
- Implemented separate stores for resources and orders to maintain separation of concerns

### Form Validation
- Used Zod with React Hook Form for robust type-safe validation
- Implemented complex validation rules for scheduling (e.g., ensuring end time is after start time)

### UI Components
- Used Tailwind CSS for utility-first styling approach, enabling rapid UI development
- Implemented responsive design that works well on both desktop and mobile devices
- Used Tanstack Table for advanced table functionality with minimal setup

### Data Visualization
- Used Recharts for creating interactive and responsive charts
- Implemented both pie charts and bar charts to visualize different aspects of the data

## Project Structure

```
/src
  /app - Next.js app router pages
  /components
    /dashboard - Dashboard components and charts
    /layout - Layout components (Header, Footer)
    /orders - Order management components
    /resources - Resource management components
  /store - Zustand stores
  /types - TypeScript type definitions
/tests - Playwright E2E tests
```

## Known Issues/Limitations

- In-memory state management means data is lost on page refresh
- Limited conflict detection for resource scheduling
- No user authentication or multi-user support
- Limited error handling for edge cases

## Future Enhancements (Phase 2)

If time permits, the following enhancements could be implemented:

- Full CRUD for Resources
- SQL database integration with Prisma
- API endpoints for data persistence
- Conflict highlighting for scheduling
- Drag-and-drop interface for scheduling
- Calendar view for resource allocation

## License

MIT
