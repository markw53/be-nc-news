# Northcoders News API

This API mimics the functions of a social news feed. It has the functionality to access and manipulate articles, comments, topics and users.

This API is built with Node.js and Express. The data is stored in PostgreSQL. It is hosted on Render and can be accessed at: https://marks-nc-news-server.onrender.com/

## Installation

### Requirements

This project requires: Node.js (v20. or above) and PostgreSQL (v17.0 or above).

### Setup enrivonment variables

After cloning the repo you will need to add two .env files at the root level for your project: .env.test and .env.development. In env.test, add PGDATABASE=<database_name_here_test> and in .env.development add PGDATABASE=<database_name_here>

These will automatically be ignored in the .gitignore file.

### Instructions

to setup and test this project:

    1. Clone the repository and cd into the directory
    
    2. Run mpn install to install the project and developer dependencies

    3. To run the app, use: npm start. The default port is 9090.

    4. To test the app, use: npm test

--- 

# Usage
---

## Endpoints index

    1. GET /api/topics
    2. GET /api/articles
    3. GET /api/articles/:article_id
    4. GET /api/articles/:article_id/comments
    5. PATCH /api/articles/:article_id
    6. POST /api/articles/:article_id/comments
    7. GET /api/users
    8. DELETE /api/comments/:comment_id


### 1. GET /api/topics

#### Description

Responds with an array of topic objects with slug and description properties

#### Status

200 - OK

#### Response body

Responds with JSON-encoded object with with property topics, whose value is an array of topic objects. Example:

```
{
  "topics": [
    { "slug": "mitch", "description": "The man, the Mitch, the legend" },
    { "slug": "cats", "description": "Not dogs" },
    { "slug": "paper", "description": "what books are made of" }
  ]
}
```

### 2. GET /api/articles

#### Description

Responds with an array of article objects, default sorted by created_at in descending order.

#### Status

200 - OK

#### Query Params

sort_by - String - sorts the array of article objects by a valid property

order - String - [ASC / DESC] - orders the article objects in either ascending or descending order

topic - String - filters the article objects by a valid topic

#### Response body

Responds with JSON-encoded object with with property articles, whose value is the requested articles objects. Example:

```
{
  "articles": [
    {
      "article_id": 3,
      "title": "Eight pug gifs that remind me of mitch",
      "topic": "mitch",
      "author": "icellusedkars",
      "body": "some gifs",
      "created_at": "2020-11-03T09:12:00.000Z",
      "votes": 0,
      "comment_count": 2
    },
    // more user objects
  ]
}
```

### 3. GET /api/articles/:article_id

#### Description

Responds with a JSON article object with author, title, article_id, body, topic, created_at, and votes details.

#### Status

200 - OK

#### Response body

Responds with JSON-encoded object with with property article, whose value is the requested article object. Example:

```
{
  "article": {
    "article_id": 1,
    "title": "Living in the shadow of a great man",
    "topic": "mitch",
    "author": "butter_bridge",
    "body": "I find this existence challenging",
    "created_at": "2020-07-09T20:11:00.000Z",
    "votes": 100,
    "comment_count": 11
  }
}
```

#### 4. GET /api/articles/:article_id/comments

### Description

Responds with an array of comment objects for the specified article.

note: if an article has no comments, the array will be empty

#### Status

200 - OK

#### Response body

Responds with JSON-encoded object with with property comments, whose value is an array of comment objects for the specified article. Example:

```
{
  "comments": [
    {
      "comment_id": 10,
      "body": "git push origin master",
      "article_id": 3,
      "author": "icellusedkars",
      "votes": 0,
      "created_at": "2020-06-20T07:24:00.000Z"
    },
    {
      "comment_id": 11,
      "body": "Ambidextrous marsupial",
      "article_id": 3,
      "author": "icellusedkars",
      "votes": 0,
      "created_at": "2020-09-19T23:10:00.000Z"
    }
  ]
}
```

### 5. PATCH /api/articles/:article_id

#### Description

Updates the specified article's votes by an incremenent passed in the request body. The updated article object is returned.

#### Status

200 - OK

#### Request body

The request body should be a JSON object with a key inc_votes and value of an integer to increment. To decrement the votes, use a negative number.

Example:

```
{
  "inc_votes": 50
}
Response body
Responds with JSON-encoded object with with property updatedArticle, whose value is the updated article object. Example:

{
  "updatedArticle": {
    "article_id": 1,
    "author": "butter_bridge",
    "body": "I find this existence challenging",
    "created_at": "2020-07-09T20:11:00.000Z",
    "title": "Living in the shadow of a great man",
    "topic": "mitch",
    "votes": 150
  }
}
```

### 6. POST /api/articles/:article_id/comments

#### Description

Adds comment to specified article. Will respond with the newly created comment object.

#### Status

201 - Created

#### Request body

The request body should be a JSON object with a keys username and body and values of an existing username and the body of the comment, respectively.

Example:

```
{
  "username": "rogersop",
  "body": "what a wonderful test"
}
```

#### Response body

Responds with JSON-encoded object with with property addedComment, whose value is the newly created comment object.

Example:

```
{
  "addedComment": {
    "comment_id": 19,
    "body": "what a wonderful test",
    "article_id": 2,
    "author": "rogersop",
    "votes": 0,
    "created_at": "2022-05-18T11:46:52.339Z"
  }
}
```

### 7. GET /api/users

#### Description

Responds with an array of username objects

#### Status

200 - OK

Response body
Responds with JSON-encoded object with with property users, whose value is an array of username objects.

Example:

```
{
  "users": [
    { "username": "butter_bridge" },
    { "username": "icellusedkars" },
    { "username": "rogersop" },
    { "username": "lurker" }
  ]
}
```

### 8. DELETE /api/comments/:comment_id

#### Description

Deletes the comment by specified comment id

#### Status

204 - No content

## Acknowledgements

Just want to say a big thank you to Northcoders for providing the resources for this project as well as to Scarlett, Linda, Jay and Ray for their code reviews and feedback!

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
