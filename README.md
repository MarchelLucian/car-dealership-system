# DealerAuto

Car Dealership Web Platform (Spring Boot · MVC · PostgreSQL) — full-stack Java web application with a dynamic UI built using Thymeleaf and JavaScript.

The application includes three main modules:
- Online customer interface  
- Sales agent module for vehicle inventory and sales management  
- Manager dashboard with analytics and agent performance tracking  

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.5.7, Spring Data JPA, Thymeleaf
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript (no frameworks)
- **Deployment:** Docker, Render (Frankfurt)

## Roles

| Role | Capabilities |
|------|-------------|
| **Client** | Browse cars, filter/sort, manage favorites, place orders, manage account |
| **Agent** | Manage car inventory (add, edit, retract), register sales, add clients |
| **Manager** | Analytics dashboard, sales overview, staff management (add/remove agents and managers) |

## Project Structure

```
car-dealership-system/
├── dealerauto/              # Spring Boot application
│   ├── src/main/java/       # Controllers, Services, DAOs, Models
│   ├── src/main/resources/
│   │   ├── templates/       # Thymeleaf templates
│   │   ├── static/          # CSS, JS, images
│   │   └── application.properties
│   └── pom.xml
├── Dockerfile
└── render.yaml
```

## Running Locally

**Prerequisites:** Java 17, PostgreSQL (database `DealerAuto` on `localhost:5432`)

```bash
cd dealerauto
./mvnw spring-boot:run
```

The app starts on **port 8082**.

## Database

14 tables covering cars, clients, agents, managers, sales, favorites, brands, providers, and pricing.

Schema diagrams are available in the repository root:
- `Database Schema DealerAuto.png`
- `Database Schema with constraints.png`
