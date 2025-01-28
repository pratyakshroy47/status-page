# Status Page Application

A modern, real-time status page system built with FastAPI and React. Monitor your services, manage incidents, and keep your users informed about system status.

## Deployed Website:
https://status-page-eta-pearl.vercel.app/

## 🎥 Demo

<div align="center">
  
  ### [▶️ Watch Full Demo Video](https://drive.google.com/file/d/1AJEsOQL10JmX0jnXjkTc_26pC0C-RiZu/view?usp=sharing)
  
  *Click the link above to see the application in action*
</div>
## 🌟 Features

- **Real-time Updates**: Instant service status changes and incident updates
- **Multi-tenant Architecture**: Support for multiple organizations
- **Service Management**: Track and display status of multiple services
- **Incident Management**: Create, update, and resolve incidents
- **User Authentication**: Secure access control with JWT
- **Responsive Design**: Mobile-friendly interface
- **API Documentation**: Auto-generated OpenAPI documentation

## 🛠 Tech Stack

### Backend
- FastAPI (Python 3.9+)
- PostgreSQL
- SQLAlchemy ORM
- Alembic Migrations
- Pydantic
- JWT Authentication

### Frontend
- React 18
- Tailwind CSS
- Axios
- React Router
- Context API
- Vite

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL
- Git

```bash
status-page/
├── backend/
│ ├── app/
│ │ ├── api/ # API endpoints
│ │ ├── core/ # Core functionality
│ │ ├── models/ # Database models
│ │ └── schemas/ # Pydantic schemas
│ ├── alembic/ # Database migrations
│ └── requirements.txt
└── frontend/
├── src/
│ ├── components/ # React components
│ ├── contexts/ # React contexts
│ ├── pages/ # Page components
│ └── services/ # API services
└── package.json
```

## 🔑 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```
### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000/api/v1
```

## 📚 API Documentation

Once the backend is running, access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔄 Database Schema
```bash
-- Key tables and relationships
organizations
├── id (UUID, primary key)
├── name (VARCHAR)
└── subdomain (VARCHAR, unique)
services
├── id (UUID, primary key)
├── name (VARCHAR)
├── status (ENUM)
└── organization_id (UUID, foreign key)
incidents
├── id (UUID, primary key)
├── title (VARCHAR)
├── status (ENUM)
└── service_id (UUID, foreign key)
```

