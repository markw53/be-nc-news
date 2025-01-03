const request = require('supertest');
const app = require('../app');
require('jest-sorted');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const endpoints = require('../endpoints.json');
const topics = require('../db/data/test-data/topics');

beforeEach(() => { return seed(testData); });

afterAll(() => { db.end(); });

describe('GET /api/topics', () => {
    it('200: responds with an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then (({ body }) => {
            expect(topics).toBeInstanceOf(Array);
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        description: expect.any(String),
                        slug: expect.any(String),
                    })
                );
            });
        });
    });
    it('404: responds with not found if given wrong path', () => {
        return request(app)
        .get('/api/topixs')
        .expect(404)
        .then (({ body }) => {
            const { msg } = body;
            expect(msg).toBe('Not Found');
        });
    });
});

describe("GET /api/articles/:articles_id", () => {
    it("200: responds with article object", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            const { article } = body;
            expect(article.article_id).toBe(1);
            expect(article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                comment_count: "11"
            });
        });
    });
    it("400: responds with bad request if given no article_id", () => {
        return request(app)
            .get("/api/articles/article5")
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe('Invalid input syntax');
        });
    });
    it("404:  responds with not found for non-existent article_id", () => {
        return request(app)
            .get("/api/articles/99999999")
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("no article found for article_id 99999999");
        });
    });
});

describe("GET /api/articles", () => {
    it("200: should respond with array sorted by article_id, order default order is descending", () => {
    return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("article_id", { descending: true });
        });
    });
    it("200: responds with array ordered by ascending when order=ASC", () => {
    return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });
    it("400: stops invalid sort_by queries and responds with bad request", () => {
    return request(app)
        .get("/api/articles?sort_by=quantity")
        .expect(400)
        .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid sort_by query");
        });
    });
    it("400: stops invalid order queries and responds with bad request", () => {
    return request(app)
        .get("/api/articles?order=rupaul")
        .expect(400)
        .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid order query");
        });
    });
    it("400: stops invalid filter types and responds with bad request", () => {
        return request(app)
        .get("/api/articles?positive=10")
        .expect(400)
        .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
        });
    });
    it("200: responds with an array of article objects", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
        expect(articles).toBeInstanceOf(Array);
            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String) || expect.any(Number),
                        article_img_url: expect.any(String),
                    })
                );
            });
        });
    });
    it("404: responds with not found if given wrong path", () => {
        return request(app)
        .get("/api/barnacles")
        .expect(404)
        .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not Found");
        });
    });
    it("200: responds with an array of articles filtered by topic", () => {
        return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeInstanceOf(Array);
                articles.forEach(article => {
                expect(article.topic).toBe("mitch");
            });
        });
    });    
    it("404: responds with not found for invalid topic", () => {
        return request(app)
            .get("/api/articles?topic=invalidtopic")
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("not found");
            });
    });
    
});

describe("POST /api/articles/:article_id/comments", () => {
    it("201: request body is accepted and responds with the posted comment object", () => {
        const newComment = {
            username: 'icellusedkars',
            body: "you are not good at writing news articles",
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
            const { comment } = body;
            expect(comment).toMatchObject(
                expect.objectContaining({
                article_id: 1,
                author: 'icellusedkars',
                body: "you are not good at writing news articles",
                comment_id: 19,
                created_at: expect.any(String),
                votes: 0,
                })
            );
        });
    });
    it("400: incorrect username responds with bad request ", () => {
            const newComment = {
                username: "pumpkin",
                body: "laura ate some dollar pizza",
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    const { msg } = body;
                    expect(msg).toBe("bad request");
            });
        });
    it("400: malformed body / missing required fields, responds with bad request ", () => {
        const newComment = {};
        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
        });
    });
    it("404: invalid article_id, responds with bad request ", () => {
        const newComment = {};
        return request(app)
        .post("/api/articles/9999999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("article not found");
        });
    });
    it("404: invalid body type, responds with bad request ", () => {
        const newComment = {
        username: "icellusedkars",
        body: 420,
        };
        return request(app)
        .post("/api/articles/9999999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("article not found");
        });
    });
});

describe("PATCH /api/artices/:articled_id", () => {
    it("201: request body is accepted and responds with updated article, positive increment vote", () => {
        const updatedArticle1 = {
        inc_votes: 1,
        };
        return request(app)
            .patch("/api/articles/1")
            .send(updatedArticle1)
            .expect(201)
            .then(({ body }) => {
            const { article } = body;
            expect(article).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                created_at: expect.any(String),
                votes: 101,
            });
        });
    });
    it("201: request body is accepted and responds with updated article, negative increment vote", () => {
        const updatedArticle2 = {
        inc_votes: -100,
        };
        return request(app)
            .patch("/api/articles/1")
            .send(updatedArticle2)
            .expect(201)
            .then(({ body }) => {
            const { article } = body;
            expect(article).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                created_at: expect.any(String),
                votes: 0,
            });
        });
    });
    it("400: incorrect type, responds with bad request ", () => {
        const updatedArticle1 = {
        inc_votes: "string",
        };
        return request(app)
            .patch("/api/articles/1")
            .send(updatedArticle1)
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
        });
    });
    it("400: malformed body / missing required fields, responds with bad request ", () => {
        const updatedArticle1 = {};
        return request(app)
            .patch("/api/articles/1")
            .send(updatedArticle1)
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
        });
    });
});

describe("DELETE /api/comments/:comment_id", () => {
    it("status: 204, responds with an empty body", () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(({ body }) => {
            expect(body).toEqual({});
        });
    });
    it("404: resource does not exist, responds with not found", () => {
        return request(app)
            .delete("/api/comments/999999")
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("no comment found for comment_id 999999");
        });
    });
    it("400: invalid comment_id, responds with bad request ", () => {
        return request(app)
            .delete("/api/comments/id_no_8")
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request");
        });
    });
});

describe("GET /api/users", () => {
    it("200: responds with an array of user objects", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
            const { users } = body;
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(4);
                users.forEach((user) => {
                    expect(user).toEqual(
                    expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
                })
            );
        });
    });
});
    it("404: responds with not found if given wrong path", () => {
        return request(app)
        .get("/api/losers")
        .expect(404)
        .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not Found");
        });
    });
});

describe('GET /api/users/:username', () => {
    it('200: responds with a user object when given a valid username', () => {
        return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body }) => {
                expect(body.user).toMatchObject({
                    username: 'lurker',                    
                    name: 'do_nothing',
                    avatar_url: expect.any(String),
                });
            });
    });

    it('404: responds with a not found message when the username does not exist', () => {
        return request(app)
            .get('/api/users/nonexistent_user')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('User not found');
            });
    });

    it('404: responds with a not found message when username is invalid format', () => {
        return request(app)
            .get('/api/users/123')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('User not found');
            });
    });
});

describe('PATCH /api/comments/:comment_id', () => {
    it('200: updates the votes and responds with the updated comment', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch('/api/comments/1')
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    comment_id: 1,
                    votes: expect.any(Number),
                });
            });
    });

    it('400: responds with an error when inc_votes is not a number', () => {
        const invalidVote = { inc_votes: 'one' };
        return request(app)
            .patch('/api/comments/1')
            .send(invalidVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid input syntax');
            });
    });

    it('404: responds with an error when comment_id does not exist', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch('/api/comments/9999')
            .send(newVote)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment not found');
            });
    });
});

describe('POST /api/articles', () => {
    it('201: responds with the newly created article', () => {
        const newArticle = {
            author: 'icellusedkars',
            title: 'How to write tests',
            body: 'Writing tests is important',
            topic: 'paper',
            article_img_url: 'https://example.com/image.jpg'
        };
        return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    author: 'icellusedkars',
                    title: 'How to write tests',
                    body: 'Writing tests is important',
                    topic: 'paper',
                    article_img_url: 'https://example.com/image.jpg',
                    votes: 0,
                    comment_count: '0',
                    created_at: expect.any(String)
                });
            });
    });

    it('400: responds with an error when required fields are missing', () => {
        const newArticle = {
            title: 'Missing author',
        };
        return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Null value not allowed');
            });
    });

    it('400: responds with error when non-existent author is given', () => {
        const newArticle = {
            author: 'unknown_author',
            title: 'Test',
            body: 'Test body',
            topic: 'coding'
        };
        return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Foreign key violation');
            });
    });
});

describe('POST /api/topics', () => {
    it('201: successfully adds a new topic and responds with the newly created topic', () => {
        const newTopic = {
            slug: 'coding',
            description: 'All things coding related'
        };

        return request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(201)
            .then(({ body }) => {
                expect(body.topic).toMatchObject({
                    slug: 'coding',
                    description: 'All things coding related'
                });
            });
    });

    it('400: responds with an error when required fields are missing', () => {
        const incompleteTopic = {
            slug: 'coding'
        };

        return request(app)
            .post('/api/topics')
            .send(incompleteTopic)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request: Missing required fields "slug" and/or "description"');
            });
    });
});

describe('DELETE /api/articles/:article_id', () => {

it('400: responds with an error for Invalid article_id', () => {
    return request(app)
        .delete('/api/articles/9999')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid article_id');
        });
});
it('400: responds with an error for invalid input syntax', () => {
    return request(app)
        .delete('/api/articles/notAnId')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid input syntax');
        });
    });
});

describe('/api/articles pagination', () => {
    it('GET: 200 - responds with 10 articles by default and total_count', async () => {
        const { body } = await request(app)
            .get('/api/articles')
            .expect(200);
        expect(body.articles.length).toBe(10);
        expect(body.total_count).toBeGreaterThan(10); 
        body.articles.forEach((article) => {
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                author: expect.any(String),
                topic: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String), 
            });
        });
    });
    it('GET: 200 - responds with a limited number of articles when passed a limit query', async () => {
        const { body } = await request(app)
            .get('/api/articles?limit=5')
            .expect(200);

        expect(body.articles.length).toBe(5);
        expect(body.total_count).toBeGreaterThan(5);
    });
    it('GET: 200 - responds with articles for the specified page', async () => {
        const { body } = await request(app)
            .get('/api/articles?limit=5&p=2') 
            .expect(200);

        expect(body.articles.length).toBe(5);
        expect(body.total_count).toBeGreaterThan(5);
    });
    it('GET: 200 - paginates articles filtered by topic', async () => {
        const { body } = await request(app)
            .get('/api/articles?topic=mitch&limit=5')
            .expect(200);

        expect(body.articles.length).toBe(5);
        expect(body.total_count).toBeGreaterThan(5); 
        body.articles.forEach((article) => {
            expect(article.topic).toBe('mitch');
        });
    });
    it('GET: 400 - responds with an error if limit is not a number', async () => {
        const { body } = await request(app)
            .get('/api/articles?limit=invalid')
            .expect(400);

        expect(body.msg).toBe('Invalid input syntax');
    });
    it('GET: 200 - responds with empty articles array if page exceeds total articles count', async () => {
        const { body } = await request(app)
            .get('/api/articles?limit=5&p=100') 
            .expect(200);

        expect(body.articles.length).toBe(0);
        expect(body.total_count).toBeGreaterThan(0);
    });
    it('GET: 200 - paginates and sorts articles by a valid field', async () => {
        const { body } = await request(app)
            .get('/api/articles?limit=5&p=1&sort_by=votes&order=asc')
            .expect(200);

        expect(body.articles.length).toBe(5);
        expect(body.articles).toBeSortedBy('votes', { ascending: true });
        expect(body.total_count).toBeGreaterThan(5);
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    it('200: responds with an array of comments for a valid article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments).toHaveLength(10); 
            body.comments.forEach((comment) => {
            expect(comment).toEqual(
                expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: 1,
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String)
                })
            );
            });
        });
    });
    it('200: responds with a limited number of comments when limit is provided', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments).toHaveLength(5); 
        });
    });
    it('200: responds with comments on a specific page when p (page) is provided', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=5&p=2')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments).toHaveLength(5); 
        });
    });
    it('200: responds with fewer comments than the limit when not enough comments exist', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=50')
        .expect(200)
        .then(({ body }) => {
        expect(body.comments.length).toBeLessThanOrEqual(50);
        });
    });    
    it('400: responds with "bad request" for invalid article_id', () => {
        return request(app)
        .get('/api/articles/not-a-number/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('bad request');
        });
    });
    it('404: responds with "no comments found for article_id X" for non-existent article_id', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('no comments found for article_id 9999');
        });
    });
    it('400: responds with "bad request" for invalid limit', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=invalid')
        .expect(400)
        .then(({ body }) => {
        expect(body.msg).toBe('invalid limit or page number');
        });
    });
    it('400: responds with "bad request" for invalid page number', () => {
        return request(app)
        .get('/api/articles/1/comments?p=invalid')
        .expect(400)
        .then(({ body }) => {
        expect(body.msg).toBe('invalid limit or page number');
        });
    });
    it('404: responds with "no comments found for article_id X" when article exists but no comments found', () => {
        return request(app)
        .get('/api/articles/2/comments') 
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toBe('no comments found for article_id 2');
        });
    });
    it('200: responds with fewer comments than the limit when not enough comments exist', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=50')
        .expect(200)
        .then(({ body }) => {
        expect(body.comments.length).toBeLessThanOrEqual(50);
        });
    });
});  
