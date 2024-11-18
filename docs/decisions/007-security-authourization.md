# ADR - Security and Authourization Decision

## Context 
The library system requires a strong security and scalable authorization mechanism to handle multiple roles (User and Library Manager). Media management functionality must be restricted to managers, while users should only access their personal data. JWT tokens are chosen for stateless authentication.

## Problem Statement
In an advanced library  system, ensuring proper access control is critical for maintaining security, data integrity, and user privacy. Without implementing proper security measures, the entire system becomes vulnerable to unauthorized access, data breaches, and potential misuse of sensitive information.becomes vulnerable to unauthorized access, data breaches, and potential misuse of sensitive information.

## Considered Options
- JSON Web Tokens (JWT)

- Session-Based Authentication

- OAuth 2.0 with Access and Refresh Tokens

## Decision Outcome Confirmations
We have chosen to implement JWT Tokens for security measures, as our primary focus is on authorization for the advanced media library system. Additionally, JWT offers scalability, allowing the system to handle an increasing number of users and requests efficiently. JWT’s flexibility and widespread adoption make it a reliable choice for long-term security.

## Roles for Authorization

- Library Manager: Responsible for managing the media catalog (adding, editing, and deleting media) and accessing library-wide borrowing records for administrative purposes.
- User: Allowed to browse, borrow, and view media but restricted to accessing and managing only their personal borrowing history and wishlist.

## Consequences

## Pros

## Cons

## Confirmations

## Pros and Cons of Options
**Pros**
**Cons**


