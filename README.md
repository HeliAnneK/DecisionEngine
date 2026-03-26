# Decision Engine

A loan decision engine that determines the maximum approvable loan amount for a given applicant. Built with Spring Boot and React.

## How it works

The engine takes a personal code, a requested loan amount, and a loan period, and returns the maximum amount it can approve.

**Scoring algorithm:**
```
credit score = (credit modifier / loan amount) * loan period
```
- If `credit score >= 1` → approved
- If `credit score < 1` → not approved

The maximum approvable amount for a given period is achievable by setting `credit score = 1`:
```
max amount = credit modifier * loan period  (capped at 10 000 €)
```

If no valid amount can be found for the requested period, the engine tries extending the period up to 60 months, returning the shortest extension that has a valid offer.

**Constraints:**

|| Min | Max |
|-|---|---|
| Loan amount | 2 000 € | 10 000 € |
| Loan period | 12 months | 60 months |

## Test personal codes

| Personal code | Profile                   |
|---|---------------------------|
| 49002010965 | Debt - always rejected    |
| 49002010976 | Segment 1 - modifier 100  |
| 49002010987 | Segment 2 - modifier 300  |
| 49002010998 | Segment 3 - modifier 1000 |

## Running the project

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Runs on `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## API

### `POST /api/loan/decision`

**Request:**
```json
{
  "personalCode": "49002010987",
  "loanAmount": 4000,
  "loanPeriod": 24
}
```

**Response:**
```json
{
  "approved": true,
  "approvedAmount": 7200,
  "approvedPeriod": 24
}
```

## Thought process and design decisions
### Stack
First, I decided to use Springboot and React, because I'm most familiar with them.

### Backend
I used the starter boilerplate from start.spring.io, in order to quickly get started
I split backend logic into service, controller and data types, in order to have separation of concerns and so that the code is easier to read.

For request/response objects I decided to use Java records, since they're cleaner than a regular class with getters.

I decided to use a hashmap and set in the service because a database felt unnecessary for 4 hardcoded records.

For the business logic I just followed the requirements of the task.

### Frontend/UI
I decided to use user input for the personal code, since it seemed more realistic to how it would look like in a real application. At first, I used drop down, for ease of switching between 4 cases, however it seemed very odd, since in reality nobody would have a "selection" of codes.

For the loan amount and loan period I used sliders and user input. User input for a precise loan amount/period and the slider for when precision is not as important. Also, the sliders let the user know about the constraints.

## What I would improve
I would replace the hardcoded personal codes and credit modifiers with a database-backed solution. In reality, a person's creditworthiness is determined by multiple factors like payment history, existing debt, income, etc. This way the application could have a `persons` table storing these attributes, and the credit modifier would be calculated from them rather than being a fixed value looked up by personal code. This would also allow the engine to work with any personal code, not just the four hardcoded test cases, which would make the task more interesting.
