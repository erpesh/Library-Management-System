# ADR: Data Model Strategy – Separate Databases for Each Microservice

## Context

The AML library management system has adopted a microservices architecture to enhance scalability, flexibility, and service autonomy. Each service has specific data requirements, and the chosen data model should support independent, scalable, and adaptable data storage for each service. 

## Problem Statement

To fully leverage the benefits of microservices, the system needs a data model strategy that aligns with its architecture. This strategy should allow each microservice to manage its data independently, prevent data dependencies, and support scalability across different data types and volumes. Additionally, the data model must facilitate the flexibility to evolve and update data schemas without impacting other services.

## Considered Options

1. **Single Database for All Microservices**: All services share a single database, using a relational model.
2. **Shared Database with Separate Schemas**: Each service has its own schema within a shared database.
3. **Separate Databases for Each Microservice** (Selected)

## Chosen Approach: Separate Databases for Each Microservice

After evaluating these options, the decision is to implement a **Separate Databases for Each Microservice** strategy. This approach enables each service to maintain its own MongoDB database instance, supporting flexibility in data modeling, independent scaling, and minimized interdependencies between services.

## Consequences

### Benefits

- **Service Autonomy**: Each microservice independently controls its database, allowing for tailored configurations, optimized queries, and isolated data management.
- **Enhanced Scalability**: Each service's database can scale independently, addressing specific workload demands and improving resource utilization across the system.
- **Schema Flexibility**: MongoDB’s flexible document model allows for schema evolution within each service, making it easier to adapt to new data requirements.
- **Reduced Risk of Cross-Service Failures**: Independent databases mean that issues in one service’s data layer do not impact others, reducing the risk of cascading failures.

### Trade-offs

- **Increased Operational Overhead**: Managing multiple databases requires a more complex setup for monitoring, backup, and maintenance.
- **Data Consistency Challenges**: Cross-service data consistency requires careful orchestration since there is no single, centralized database to enforce consistency.
- **Higher Maintenance Costs**: Each database requires individual maintenance and may increase administrative costs over time.

## Pros of Separate Databases per Microservice

- **Enhanced Service Independence**: With separate databases, services are more autonomous, making them easier to develop, maintain, and deploy.
- **Optimized Data Models**: Each service can choose the optimal data model and indexing strategy, improving overall performance.
- **Flexibility in Schema Management**: MongoDB’s schema-less model allows for rapid changes within services without affecting others, supporting agile development.

## Cons of Separate Databases per Microservice

- **Operational Complexity**: Managing separate databases per service requires advanced tooling for effective monitoring and maintenance.
- **Data Redundancy**: Without a shared database, there may be some data redundancy across services, potentially leading to higher storage needs.
- **Cross-Service Transactions**: Multi-service transactions are more challenging, as MongoDB’s transaction support across services is limited compared to relational databases.

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

### Shared Database with Separate Schemas

   **Pros**:  
   - Moderate simplicity with a single database, while allowing some separation of data between services.
   - Eases some operational burden compared to fully separate databases.
   
   **Cons**:  
   - Cross-service dependency risks and performance bottlenecks remain.
   - Complexity in managing database resources to avoid interference between service schemas.

---

## Conclusion

The **Separate Databases per Microservice** approach aligns with the AML system’s microservices architecture by providing data independence, flexibility, and scalability for each service. MongoDB’s document-oriented model and schema flexibility make it an ideal database solution for each independent microservice, offering agile data management capabilities and the ability to scale horizontally as the system grows. Although this approach introduces operational complexity and some cross-service consistency challenges, the benefits for AML’s scalability and service autonomy outweigh the trade-offs.
