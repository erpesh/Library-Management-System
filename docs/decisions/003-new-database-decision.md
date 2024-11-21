# ADR: Data Model Strategy – Separate Databases for Each Microservice

## Context

The AML library management system has adopted a microservices architecture to enhance scalability, flexibility, and service autonomy. Each service has specific data requirements, and the chosen data model should support independent, scalable, and adaptable data storage for each service. 

## Problem Statement

To fully leverage the benefits of microservices, the system needs a data model strategy that aligns with its architecture. This strategy should allow each microservice to manage its data independently, prevent data dependencies, and support scalability across different data types and volumes. Additionally, the data model must facilitate the flexibility to evolve and update data schemas without impacting other services.

## Considered Options

1. **Single Database for All Microservices**: All services share a single database, using a relational model.
2. **Separate Databases for Each Microservice** (Selected)

## Chosen Approach: Separate Databases for Each Microservice

We’ve chosen to implement Separate Databases for Each Microservice. Each service will have its own MongoDB database instance, enabling greater flexibility in data modeling and independent scaling.

## Consequences

### Benefits

- **Service Autonomy**: Each service controls its database, allowing for better configurations and isolated data management.
- **Enhanced Scalability**: Databases scale independently based on each service's needs.
- **Schema Flexibility**: MongoDB's schema-less model allows each service to evolve its schema independently.
- **Reduced Risk of Cross-Service Failures**: Independent databases prevent issues in one service from affecting others.

### Trade-offs

- **Increased Operational Overhead**: Managing multiple databases requires advanced monitoring and maintenance.
- **Data Consistency Challenges**: Ensuring consistency across services can be challenging without a centralized database.
- **Higher Maintenance Costs**: Each database must be individually maintained, potentially increasing administrative overhead.

## Pros of Separate Databases per Microservice

- **Independence**: Each service operates with its own database, making it easier to develop and deploy.
- **Optimized Data Models**: Services can tailor their data models and indexes to their specific needs.
- **Flexibility in Schema Management**: MongoDB's flexible schema allows rapid changes without impacting other services.

## Cons of Separate Databases per Microservice

- **Operational Complexity**: Managing multiple databases requires more tools and effort.
- **Data Redundancy**: Some data duplication may occur between services.
- **Cross-Service Transactions**: Multi-service transactions can be harder to manage.

## Confirmations

The decision to use separate MongoDB databases per microservice supports AML’s goal of a highly scalable, flexible, and autonomous microservices architecture. This model is well-suited for the AML system’s data requirements and allows each service to operate independently, ensuring future growth and system reliability.

---

## Pros and Cons of Other Considered Options

### Single Database for All Microservices

   **Pros**:  
   - Simplified management with one centralized database.
   - Easier to maintain cross-service consistency.
   
   **Cons**:  
   - Limits scalability as all services share a single database resource.
   - High risk of cascading failures and performance bottlenecks.
   - Less flexible for services with unique data requirements.

---

## Conclusion

The Separate Databases per Microservice approach is ideal for AML, offering better independence, scalability, and flexibility for each service. Although it adds some operational complexity, the benefits of autonomy and growth potential make it the best choice for the system.
