# ADR: Database Selection

## Context
Selecting a database for the AML system to handle reading and writing data.

## Problem Statement
The library management system needs a database that ensures efficient performance, data consistency, and scalability. It should support high data volumes, diverse data types, and future growth within a microservices architecture.

## Considered Options
- MySQL  
- Oracle Database  
- MongoDB  

## Decision Outcome Confirmation
After careful consideration of various database options for the AML system, **MongoDB has been chosen** as our database solution. MongoDB’s document-oriented model, schema flexibility, and horizontal scalability make it a good option for a microservices architecture where flexibility and scalability are essential.

## Consequences
The primary priority is scalability, especially within a microservices context where data distribution and schema flexibility are crucial. MongoDB’s architecture enables the system to handle large volumes of data and accommodates unstructured and semi-structured data that may arise from different microservices.

With MongoDB’s flexible schema, the system can adapt to changes in data structure without requiring extensive modifications, providing a more agile solution as services evolve.

## Pros
- MongoDB’s document-oriented model allows for easy handling of unstructured and semi-structured data, which is great for the needs of multiple microservices.
- MongoDB is designed for horizontal scalability, making it easy to distribute data across multiple servers and ideal for scaling in a microservices environment.
- MongoDB is optimized for high-speed read and write operations, which is essential for a large, growing system like the AML library management service.
- Changes in schema requirements across microservices can be easily accommodated, supporting agile development without database downtime.

## Cons
- While MongoDB supports transactions, multi-document transactions are not as robust as in traditional relational database systems, which may limit their use in complex, cross-document scenarios.
- MongoDB’s query language can be complex for users used to SQL, adding a learning curve for teams transitioning from relational databases.

## Confirmations
We have decided to implement MongoDB as the database solution for the library management system. This decision is based on MongoDB’s flexibility, scalability, and performance advantages within a microservices architecture, ensuring a reliable, adaptable, and efficient data management solution for current and future needs of the system.

## Pros and Cons of Options

### Oracle Database

**Pros**:  
- Advanced security, analytics, and extensive data type support.  
- Handles large volumes of transactions efficiently.  
- Manages growing data and user loads effectively.  

**Cons**:  
- Licensing and operational expenses are significant.  
- Requires specialized expertise
- Demands high hardware resources, increasing infrastructure costs.  

### MySQL  

**Pros**:  
- Consistently fast with high uptime.  
- Cost-effective with a robust community support.  
- Ensures consistency across all transactions.  

**Cons**:  
- Primarily designed for structured data, limiting flexibility in a microservices architecture.  
- Transitioning to or from MySQL can be complex.  
- Large datasets may require performance tuning, increasing maintenance efforts.  
