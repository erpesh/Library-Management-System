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

Choosing JWT tokens for security and authorization significantly enhances the media system's scalability and performance by reducing server load and enabling quick, stateless user authentication. The tokens are lightweight, ensuring fast and efficient access to resources across different platforms. Additionally, JWT tokens offer strong security through signing and optional encryption, ensuring data integrity and confidentiality. Their flexibility allows for easy integration of custom claims, simplifying authorization and access control, making JWT a robust and efficient solution for modern systems.

## Pros
- Custom Claims for Access Control: JWT tokens can store custom claims, such as user roles or permissions, directly within the token. This makes it easier to manage fine-grained access control, as the token can dictate what resources or actions a user is authorized to access.
- Stateless Authentication: Since JWT tokens contain all the necessary user information within the token itself, they eliminate the need for session storage on the server, making authorization quick and efficient. This allows seamless user authentication without relying on server-side session management.
- Security and Integrity: The signing of JWT tokens ensures the integrity and authenticity of the data, preventing unauthorized users from tampering with the token's contents, thus safeguarding the authorization process.

## Cons
- Token Revocation Challenges: Since JWT tokens are stateless, once issued, they cannot easily be revoked before their expiration. If a token is compromised or if a user logs out, there's no straightforward way to invalidate the token without additional mechanisms, such as maintaining a blacklist or using refresh tokens.
- Token Expiration Management: JWT tokens typically have an expiration time for security purposes. However, this can create a challenge for user experience, as users may need to re-authenticate once the token expires, potentially interrupting their access to resources.
- Increased Token Size: Including custom claims (e.g., user roles or permissions) within the JWT can increase the token size. This may cause inefficiencies, especially when tokens need to be transmitted frequently or over low-bandwidth networks.

## Confirmations

## Pros and Cons of Options
**Pros**
**Cons**


