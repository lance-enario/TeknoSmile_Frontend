DA

# Dentist Appointment App - Backend API

This repository contains the backend source code for the Dentist Appointment Web Application. It is a REST API built with Java and the Spring Boot framework, designed to handle all business logic, data persistence, and user authentication.

## Technology Stack

- **Framework:** Spring Boot 3.5.5
- **Language:** Java 24
- **Database:** PostgreSQL
- **Build Tool:** Maven
- **API Specification:** REST

---

## Getting Started

Follow these steps to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

You must have the following software installed on your machine before proceeding.

| Software | Windows Instructions | Linux (Debian/Ubuntu/Mint) Instructions |
| :--- | :--- | :--- |
| **JDK 24** | Download and run the installer from [Oracle](https://www.oracle.com/asean/java/technologies/downloads/). | Open a terminal and run:<br>`sudo apt update && sudo apt install openjdk-24-jdk` |
| **IntelliJ IDEA** | Download and run the installer from the [JetBrains website](https://www.jetbrains.com/idea/download/). | Download and install from the JetBrains website or via Snap/Flatpak. |
| **PostgreSQL** | Download and run the installer from the [PostgreSQL website](https://www.postgresql.org/download/). **Remember the password you set during installation.** | Open a terminal and run:<br>`sudo apt install postgresql postgresql-contrib`<br><br>After installation, you **must** set a password for the default user:<br>1. `sudo -u postgres psql`<br>2. `\password postgres`<br>3. Enter your new password twice.<br>4. `\q` to quit. |
| **pgAdmin 4** | Download and run the installer from the [pgAdmin website](https://www.pgadmin.org/download/). | Follow the official APT repository instructions from the [pgAdmin website](https://www.pgadmin.org/download/pgadmin-4-apt/) (use the correct Ubuntu codename, e.g., `noble` for Mint 22). |
| **Git** | Download and run the installer from the [git-scm website](https://git-scm.com/download/win). | Open a terminal and run:<br>`sudo apt install git` |

---

### Setup and Installation

1.  **Clone the Repository**
    Open your terminal or Git Bash and clone the project to your local machine:
    ```bash
    git clone https://github.com/your-username/DA
    cd DA
    ```

2.  **Create the PostgreSQL Database**
    - Open pgAdmin 4.
    - Connect to your local PostgreSQL server (using the password you set during installation).
    - In the left sidebar, right-click on `Databases` and select `Create > Database...`.
    - Enter the database name as `dentist_app_db` and click "Save".

3.  **Configure Local Environment Properties**
    - In the project's source code, navigate to `src/main/resources/`.
    - Open the `application.properties` file.
    - Find the line `spring.datasource.password=` and enter the password you set for your local PostgreSQL user.
    ```properties
    # Example:
    spring.datasource.password=mySuperSecretPassword123
    ```
    - **Note:** This file is for local development. Do not commit real production passwords to Git.

4.  **Build and Run the Application**
    - Open the project folder in IntelliJ IDEA.
    - **Important:** If IntelliJ doesn't automatically recognize it, open the `pom.xml` file, right-click inside the editor, and select "Open as Project".
    - Allow Maven to download all the project dependencies. You can see the progress in the bottom-right corner.
    - Find the main application file at `src/main/java/com/yourgroup/api/ApiApplication.java`.
    - Click the green "play" arrow next to the `main` method to run the application.
    - The console should start, and you should see the Spring Boot logo. The application is now running on `http://localhost:8080`.

---

### API Testing

You can test the API endpoints using a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/).

**Example 1: Create a New Patient**
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/patients`
- **Body (JSON):**
  ```json
  {
      "firstName": "Juan",
      "lastName": "Dela Cruz",
      "email": "juan.delacruz@example.com"
  }
  ```

**Example 2: Get All Patients**
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/patients`
