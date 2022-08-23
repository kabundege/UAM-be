# Description

API documentation for UAM main API


## Installation

> Run
-  Yarn or npm install
-  touch .env

```env

DB_URL = XXXXXXXXXXXXXXXXX
MONGO_USERNAME = XXXXXXXXX
MONGO_PASSWORD = XXXXXXXXX
MONGO_URL =  XXXXXXXXXXXXX
JWT_SECRET = XXXXXXXXXXXXX
EMAIL = XXXXXXXXXXXXXXXXXX
PASSWORD = XXXXXXXXXXXXXXX

```

## Quick find

### SignUp

- [User Sign In ](#1)

### Signin

- [user Sign Up](#2)

### Reset

- [User Password Mutation](#3)

### Forgot

- [User Account Validation](#4)

### Verification

- [Account Verification](#6)

### Token Authentication

- [Token](#7)

### Document Validation

- [User Docs Validation](#8)

## Endpoints


### 1. Sign Up ~ ( POST Request )

Endpoint

```text
/signup
```

Body:
```json
    "profilePhoto": "https://picsum.photos/200/300",
    "name": "Christopher Kwizera",
    "email": "christophekwizera@gmail.com",
    "password": "zxcvbnm",
    "gender": "Male",
    "age": "60",
    "national_id": "1234567890987654",
    "phoneNumber": "07812345678",
    "document": "https://picsum.photos/200/300",
    "dateOfBirth": "1962-01-01",
    "maritalStatus": "SINGLE",
    "nationality": "Rwandan"
```

Response:

```json
{
  "statusCode": 201,
  "message": "Signup successfully!",
  "data": { 
    "token":"bckejfhoaslkcnrvnksdbzxv...etc"
    }
}
```

### 2. Sign In ~ ( POST Request )

Endpoint

```text
/signin
```

Body:
```json
    "email": "christophekwizera@gmail.com",
    "password": "zxcvbnm"
```

Response:

```json
{
  "statusCode": 200,
  "message": "Signin successfully!",
  "data": { 
    "token":"bckejfhoaslkcnrvnksdbzxv...etc"
    }
}
```


### 3. Reset Password 

Endpoint

```text
/reset-password
```

Headers:
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNocmlzdG9waGVrd2l6ZXJhQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiMDc4NDgyNDI5NSIsImlhdCI6MTY2MDQ5OTI0MH0.u41lfhFl4VNU2Uz-SuMFjK-GWNbdeH8dkS1mhbsrwPI
```

Body:
```json
    "password": "zxcvbnm"
```

Response:

```json
{
  "statusCode": 200,
  "message": "Password reset successfully!"
}
```


### 3. Forgot Password ~ ( POST Request )

Endpoint

```text
/forgot-password
```

Headers:
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
```

Body:
```json
"email": "text@email.com"
```

Response:

```json
{
  "statusCode": 200,
  "message": "Email sent successfully!"
}
```


### 4. Verify user account ~ ( POST Request ) 

Endpoint

```text
/verify-account
```

Headers:
```
Accept: application/json
Content-Type: application/json
```

Body:
```json
"code": "264196"
```

Response:

```json
{
  "statusCode": 200,
  "message": "Account Validated Successfully!"
}
```


### 5. Verify a token ~ ( GET Request )

Endpoint

```text
/verify-token/:token
```

Headers:
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
```

Response:

```json
{
  "statusCode": 200,
  "message": "Account Validated Successfully!"
}
```


### 6. Verify a User's Documents  ~ ( GET Request )

Endpoint

```text
/validate-user/:id
```

Headers:
```
Accept: application/json
Content-Type: application/json
```

Response:

```json
{
  "statusCode": 200,
  "message": "Account Validated Successfully!"
}
```
