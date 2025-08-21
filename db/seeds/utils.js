// utils.js

/**
 * Convert timestamps to JavaScript Date objects
 * Firestore can store Date directly or Timestamps
 */
export function convertTimestampToDate(articleData) {
  return { ...articleData, created_at: new Date(articleData.created_at) };
}

/**
 * Create a lookup object.
 * Example: createRef([{title: 'A', id: '123'}], 'title', 'id')
 * returns => { 'A': '123' }
 */
export function createRef(array, key, value) {
  return array.reduce((acc, item) => {
    acc[item[key]] = item[value];
    return acc;
  }, {});
}

/**
 * Format comments by replacing their 'belongs_to' (article title)
 * with the corresponding Firestore article ID.
 * 
 * Original commentData likely had: { body, belongs_to: 'Article Title', created_by, votes, created_at }
 * But Firestore needs: { body, author, article_id, votes, created_at }
 */
export function formatComments(commentData, articleIdLookup) {
  return commentData.map((comment) => {
    return {
      body: comment.body,
      author: comment.created_by || comment.author, // unify naming
      article_id: articleIdLookup[comment.belongs_to] || comment.article_id,
      votes: comment.votes || 0,
      created_at: new Date(comment.created_at),
    };
  });
}