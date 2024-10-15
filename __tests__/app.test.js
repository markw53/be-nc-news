const request = require('supertest');
const app = require('../app');
require('jest-sorted');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const endpoints = require('../endpoints.json');
const topics = require('../db/data/test-data/topics');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    db.end();
});

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
            expect(msg).toBe('not found');
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
            expect(msg).toBe('bad request');
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
    describe("Queries: sort_by, order and topic filters", () => {
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
        it("200: responds with array ordered by ascending when order=asc", () => {
        return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toBeSortedBy("created_at", { ascending: true });
            });
        });
        it("200: should respond with array of one cat article object when filtered by topic cats", () => {
        return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(1);
            expect(articles[0]).toEqual(
                expect.objectContaining({
                article_id: 5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                body: "Bastet walks amongst us, and the cats are taking arms!",
                comment_count: "2",
                created_at: expect.any(String),
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                votes: 0,
                })
            );
        });
    });
        it("200: for multiple queries, should respond with an array of mitch article objects, sorted by article_id with order ascending", () => {
        return request(app)
            .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeInstanceOf(Array);
            expect(articles).toBeSortedBy("article_id", { ascending: true });
            articles.forEach((article) => expect(article.topic).toBe("mitch"));
            });
        });
        it("400: stops invalid sort_by queries and responds with bad request", () => {
        return request(app)
            .get("/api/articles?sort_by=quantity")
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("bad request: cannot sort by 'quantity'");
            });
        });
        it("400: stops invalid order queries and responds with bad request", () => {
        return request(app)
            .get("/api/articles?order=rupaul")
            .expect(400)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe(
                "bad request: cannot order by 'rupaul', ASC or DESC only"
            );
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
    });
        it("200: responds with an array of article objects", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
            const { articles } = body;
            expect(articles).toHaveLength(13);
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
                    comment_count: expect.any(String),
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
            expect(msg).toBe("not found");
            });
        });
});

describe("GET /api/articles/:article_id/comments", () => {
    it("200: responds with an array of comment objects", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
            const { comments } = body;
            expect(comments).toBeInstanceOf(Array);
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
            expect(comment).toEqual(
                expect.objectContaining({
                article_id: 1,
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                })
            );
        });
        });
    });
    it("400: responds with bad request if given wrong article_id data type", () => {
        return request(app)
            .get("/api/articles/article_5/comments")
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("bad request");
            });
        });
    it("404: responds with invalid filepath if given wrong article_id", () => {
        return request(app)
            .get("/api/articles/99999999/comments")
            .expect(404)
            .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("no comments found for article_id 99999999");
            });
        });
    it("404: responds with not found if given wrong filepath", () => {
        return request(app)
            .get("/api/articles/1/commentttss")
            .expect(404)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("not found");
            });
        });
    });