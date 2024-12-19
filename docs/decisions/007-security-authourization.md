# ADR: Security and Authorization Strategy

## Context
The library system requires robust and scalable security to manage authentication and authorization for roles: Admins, Regular Users, and Unauthenticated Users. Role-based access control (RBAC) ensures only authorized users access specific features. The system incorporates modern security practices such as HTTPS, role-based middleware, and session-based authentication.

### Key Security Features
1. **Encryption:**
   - Communication secured via HTTPS (TLS).
   - Passwords hashed with bcrypt.
   - Session tokens encrypted for added protection.

2. **Authentication:**
   - **NextAuth** for secure, scalable authentication.
   - Email-based magic links eliminate passwords.
   - Sessions stored in HTTP-only cookies, preventing XSS attacks.
   - Built-in CSRF protection.

3. **Access Control:**
   - **Roles:**
     - **Admins:** Full access to manage media.
     - **Regular Users:** Borrow, return, renew items, manage wishlists.
     - **Unauthenticated Users:** View and search media.
   - Middleware enforces role-appropriate access.

4. **Microservices Security:**
   - Secured via **Next.js API gateway**, restricting unauthorized requests.

5. **Data Tables:**
   - **Users Table:** Stores emails and roles.
   - **Session Table:** Tracks user sessions with expiration.
   - **Verification Token Table:** Handles secure, one-time magic links.

---

## Problem Statement
Proper security and access control are essential for safeguarding data, maintaining user privacy, and preventing unauthorized access. Without these, the system risks data breaches and misuse.

---

## Considered Options
1. **JWT Tokens for Stateless Authentication**
2. **Session-Based Authentication with NextAuth**
3. **OAuth 2.0 with Access and Refresh Tokens**

---

## Decision Outcome
We selected **Session-Based Authentication with NextAuth** for its balance of security, scalability, and usability.

### Key Considerations
- **Encryption and Secure Storage:** Sessions are protected against XSS and CSRF.
- **Scalability:** Middleware enables efficient, secure access control.
- **User Experience:** Email-based magic links improve usability and security.

---

## Consequences
### Pros:
1. Secure, encrypted sessions.
2. Password-free authentication reduces credential risks.
3. Middleware ensures precise access control.
4. Centralized microservice protection.

### Cons:
1. Session expiration may interrupt workflows.
2. Managing session tables and middleware adds complexity.

---

## Alternatives
### JSON Web Tokens (JWT):
- **Pros:** Stateless, supports custom claims.
- **Cons:** Revocation challenges, larger token sizes.

### OAuth 2.0:
- **Pros:** Seamless long-term access, granular permissions.
- **Cons:** Complex implementation, secure token storage required.

---

## Conclusion
**Session-Based Authentication with NextAuth** ensures robust security, scalability, and usability for the library system, making it the optimal choice for long-term success.

