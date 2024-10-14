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
