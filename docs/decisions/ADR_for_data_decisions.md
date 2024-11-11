# ADR: Database Strategy for Microservices

## Context

The AML system's microservices architecture requires a flexible and scalable data storage strategy to support the specific data needs and workloads of each service. To align with the microservices approach, we need a database strategy that enables each service to manage and access its data independently while supporting system scalability and data isolation.

## Problem Statement

To optimize performance, flexibility, and scalability, each microservice in the AML system should have the freedom to use a database solution tailored to its unique requirements. The database strategy should allow services to store structured and unstructured data, accommodate future growth, and prevent interdependencies between services, minimizing the risk of cascading failures and operational bottlenecks.

## Considered Options

1. **Single Database for All Microservices**  
2. **Different Databases per Microservice**  
3. **Hybrid Approach (Core Services in Shared Database, Others Independent)**

## Chosen Approach: Different Databases per Microservice

After reviewing various approaches, we have decided to implement a **"Different Databases per Microservice"** strategy. Each microservice will have its own database instance, and MongoDB will be the default database choice due to its flexibility and scalability benefits in a microservices environment. However, each service is free to select a database that best meets its specific needs.

## Consequences

### Benefits

- **Data Independence and Isolation**: Each service controls its own database, improving resilience and minimizing the risk of cross-service data inconsistencies or failures.
- **Scalability**: Databases can be scaled individually based on service-specific loads, optimizing resource usage and performance.
- **Flexibility**: Services with unique data storage needs (e.g., structured vs. unstructured data) can select the database that aligns best with their requirements.
- **Easier Schema Evolution**: Database schemas can evolve independently, enabling services to adapt more rapidly to changing requirements without affecting other services.

### Trade-offs

- **Increased Complexity**: Managing multiple databases increases operational complexity, including setup, monitoring, and backup processes.
- **Higher Maintenance Costs**: Each database requires separate maintenance and tuning, leading to higher administrative costs.
- **Data Consistency Challenges**: Cross-service consistency must be managed carefully, as there is no single, centralized database to enforce consistency rules across services.

## Pros of Different Databases per Microservice

- **Improved Service Autonomy**: Microservices are independent and self-contained, simplifying development and maintenance.
- **Optimized Performance**: Databases can be selected based on the data access patterns and load of each service, allowing each service to maximize its performance.
- **Reduced Risk of Cross-Service Failures**: Isolated databases mean failures in one database do not impact others, reducing the likelihood of system-wide disruptions.

## Cons of Different Databases per Microservice

- **Increased Operational Overhead**: Multiple databases require more sophisticated monitoring and maintenance solutions.
- **Complex Data Management**: Ensuring cross-service data consistency, if required, will be more challenging without a shared database.
- **Additional Training**: Teams may need to be familiar with multiple database types if services choose databases other than MongoDB.

## Confirmations

We have confirmed that using different databases per microservice aligns well with AML’s microservices architecture and supports our scalability and flexibility goals. MongoDB is selected as the primary database option, but each service is free to choose an alternative database if it provides a better fit for its requirements.

---

## Pros and Cons of Other Considered Options

### 1. Single Database for All Microservices

   **Pros**:  
   - Simplified management with a single point of maintenance.
   - Consistent data access rules across services.

   **Cons**:  
   - Limits scalability, as all services depend on a shared resource.
   - Increases risk of cascading failures across microservices due to database contention or failure.
   - Less flexibility for services with unique data requirements.

### 2. Hybrid Approach (Core Services in Shared Database, Others Independent)

   **Pros**:  
   - Balances some of the simplicity of a shared database with the autonomy of separate databases.
   - Core services benefit from shared data consistency, while others have the flexibility to use independent databases.

   **Cons**:  
   - Complexity remains high, as both shared and independent databases require coordination.
   - Risk of performance bottlenecks in the shared database, potentially impacting critical services.

---

## Conclusion

The **Different Databases per Microservice** strategy was chosen to align with AML’s microservices architecture and ensure high scalability, autonomy, and flexibility for each service. MongoDB will serve as the default database due to its schema flexibility, scalability, and support for unstructured data, but individual services have the freedom to select the most appropriate database for their specific needs. This approach provides a robust foundation for handling AML’s current and future data demands, despite the increased operational complexity.
