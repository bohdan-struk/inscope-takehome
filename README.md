# Overview

In this assignment you will build an interactive bank administrator interface, where a clerk can find information about the bank's clients and their accounts. The clerk can also inquire on eligibility for new loans on behalf of a client by hitting an underwriting service with the required information.


# Instructions
1. Fork this repository and create a new branch for your development work
1. Create your implementation following the [Specification](#specification) below
1. Add instructions on how to run your implementation to the [Getting Started](#getting-started) section.
1. In the [follow-up questions](#follow-up-questions) section below, respond inline to each of the questions.
1. Commit your implementation and answers to your fork and give us access to the repo.

**Guidelines:**
- Do not spend longer than two hours on your implementation, a perfect implementation is not required or expected. Please move on to the [follow-up questions](#follow-up-questions) after that.
- You may use any libraries or frameworks of your choosing (e.g. React, Svelte, etc.)
- The visual design of the components is not super important. Feel free to use an existing component framework (e.g. Material Design, Bootstrap, etc.) or design your own.


# Specification

You will build the following functionality:
  - [ ] Load clients from the provided endpoint (See [Exercise Data](#exercise-data))
  - [ ] Display the clients in a 3 column grid, showing their name and the date they opened their account.
  - [ ] A client's balance is calculated as the sum of all transactions since their last statement, plus their starting balance.
  - [ ] When a user clicks on a client, toggle a visual "selected" state to indicate it has been selected, and show their current balance.
  - [ ] When the "Check loan eligibility" button is pressed, send a POST request with the selected client's information to the underwriting service (See [Underwriting Service](#underwriting))
  - [ ] If the client is eligible for a loan, display a message indicating the loan amounts and rates available.
  - [ ] If the client is not eligible, display a message indicating they were declined.

![UI](img/bank-ui.jpg)

## Exercise Data

The client list can be loaded by making an HTTP request to the following URL:
- `https://inscope-takehome-service.onrender.com/clients`

Notice that this server runs on a free-tier Render account, so it might be slow to wake up on your first request.


The JSON response is structured as follows:
```js
{
  "count": 1,                     // the number of items in the collection
  "next": "",                     // the url to follow for the next page
  "previous": "",                 // the url to follow for the previous page
  "results": [                    // a list of Client objects
    {"id": "",                    // the unique identifier for this client
     "first_name": "",            // the client's first name
     "last_name": "",             // the client's last name
     "client_since": "",          // timestamp the client joined the bank
     "previous_period_balance": 1 // the client's last balance, in cents
     },
     ...
    ]
}

````


The client transactions since the last statement can be loaded by making an HTTP request to the following URL:

- `https://inscope-takehome-service.onrender.com/clients/<client_id>/transactions`

The JSON response is structured as follows:

```js
{
  "count": 1,         // the number of items in the collection
  "next": "",         // the url to follow for the next page
  "previous": "",     // the url to follow for the previous page
  "results": [        // a list of Client objects
    {"id": "",        // the unique identifier for this transaction
     "detail": "",    // a note about the transaction's origin
     "amount": "",    // the transaction amount, in cents
     "timestamp": "", // timestamp when the transaction occurred
     },
     ...
    ]
}
```

## Underwriting

A server-side underwriting service is available at the following url:
`https://inscope-takehome-service.onrender.com/underwrite`


To check a client's eligibility, create a POST request where the body contains a JSON object with the keys:

- `current_balance` with the balance in cents calculated above
- `num_transactions` with the number of transactions in the current period
- `client_since`, with a date formatted `YYYY/MM/DD`

For example, a client with a balance of $123.45, with 3 in-period transactions who joined the bank on December 1st 2021 we'd send a request as defined in the JSON object below:

**Request Body**
```js
{
  "current_balance": 12345,
  "previous_period_balance": 6789,
  "num_transactions": 3,
  "client_since": "2021/12/01"
}
```

**Response**
```js
{
  "eligible": true,  // boolean indicating eligibility for this client
  "amount": 50000,   // loan amount, in cents, in this case quivalent to $500.00
  "bp_rate": 325     // annual rate percentage in basis points, in this case equivalent to 3.25%
  "reason": null
}
```

# Getting Started

## Build Setup

``` bash
# pull changes from repository
git pull

# checkout to "development" branch
git checkout development 

# install dependencies
npm install

# run application on Local: http://127.0.0.1:3000/
npm run dev
```

# Follow-Up Questions

  1. Describe which task you found most difficult in the implementation, and why.
    - Overall, the task was fairly easy and quick to implement, I've spent around 2 hours on coding and added a few features for better usability. The main goal for me was to grasp how backend works in regards to the calculations I did on front end.
  2. What lead you to choose these libraries or frameworks you used in your implementation?
    - As it is a small project I decided to use Vue + Vite + Tailwind. Vue allows to implement the project in fast way, and Vite provides fast development experience for web projects. Tailwind css library is very simple and can reduce time spent for styling by at least 3 times.
  3. If there were no time restrictions for this exercise, what improvements would you make in the following areas:
      - Implementation
      - User Experience
      - Accessibility
     
      I would use more technologies to make project even faster and more structured. I would add caching and lazy-loading which can improve the project speed. I added pagination and sorting in the project, which improved UX significantly. One additional thing that I would improve is user design and responsiveness. 
  4. If you were asked to refactor this exercise so it could be display historical data, what changes would you make?
    - I would create a separate component/page for client description where I could implement historic data related to each client and would use LocalStorage to store that data. I would also discuss with the backend team the possibility of creating API endpoints and data validation. My response would heavily depend on the type of historical data provided: balances, transactions, eligibility, etc. 
  5. Assume you are provided with a unique identifier for loan application submitted by the clerks. You are tasked with storing requests in persistent storage so bank managers can track patterns in loan applications. Give a high level overview of how you would implement this feature.

This would require to divide tasks among backend and frontend: 

For backend, I would begin by designing a structured model for loan applications. I would consult with developers to select the more suitable database to fit the loan application data.
Then, I would focus on creating all necessary API endpoints such as: incoming submissions (POST), application data for tracking (GET), and specific loan details (GET by ID). Since we are working with sensitive data I would also consider various security and encryption mechanisms. 
  
  
For the frontend, I'd start by creating an intuitive user interface (admin portal) that allows clerks to submit loan applications. I would develop the application submission form. 
I would then focus on communication with the backend by embedding front-end code to handle API calls—facilitating the sending and retrieval of loan application data. This data could then be effectively displayed to the user. Additionally, I'd consider implementing data visualizations to present patterns within the applications based on selected variables.
From UX perspective, I would also implement real-time feedback to provide clerks immediately with status and errors of their submission. 
Lastly, I would recommend to optimize the performance and loading times of UI components and assets.
   
   
# Evaluation Criteria

You will be evaluated out of a total of 50 points based on the following criteria.

  - Learning Exercise (30 points total)
    - **Functionality (20 points)**: is the requested functionality implemented as described without bugs?
    - **Code Quality (10 points)**: is the code well structured and easily read? is the code optimized for performance?
    - **Bonus (3 maximum)**: bonus points are awarded for anything that goes above and beyond the items in the specification.  For example, a responsive implementation, or improvements for accessibility.
  - Follow Up Questions (20 points total)
    - Question 1 (2 points)
    - Question 2 (3 points)
    - Question 3 (5 points)
    - Question 4 (5 points)
    - Question 5 (5 points)
