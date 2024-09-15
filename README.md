[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G03

### Note: 
- You can choose to develop individual microservices within separate folders within this repository **OR** use individual repositories (all public) for each microservice. 
- In the latter scenario, you should enable sub-modules on this GitHub classroom repository to manage the development/deployment **AND** add your mentor to the individual repositories as a collaborator. 
- The teaching team should be given access to the repositories as we may require viewing the history of the repository in case of any disputes or disagreements.

# Question Service User Guide

## Get All Questions
This endpoint allows the retrieval of all the questions in the database.

- **HTTP Method**: `GET`
- **Endpoint**: `/questions`

### Responses:

| Response Code | Explanation                                         |
|---------------|-----------------------------------------------------|
| 200 (OK)      | Success, all questions are returned                 |
| 500 (Internal Server Error) | Unexpected error in the database or server |

**Example of Response Body for Success**:  
TBC

## Get Question by ID
This endpoint allows the retrieval of the question by using the question ID.

- **HTTP Method**: `GET`
- **Endpoint**: `/questions/{questionId}`

### Parameters:

- Required: `questionId` path parameter

### Responses:

| Response Code | Explanation                                         |
|---------------|-----------------------------------------------------|
| 200 (OK)      | Success, question corresponding to the questionID is returned |
| 404 (Not Found) | Question with the specified questionID not found   |
| 500 (Internal Server Error) | Unexpected error in the database or server |

**Example of Response Body for Success**:  
TBC

## Get Question by Parameters
This endpoint allows the retrieval of a random question that matches the parameters provided.

- **HTTP Method**: `GET`
- **Endpoint**: `/questions/search`

### Parameters:

- `limit` - The number of questions to be returned (Required)
- `topics` - The topic of the question (Required)
- `languages` - The language of the question (Required)
- `difficulty` - The difficulty of question (Required)

### Responses:

| Response Code | Explanation                                         |
|---------------|-----------------------------------------------------|
| 200 (OK)      | Success, question corresponding to the limit, topics, languages and difficulty is returned |
| 400 (Bad Request) | Missing fields                                  |
| 404 (Not Found) | Question with the specified parameter(s) not found |
| 500 (Internal Server Error) | Unexpected error in the database or server |

**Example of Response Body for Success**:  
TBC

## Get Topics
This endpoint retrieves all unique topics in the database (e.g. “Sorting”, “OOP”, “DFS”, etc…)

- **HTTP Method**: `GET`
- **Endpoint**: `/questions/topics`

### Headers:

- Required: -

### Responses:

| Response Code | Explanation                                         |
|---------------|-----------------------------------------------------|
| 200 (OK)      | Success, all topics are returned                    |
| 500 (Internal Server Error) | The server encountered an error and could not complete the request |

**Example of Response Body for Success**:  
TBC

## Get Language
This endpoint retrieves all unique languages in the database (e.g, Java, C++, C, etc..)

- **HTTP Method**: `GET`
- **Endpoint**: `/questions/languages`

### Headers:

- Required: -

### Responses:

| Response Code | Explanation                                         |
|---------------|-----------------------------------------------------|
| 200 (OK)      | Success, all languages are returned                 |
| 500 (Internal Server Error) | The server encountered an error and could not complete the request |

**Example of Response Body for Success**:  
TBC
