# FindMyPuppy - Comprehensive Test Specification

## Test Coverage Overview

This document outlines all test cases covering functional, non-functional, security, and edge case scenarios for the FindMyPuppy game application.

---

## 1. Authentication Tests

### TC-AUTH-001: Valid Login
- **Description**: Verify successful login with valid credentials
- **Preconditions**: User exists in database
- **Steps**: POST /api/login with valid username and password
- **Expected**: 200 OK, success: true, user data returned
- **Priority**: High

### TC-AUTH-002: Invalid Username
- **Description**: Verify login rejection for non-existent username
- **Steps**: POST /api/login with non-existent username
- **Expected**: 404 Not Found, success: false
- **Priority**: High

### TC-AUTH-003: Invalid Password
- **Description**: Verify login rejection for incorrect password
- **Preconditions**: User exists
- **Steps**: POST /api/login with correct username, wrong password
- **Expected**: 401 Unauthorized, success: false
- **Priority**: High

### TC-AUTH-004: Missing Credentials
- **Description**: Verify validation for empty credentials
- **Steps**: POST /api/login with empty username/password
- **Expected**: 400 Bad Request or 404
- **Priority**: Medium

### TC-AUTH-005: Valid Signup
- **Description**: Verify successful user registration
- **Steps**: POST /api/signup with valid unique data
- **Expected**: 201 Created, success: true
- **Priority**: High

### TC-AUTH-006: Duplicate Username Signup
- **Description**: Verify rejection of duplicate username
- **Preconditions**: User with username exists
- **Steps**: POST /api/signup with existing username
- **Expected**: 409 Conflict, success: false
- **Priority**: High

### TC-AUTH-007: Duplicate Email Signup
- **Description**: Verify rejection of duplicate email
- **Preconditions**: User with email exists
- **Steps**: POST /api/signup with existing email
- **Expected**: 409 Conflict, success: false
- **Priority**: High

### TC-AUTH-008: Missing Signup Fields
- **Description**: Verify validation of required fields
- **Steps**: POST /api/signup with missing fields
- **Expected**: 400 Bad Request, success: false
- **Priority**: Medium

### TC-AUTH-009: SQL Injection Protection (Username)
- **Description**: Verify protection against SQL injection in username
- **Steps**: POST /api/login with SQL injection payload
- **Expected**: 404 or 401 (safely rejected)
- **Priority**: Critical

### TC-AUTH-010: XSS Protection (Username)
- **Description**: Verify protection against XSS in username
- **Steps**: POST /api/login with XSS payload
- **Expected**: 404 or 401 (safely rejected)
- **Priority**: Critical

### TC-AUTH-011: Password Hashing
- **Description**: Verify passwords are hashed and not stored in plaintext
- **Steps**: Create user, verify login works, check password not in response
- **Expected**: Password hashed, login successful, password not exposed
- **Priority**: Critical

---

## 2. User Data Management Tests

### TC-USER-001: Get User Data
- **Description**: Retrieve user information
- **Steps**: GET /api/user/{username}
- **Expected**: 200 OK, user data returned
- **Priority**: High

### TC-USER-002: Update Hints
- **Description**: Update user's hint count
- **Steps**: POST /api/user/update-hints
- **Expected**: 200 OK, hints updated
- **Priority**: High

### TC-USER-003: Update Points
- **Description**: Update user's points
- **Steps**: POST /api/user/update-points
- **Expected**: 200 OK, points updated
- **Priority**: High

### TC-USER-004: Update Level Passed (Easy)
- **Description**: Update Easy difficulty level progress
- **Steps**: POST /api/user/update-level-passed with difficulty='Easy'
- **Expected**: 200 OK, levelPassedEasy updated
- **Priority**: High

### TC-USER-005: Update Level Passed (Medium)
- **Description**: Update Medium difficulty level progress
- **Steps**: POST /api/user/update-level-passed with difficulty='Medium'
- **Expected**: 200 OK, levelPassedMedium updated
- **Priority**: High

### TC-USER-006: Update Level Passed (Hard)
- **Description**: Update Hard difficulty level progress
- **Steps**: POST /api/user/update-level-passed with difficulty='Hard'
- **Expected**: 200 OK, levelPassedHard updated
- **Priority**: High

### TC-USER-007: Invalid Username Validation
- **Description**: Verify rejection of updates for non-existent user
- **Steps**: POST /api/user/update-hints with invalid username
- **Expected**: 404 Not Found
- **Priority**: Medium

### TC-USER-008: Missing Required Fields
- **Description**: Verify validation of required fields
- **Steps**: POST /api/user/update-hints with missing fields
- **Expected**: 400 Bad Request
- **Priority**: Medium

### TC-USER-009: Negative Values Handling
- **Description**: Verify handling of negative values
- **Steps**: POST /api/user/update-hints with negative hints
- **Expected**: Validation error or accepted (document behavior)
- **Priority**: Low

### TC-USER-010: Large Values Handling
- **Description**: Verify handling of very large values
- **Steps**: POST /api/user/update-hints with very large number
- **Expected**: Accepted or validation error
- **Priority**: Low

---

## 3. Purchase History Tests

### TC-PURCH-001: Create Purchase History (Money)
- **Description**: Record money-based purchase
- **Steps**: POST /api/purchase-history with purchaseMode='Money'
- **Expected**: 201 Created, purchase recorded
- **Priority**: High

### TC-PURCH-002: Create Purchase History (Points)
- **Description**: Record points-based purchase
- **Steps**: POST /api/purchase-history with purchaseMode='Points'
- **Expected**: 201 Created, purchase recorded
- **Priority**: High

### TC-PURCH-003: Get Purchase History
- **Description**: Retrieve user's purchase history
- **Steps**: GET /api/purchase-history/{username}
- **Expected**: 200 OK, array of purchases
- **Priority**: High

### TC-PURCH-004: Duplicate Purchase Prevention
- **Description**: Verify prevention of duplicate purchase entries
- **Steps**: Create same purchase twice rapidly
- **Expected**: Second attempt returns existing purchase
- **Priority**: High

### TC-PURCH-005: Missing Required Fields
- **Description**: Verify validation of required fields
- **Steps**: POST /api/purchase-history with missing fields
- **Expected**: 400 Bad Request
- **Priority**: Medium

### TC-PURCH-006: Invalid Purchase Type
- **Description**: Verify rejection of invalid purchase type
- **Steps**: POST /api/purchase-history with invalid purchaseType
- **Expected**: 400 Bad Request
- **Priority**: Medium

### TC-PURCH-007: User Data Isolation
- **Description**: Verify users can only see their own purchases
- **Steps**: Get purchase history, verify no other user's data
- **Expected**: Only user's own purchases returned
- **Priority**: Critical

---

## 4. Price Offer Tests

### TC-PRICE-001: Get Price Offer
- **Description**: Retrieve current price offer
- **Steps**: GET /api/price-offer
- **Expected**: 200 OK, offer data returned
- **Priority**: High

### TC-PRICE-002: Update Price Offer
- **Description**: Create/update price offer
- **Steps**: POST /api/price-offer with offer data
- **Expected**: 200 OK, offer updated
- **Priority**: High

### TC-PRICE-003: Missing Required Fields
- **Description**: Verify validation of required fields
- **Steps**: POST /api/price-offer with missing fields
- **Expected**: 400 Bad Request
- **Priority**: Medium

### TC-PRICE-004: Invalid Price Values
- **Description**: Verify handling of negative/invalid prices
- **Steps**: POST /api/price-offer with negative values
- **Expected**: Validation error or accepted (document behavior)
- **Priority**: Low

---

## 5. Security Tests

### TC-SEC-001: CORS Configuration
- **Description**: Verify CORS headers are properly configured
- **Steps**: Check response headers for CORS
- **Expected**: Appropriate CORS headers present
- **Priority**: Medium

### TC-SEC-002: SQL Injection Protection
- **Description**: Verify protection against SQL injection
- **Steps**: Attempt SQL injection in various fields
- **Expected**: Safely rejected, no data breach
- **Priority**: Critical

### TC-SEC-003: NoSQL Injection Protection
- **Description**: Verify protection against NoSQL injection
- **Steps**: Attempt NoSQL injection payloads
- **Expected**: Safely rejected
- **Priority**: Critical

### TC-SEC-004: XSS Protection
- **Description**: Verify protection against XSS attacks
- **Steps**: Attempt XSS payloads in input fields
- **Expected**: Safely rejected or sanitized
- **Priority**: Critical

### TC-SEC-005: Path Traversal Protection
- **Description**: Verify protection against path traversal
- **Steps**: Attempt path traversal in URLs
- **Expected**: Safely blocked
- **Priority**: High

### TC-SEC-006: Authorization Check
- **Description**: Verify proper authorization controls
- **Steps**: Attempt to access other user's data
- **Expected**: Access denied or proper isolation
- **Priority**: Critical

### TC-SEC-007: Rate Limiting
- **Description**: Verify rate limiting is implemented
- **Steps**: Send multiple rapid requests
- **Expected**: Rate limiting active (429 if exceeded)
- **Priority**: Medium

### TC-SEC-008: Sensitive Data Exposure
- **Description**: Verify sensitive data not exposed
- **Steps**: Check API responses for passwords/tokens
- **Expected**: No sensitive data in responses
- **Priority**: Critical

---

## 6. Performance Tests

### TC-PERF-001: API Response Time
- **Description**: Verify health endpoint response time
- **Steps**: GET /api/health, measure response time
- **Expected**: < 1000ms
- **Priority**: Medium

### TC-PERF-002: Login Response Time
- **Description**: Verify login endpoint performance
- **Steps**: POST /api/login, measure response time
- **Expected**: < 2000ms
- **Priority**: Medium

### TC-PERF-003: Concurrent Request Handling
- **Description**: Verify system handles concurrent requests
- **Steps**: Send 10 concurrent requests
- **Expected**: All handled within 5000ms
- **Priority**: Medium

### TC-PERF-004: Database Query Performance
- **Description**: Verify database query performance
- **Steps**: GET /api/user/{username}, measure time
- **Expected**: < 1500ms
- **Priority**: Medium

---

## 7. Edge Cases

### TC-EDGE-001: Very Long Username
- **Description**: Verify handling of extremely long usernames
- **Steps**: Attempt signup with 1000+ character username
- **Expected**: Validation error or accepted (document behavior)
- **Priority**: Low

### TC-EDGE-002: Special Characters
- **Description**: Verify handling of special characters
- **Steps**: Attempt signup with special characters
- **Expected**: Accepted or rejected appropriately
- **Priority**: Low

### TC-EDGE-003: Unicode Characters
- **Description**: Verify handling of Unicode characters
- **Steps**: Attempt signup with Unicode username
- **Expected**: Handled appropriately
- **Priority**: Low

### TC-EDGE-004: Empty JSON Body
- **Description**: Verify handling of empty request body
- **Steps**: POST with empty JSON body
- **Expected**: 400 Bad Request
- **Priority**: Medium

### TC-EDGE-005: Invalid JSON
- **Description**: Verify handling of malformed JSON
- **Steps**: POST with invalid JSON syntax
- **Expected**: 400 Bad Request
- **Priority**: Medium

### TC-EDGE-006: Case Sensitivity
- **Description**: Verify username case sensitivity
- **Steps**: Login with different case username
- **Expected**: Case-sensitive behavior
- **Priority**: Low

### TC-EDGE-007: Whitespace Handling
- **Description**: Verify handling of leading/trailing whitespace
- **Steps**: Login with whitespace in credentials
- **Expected**: Properly handled (trimmed or rejected)
- **Priority**: Low

### TC-EDGE-008: Null Values
- **Description**: Verify handling of null values
- **Steps**: POST with null in required fields
- **Expected**: 400 Bad Request
- **Priority**: Medium

---

## 8. Game Functionality Tests

### TC-GAME-001: Level Progression (Easy)
- **Description**: Verify Easy difficulty level progression tracking
- **Steps**: POST /api/user/update-level-passed with difficulty='Easy'
- **Expected**: 200 OK, levelPassedEasy updated
- **Priority**: High

### TC-GAME-002: Level Progression (Medium)
- **Description**: Verify Medium difficulty level progression tracking
- **Steps**: POST /api/user/update-level-passed with difficulty='Medium'
- **Expected**: 200 OK, levelPassedMedium updated
- **Priority**: High

### TC-GAME-003: Level Progression (Hard)
- **Description**: Verify Hard difficulty level progression tracking
- **Steps**: POST /api/user/update-level-passed with difficulty='Hard'
- **Expected**: 200 OK, levelPassedHard updated
- **Priority**: High

### TC-GAME-004: Points Award System (Easy = 5 points)
- **Description**: Verify Easy difficulty awards 5 points per level
- **Steps**: Update points based on Easy level progression
- **Expected**: Points correctly calculated (5 points per level)
- **Priority**: High

### TC-GAME-005: Points Award System (Medium = 10 points)
- **Description**: Verify Medium difficulty awards 10 points per level
- **Steps**: Update points based on Medium level progression
- **Expected**: Points correctly calculated (10 points per level)
- **Priority**: High

### TC-GAME-006: Points Award System (Hard = 15 points)
- **Description**: Verify Hard difficulty awards 15 points per level
- **Steps**: Update points based on Hard level progression
- **Expected**: Points correctly calculated (15 points per level)
- **Priority**: High

### TC-GAME-007: Hints Purchase
- **Description**: Verify hints can be purchased and stored
- **Steps**: POST /api/user/update-hints with purchased hints
- **Expected**: 200 OK, hints updated correctly
- **Priority**: High

### TC-GAME-008: Hints Deduction
- **Description**: Verify hints are deducted when used
- **Steps**: POST /api/user/update-hints with reduced hints
- **Expected**: 200 OK, hints correctly deducted
- **Priority**: High

### TC-GAME-009: Multiple Level Progressions
- **Description**: Verify multiple level progressions are tracked correctly
- **Steps**: Update level passed multiple times
- **Expected**: Latest level count is correct
- **Priority**: Medium

### TC-GAME-010: User Data Persistence
- **Description**: Verify all game data persists correctly
- **Steps**: GET /api/user/{username} and verify all fields
- **Expected**: All game data fields present and valid
- **Priority**: High

---

## 9. Payment Flow Tests

### TC-PAY-001: Money Payment - Purchase Hints
- **Description**: Verify money-based hint purchase
- **Steps**: POST /api/purchase-history with purchaseMode='Money'
- **Expected**: 201 Created, purchase recorded
- **Priority**: High

### TC-PAY-002: Points Payment - Purchase Hints
- **Description**: Verify points-based hint purchase
- **Steps**: POST /api/purchase-history with purchaseMode='Points'
- **Expected**: 201 Created, purchase recorded
- **Priority**: High

### TC-PAY-003: Payment History Retrieval
- **Steps**: GET /api/purchase-history/{username}
- **Expected**: 200 OK, array of purchases with both Money and Points modes
- **Priority**: High

### TC-PAY-004: Payment Amount Validation
- **Description**: Verify payment amount validation
- **Steps**: POST /api/purchase-history with amount=0
- **Expected**: Validation error or accepted (document behavior)
- **Priority**: Medium

### TC-PAY-005: Payment Mode Validation
- **Description**: Verify payment mode validation
- **Steps**: POST /api/purchase-history with invalid purchaseMode
- **Expected**: Validation error or defaults to Money
- **Priority**: Medium

### TC-PAY-006: Payment Security - Unauthorized Access
- **Description**: Verify users cannot view other users' payment history
- **Steps**: GET /api/purchase-history/{otherUser} with different currentUser
- **Expected**: 403 Forbidden
- **Priority**: Critical

### TC-PAY-007: Payment Deduplication
- **Description**: Verify duplicate payments are prevented
- **Steps**: Create same purchase twice rapidly
- **Expected**: Second attempt returns existing purchase
- **Priority**: High

### TC-PAY-008: Payment with Points - Insufficient Points
- **Description**: Verify handling of insufficient points
- **Steps**: Attempt purchase with insufficient points
- **Expected**: Appropriate error or validation
- **Priority**: Medium

### TC-PAY-009: Payment Amount Precision
- **Description**: Verify decimal amounts are handled correctly
- **Steps**: POST /api/purchase-history with decimal amount
- **Expected**: 201 Created, amount stored correctly
- **Priority**: Low

### TC-PAY-010: Payment History Sorting
- **Description**: Verify purchase history is sorted by date
- **Steps**: GET /api/purchase-history/{username}
- **Expected**: Purchases sorted by date (most recent first)
- **Priority**: Medium

---

## 10. Hint System Tests

### TC-HINT-001: Hints Initialization
- **Description**: Verify hints can be initialized to 0
- **Steps**: POST /api/user/update-hints with hints=0
- **Expected**: 200 OK, hints=0
- **Priority**: Medium

### TC-HINT-002: Hints Addition (Purchase)
- **Description**: Verify hints are added after purchase
- **Steps**: POST /api/user/update-hints with purchased hints
- **Expected**: 200 OK, hints updated correctly
- **Priority**: High

### TC-HINT-003: Hints Addition (Sum with Existing)
- **Description**: Verify new hints are summed with existing
- **Steps**: Update hints to sum of existing + new
- **Expected**: Total hints = existing + new
- **Priority**: High

### TC-HINT-004: Hints Deduction (Usage)
- **Description**: Verify hints are deducted when used
- **Steps**: POST /api/user/update-hints with reduced hints
- **Expected**: 200 OK, hints correctly deducted
- **Priority**: High

### TC-HINT-005: Hints Zero Boundary
- **Description**: Verify zero hints are handled correctly
- **Steps**: POST /api/user/update-hints with hints=0
- **Expected**: 200 OK, hints=0
- **Priority**: Medium

### TC-HINT-006: Large Hints Count
- **Description**: Verify large hint counts are handled
- **Steps**: POST /api/user/update-hints with very large number
- **Expected**: 200 OK, large number accepted
- **Priority**: Low

### TC-HINT-007: Hints Data Persistence
- **Description**: Verify hints persist in database
- **Steps**: Update hints, then GET /api/user/{username}
- **Expected**: Hints value matches what was set
- **Priority**: High

### TC-HINT-008: Hints Authorization Check
- **Description**: Verify users cannot update other users' hints
- **Steps**: POST /api/user/update-hints for another user
- **Expected**: 403 Forbidden
- **Priority**: Critical

---

## 11. Level Progression Tests

### TC-LEVEL-001: Easy Level Progression
- **Description**: Verify Easy level progression tracking
- **Steps**: POST /api/user/update-level-passed with difficulty='Easy'
- **Expected**: 200 OK, levelPassedEasy updated
- **Priority**: High

### TC-LEVEL-002: Medium Level Progression
- **Description**: Verify Medium level progression tracking
- **Steps**: POST /api/user/update-level-passed with difficulty='Medium'
- **Expected**: 200 OK, levelPassedMedium updated
- **Priority**: High

### TC-LEVEL-003: Hard Level Progression
- **Description**: Verify Hard level progression tracking
- **Steps**: POST /api/user/update-level-passed with difficulty='Hard'
- **Expected**: 200 OK, levelPassedHard updated
- **Priority**: High

### TC-LEVEL-004: Sequential Level Progression
- **Description**: Verify sequential level progression (1 to 5)
- **Steps**: Update level passed from 1 to 5 sequentially
- **Expected**: Each level progression recorded correctly
- **Priority**: High

### TC-LEVEL-005: Invalid Difficulty
- **Description**: Verify invalid difficulty is rejected
- **Steps**: POST /api/user/update-level-passed with invalid difficulty
- **Expected**: 400 Bad Request
- **Priority**: Medium

### TC-LEVEL-006: Level Progression Authorization
- **Description**: Verify users cannot update other users' level progress
- **Steps**: POST /api/user/update-level-passed for another user
- **Expected**: 403 Forbidden
- **Priority**: Critical

### TC-LEVEL-007: Maximum Level Progression
- **Description**: Verify level 100 progression is handled
- **Steps**: POST /api/user/update-level-passed with levelPassed=100
- **Expected**: 200 OK, level 100 recorded
- **Priority**: Medium

### TC-LEVEL-008: Level Progression Data Integrity
- **Description**: Verify all difficulty levels are tracked correctly
- **Steps**: GET /api/user/{username} and verify all level fields
- **Expected**: All difficulty levels present and valid
- **Priority**: High

---

## 12. Payment Security Tests

### TC-PAYSEC-001: Payment Amount Manipulation
- **Description**: Verify negative amounts are rejected
- **Steps**: POST /api/purchase-history with negative amount
- **Expected**: 400 Bad Request or validation error
- **Priority**: High

### TC-PAYSEC-002: Payment Authorization Bypass
- **Description**: Verify users cannot create purchases for others
- **Steps**: POST /api/purchase-history with different username
- **Expected**: 403 Forbidden
- **Priority**: Critical

### TC-PAYSEC-003: Payment History Access Control
- **Description**: Verify users cannot view other users' payment history
- **Steps**: GET /api/purchase-history/{otherUser}
- **Expected**: 403 Forbidden
- **Priority**: Critical

### TC-PAYSEC-004: Payment Injection Attack
- **Description**: Verify XSS payloads in payment fields are handled
- **Steps**: POST /api/purchase-history with XSS payload in pack field
- **Expected**: Safely handled or sanitized
- **Priority**: Critical

### TC-PAYSEC-005: Payment SQL Injection
- **Description**: Verify SQL injection in payment fields is prevented
- **Steps**: POST /api/purchase-history with SQL injection payload
- **Expected**: Safely handled
- **Priority**: Critical

### TC-PAYSEC-006: Payment Amount Overflow
- **Description**: Verify extremely large amounts are handled
- **Steps**: POST /api/purchase-history with very large amount
- **Expected**: Validation or accepted (document behavior)
- **Priority**: Medium

### TC-PAYSEC-007: Payment Race Condition
- **Description**: Verify concurrent payment requests are handled
- **Steps**: Send 5 concurrent purchase requests
- **Expected**: Duplicates prevented
- **Priority**: High

---

## 13. Data Integrity Tests

### TC-DATA-001: User Data Consistency
- **Description**: Verify user data structure is consistent
- **Steps**: GET /api/user/{username} and validate structure
- **Expected**: All required fields present with correct types
- **Priority**: High

### TC-DATA-002: Purchase History Consistency
- **Description**: Verify purchase history structure is consistent
- **Steps**: GET /api/purchase-history/{username} and validate structure
- **Expected**: All purchases have required fields
- **Priority**: High

### TC-DATA-003: Points and Hints Synchronization
- **Description**: Verify points and hints are synchronized correctly
- **Steps**: GET /api/user/{username} and verify both are non-negative
- **Expected**: Both values are valid numbers >= 0
- **Priority**: Medium

### TC-DATA-004: Level Progression Consistency
- **Description**: Verify level progression values are within valid range
- **Steps**: GET /api/user/{username} and verify level counts
- **Expected**: All level counts between 0-100
- **Priority**: Medium

### TC-DATA-005: Purchase ID Uniqueness
- **Description**: Verify all purchase IDs are unique
- **Steps**: GET /api/purchase-history/{username} and check IDs
- **Expected**: No duplicate purchase IDs
- **Priority**: High

---

## Test Execution

### Prerequisites
1. Backend server running on http://localhost:5174
2. MongoDB connection active
3. Node.js 18+ (for fetch API)

### Running Tests
```bash
npm run test
```

### Test Report
After execution, open `tests/test-report.html` in a browser to view the comprehensive test report.

---

## Test Coverage Metrics

- **Total Test Cases**: 100+
- **Functional Tests**: 60+
- **Security Tests**: 15
- **Performance Tests**: 4
- **Edge Cases**: 8
- **Game Functionality Tests**: 10
- **Payment Flow Tests**: 10
- **Hint System Tests**: 8
- **Level Progression Tests**: 8
- **Payment Security Tests**: 7
- **Data Integrity Tests**: 5
- **Non-Functional Tests**: 10+

---

## Notes

- Tests are designed to be non-destructive where possible
- Some tests may require test users to exist
- Security tests verify protection mechanisms
- Performance thresholds may need adjustment based on infrastructure
- Edge cases help identify potential issues in production

---

**Document Version**: 1.0  
**Last Updated**: ${new Date().toISOString()}  
**Prepared By**: SDET (15 Years Experience)

