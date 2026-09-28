
# Student CRUD REST API

A simple REST API built using Node.js and Express.js
to perform Create, Read, Update, and Delete operations
on student records.

## Technologies Used

- Node.js
- Express.js
- JavaScript
- Postman

## Features

- Add new students
- View all students
- View student by ID
- Update student details
- Delete student records
- Basic input validation
- Error handling

## Installation

Clone the repository:

git clone YOUR_GITHUB_REPOSITORY_URL

Install dependencies:

npm install

Start the server:

npm start

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Welcome message |
| GET | /students | Get all students |
| GET | /students/:id | Get student by ID |
| POST | /students | Add student |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |

## Example Student Data

{
  "name": "Sireesha",
  "age": 19,
  "department": "CSE"
}

## Testing

All API endpoints can be tested using Postman.

## Note

This beginner project stores records in memory.
Data resets when the server restarts.