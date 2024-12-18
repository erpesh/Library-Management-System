# Project Name

Welcome to the **Project Name** repository! This project provides an application to [brief description of what the application does].


## Prerequisites

Ensure you have the following installed before proceeding with the installation:

- [Docker](https://www.docker.com/products/docker-desktop/)

## Installation

Follow these steps to set up the application locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/repository-name.git
cd repository-name
```

### Step 2: Navigate to the /aml Directory

Move into the `aml` directory, where the Docker configuration files are located:

```bash
cd aml
```

### Step 3: Build and Run the Application with Docker Compose

Run the following command to build the Docker images and start the application:

```bash
docker-compose up --build
```
The --build flag ensures the application is rebuilt if there are any changes.


### Step 4: Access the Frontend

Once the application has been successfully built, open your browser and navigate to:

```bash
http://localhost:3000
```
You should see the application running!
