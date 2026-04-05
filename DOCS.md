# Tasty Town - Admin Panel Documentation

## 1. Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a `.env` file based on `.env.example`.
3. Set your `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
4. Run `npm install`.
5. Run `npm start`.

### Frontend Setup
1. Navigate to the `Frontend` directory.
2. Run `npm install`.
3. Set up your `.env` file with `VITE_API_BASE_URL`.
4. Run `npm run dev`.

## 2. API Endpoints (Admin)

All endpoints require a Bearer Token in the `Authorization` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/bootstrap` | Initial data for the dashboard. |
| PATCH | `/admin/orders/:id` | Update order status. |
| PATCH | `/admin/users/:id/block` | Block/Unblock a user. |
| DELETE | `/admin/users/:id` | Remove a user. |
| DELETE | `/admin/reviews/:id` | Remove a review. |
| PUT | `/admin/settings` | Update site settings. |
| POST | `/admin/menu-categories` | Create a new menu category. |
| PATCH | `/admin/menu-categories/:id` | Update a menu category. |
| DELETE | `/admin/menu-categories/:id` | Delete a menu category. |
| POST | `/admin/menu-items` | Create a new menu item. |
| PATCH | `/admin/menu-items/:id` | Update a menu item. |
| DELETE | `/admin/menu-items/:id` | Delete a menu item. |

## 3. User Guide

### Dashboard Overview
The dashboard provides real-time metrics for total revenue, active orders, total customers, and pending reviews. Interactive charts visualize order volume and user growth.

### Managing Orders
Navigate to the "Orders" section to view and update order statuses (Pending, Confirmed, Preparing, Delivered, Cancelled).

### User Management
Control customer access by blocking or removing users from the "Users" section.

### Content Management
- **Menus**: Create and organize menu categories.
- **Items**: Add, edit, and remove dishes. Toggle "Featured" status for visibility on the homepage.

### Settings
Update the website's title, hero badge, logo, and contact information from the "Settings" section.

## 4. Security
- **RBAC**: Role-based access control is enforced on both frontend and backend.
- **Sanitization**: All inputs are trimmed and validated.
- **Session Management**: Admin tokens have a configurable TTL (default 12 hours).
