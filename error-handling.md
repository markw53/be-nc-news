# Possible Errors

This guide details some of the errors that may occur in your app. For each route, consider what could go wrong, and ensure that your code properly handles these cases by responding with appropriate HTTP status codes.

---

## Relevant HTTP Status Codes

- **200 OK**: Request successful, data sent back.
- **201 Created**: Resource successfully created.
- **204 No Content**: Request successful, no data sent back.
- **400 Bad Request**: Invalid input or request format.
- **404 Not Found**: Resource not found.
- **405 Method Not Allowed**: HTTP method is not allowed for the endpoint.
- **418 I'm a teapot**: Fun error code for testing.
- **422 Unprocessable Entity**: Valid request, but unable to process (e.g., semantic errors).
- **500 Internal Server Error**: Unexpected server error.

---

## Unavailable Routes

### GET `/not-a-route`

- **Status**: 404
- **Reason**: Requesting a non-existent route.
- **Test case**: Should respond with a 404 and a message like `"Route not found"`.

---

## Available Routes

### GET `/api/articles/:article_id`

- **Bad `article_id` (e.g., `/dog`)**
  - **Status**: 400
  - **Reason**: Invalid `article_id` that cannot be parsed as a number.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

- **Well-formed `article_id` that doesn't exist (e.g., `/999999`)**
  - **Status**: 404
  - **Reason**: The article does not exist in the database.
  - **Test case**: Should return a 404 status with the message `"article not found"`.

### PATCH `/api/articles/:article_id`

- **Bad `article_id` (e.g., `/dog`)**
  - **Status**: 400
  - **Reason**: Invalid `article_id`.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

- **Well-formed `article_id` that doesn't exist (e.g., `/999999`)**
  - **Status**: 404
  - **Reason**: Article does not exist.
  - **Test case**: Should return a 404 status with the message `"article not found"`.

- **Invalid `inc_votes` (e.g., `{ inc_votes: "cat" }`)**
  - **Status**: 400
  - **Reason**: `inc_votes` is not a valid number.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

### POST `/api/articles/:article_id/comments`

- **Bad `article_id` (e.g., `/dog`)**
  - **Status**: 400
  - **Reason**: Invalid `article_id`.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

- **Well-formed `article_id` that doesn't exist (e.g., `/999999`)**
  - **Status**: 404
  - **Reason**: Article does not exist.
  - **Test case**: Should return a 404 status with the message `"article not found"`.

- **Missing or invalid comment body/author (e.g., no `username` or `body`)**
  - **Status**: 400
  - **Reason**: Missing required fields for posting a comment.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

### GET `/api/articles/:article_id/comments`

- **Bad `article_id` (e.g., `/dog`)**
  - **Status**: 400
  - **Reason**: Invalid `article_id`.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

- **Well-formed `article_id` that doesn't exist (e.g., `/999999`)**
  - **Status**: 404
  - **Reason**: No comments found for the article.
  - **Test case**: Should return a 404 status with the message `"no comments found for article_id 999999"`.

- **Limit or pagination query parameters (`limit` or `p`) that are invalid (e.g., non-numeric)**
  - **Status**: 400
  - **Reason**: Invalid query parameter values.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

### GET `/api/articles`

- **Bad queries:**
  - **Invalid `sort_by` (e.g., non-existent column)**
    - **Status**: 400
    - **Reason**: Invalid column name for sorting.
    - **Test case**: Should return a 400 status with the message `"bad request"`.

  - **Invalid `order` (e.g., not "asc" or "desc")**
    - **Status**: 400
    - **Reason**: Invalid order value.
    - **Test case**: Should return a 400 status with the message `"bad request"`.

  - **Non-existent `topic`**
    - **Status**: 404
    - **Reason**: Topic does not exist in the database.
    - **Test case**: Should return a 404 status with the message `"topic not found"`.

  - **Existing `topic` with no articles**
    - **Status**: 404
    - **Reason**: No articles found for the topic.
    - **Test case**: Should return a 404 status with the message `"no articles found for topic"`.

### PATCH `/api/comments/:comment_id`

- **Bad `comment_id` (e.g., `/dog`)**
  - **Status**: 400
  - **Reason**: Invalid `comment_id`.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

- **Well-formed `comment_id` that doesn't exist (e.g., `/999999`)**
  - **Status**: 404
  - **Reason**: Comment does not exist.
  - **Test case**: Should return a 404 status with the message `"comment not found"`.

- **Invalid `inc_votes` (e.g., `{ inc_votes: "cat" }`)**
  - **Status**: 400
  - **Reason**: `inc_votes` is not a valid number.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

### DELETE `/api/comments/:comment_id`

- **Bad `comment_id` (e.g., `/dog`)**
  - **Status**: 400
  - **Reason**: Invalid `comment_id`.
  - **Test case**: Should return a 400 status with the message `"bad request"`.

- **Well-formed `comment_id` that doesn't exist (e.g., `/999999`)**
  - **Status**: 404
  - **Reason**: Comment does not exist.
  - **Test case**: Should return a 404 status with the message `"comment not found"`. 

---
