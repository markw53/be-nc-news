const request = require('supertest');
const app = require('../app');
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

describe.only("GET /api/articles/:articles_id", () => {
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