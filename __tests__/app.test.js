// __tests__/app.test.js
import request from "supertest";
import app from "../app.js";
import {
  db,
  clearFirestore,
  seedFirestore,
  closeFirestore,
} from "../db/firestoreUtils.js";
import {
  articleData,
  commentData,
  topicData,
  userData,
} from "../db/data/test-data/index.js";

beforeEach(async () => {
  await clearFirestore();
  await seedFirestore({ articleData, commentData, topicData, userData });
});

afterAll(async () => {
  await clearFirestore();
  await closeFirestore();
});

// ------------------- TOPICS -------------------

describe("GET /api/topics", () => {
  it("200: responds with an array of topic objects", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body.topics).toHaveLength(3);
    body.topics.forEach((topic) => {
      expect(topic).toEqual(
        expect.objectContaining({
          description: expect.any(String),
          slug: expect.any(String),
        })
      );
    });
  });

  it("404: responds with not found if given wrong path", async () => {
    const { body } = await request(app).get("/api/topixs").expect(404);
    expect(body.msg).toBe("Not Found");
  });
});

describe("POST /api/topics", () => {
  it("201: creates a topic", async () => {
    const newTopic = { slug: "coding", description: "All about coding" };
    const { body } = await request(app).post("/api/topics").send(newTopic).expect(201);
    expect(body.topic).toMatchObject(newTopic);
  });

  it("400: missing fields", async () => {
    const { body } = await request(app).post("/api/topics").send({}).expect(400);
    expect(body.msg).toBe('Bad Request: Missing required fields "slug" and/or "description"');
  });
});

// ------------------- ARTICLES -------------------

describe("GET /api/articles/:article_id", () => {
  it("200: responds with article object", async () => {
    const { body } = await request(app).get("/api/articles/article-test-1").expect(200);
    expect(body.article).toHaveProperty("article_id");
  });

  it("400: bad request malformed id", async () => {
    const { body } = await request(app).get("/api/articles/@@@").expect(400);
    expect(body.msg).toBe("Invalid input");
  });

  it("404: not found for missing id", async () => {
    const { body } = await request(app).get("/api/articles/not-there").expect(404);
    expect(body.msg).toBe("Article not found");
  });
});

describe("GET /api/articles", () => {
  it("200: default 10 sorted by created_at desc", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles.length).toBeLessThanOrEqual(10);
    expect(body.articles).toBeSortedBy("created_at", { descending: true });
  });

  it("200: limit query limits results", async () => {
    const { body } = await request(app).get("/api/articles?limit=5").expect(200);
    expect(body.articles).toHaveLength(5);
  });

  it("200: page query works", async () => {
    const { body } = await request(app).get("/api/articles?limit=5&p=2").expect(200);
    expect(body.articles).toHaveLength(5);
  });

  it("200: filters by topic", async () => {
    const { body } = await request(app).get("/api/articles?topic=mitch").expect(200);
    body.articles.forEach((a) => expect(a.topic).toBe("mitch"));
  });

  it("404: invalid topic", async () => {
    const { body } = await request(app).get("/api/articles?topic=nope").expect(404);
    expect(body.msg).toBe("Topic not found");
  });

  it("400: invalid limit query", async () => {
    const { body } = await request(app).get("/api/articles?limit=abc").expect(400);
    expect(body.msg).toBe("Invalid input");
  });

  it("400: invalid sort_by query", async () => {
    const { body } = await request(app).get("/api/articles?sort_by=banana").expect(400);
    expect(body.msg).toBe("Invalid sort_by query");
  });

  it("400: invalid order query", async () => {
    const { body } = await request(app).get("/api/articles?order=rubbish").expect(400);
    expect(body.msg).toBe("Invalid order query");
  });
});

describe("POST /api/articles", () => {
  it("201: creates new article", async () => {
    const newArticle = {
      author: "icellusedkars",
      title: "How to test",
      body: "Testing with Firestore",
      topic: "paper",
      article_img_url: "https://example.com/img.png",
    };
    const { body } = await request(app).post("/api/articles").send(newArticle).expect(201);
    expect(body.article).toMatchObject({
      ...newArticle,
      votes: 0,
      comment_count: 0,
      created_at: expect.any(String),
    });
  });

  it("400: missing required fields", async () => {
    const { body } = await request(app).post("/api/articles").send({ title: "Nope" }).expect(400);
    expect(body.msg).toBe("Bad Request: Missing required fields");
  });

  it("400: non-existent author", async () => {
    const { body } = await request(app).post("/api/articles").send({
      author: "ghost",
      title: "X",
      body: "X",
      topic: "paper",
    }).expect(400);
    expect(body.msg).toBe("User not found");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: increments votes up", async () => {
    const { body } = await request(app)
      .patch("/api/articles/article-test-1")
      .send({ inc_votes: 5 })
      .expect(200);
    expect(body.article.votes).toBeGreaterThan(100);
  });

  it("200: decrements votes", async () => {
    const { body } = await request(app)
      .patch("/api/articles/article-test-1")
      .send({ inc_votes: -5 })
      .expect(200);
    expect(body.article.votes).toBeLessThan(100);
  });

  it("400: invalid type for inc_votes", async () => {
    const { body } = await request(app)
      .patch("/api/articles/article-test-1")
      .send({ inc_votes: "abc" })
      .expect(400);
    expect(body.msg).toBe("Invalid input");
  });
});

describe("DELETE /api/articles/:article_id", () => {
  it("204: deletes article", async () => {
    await request(app).delete("/api/articles/article-test-1").expect(204);
  });
  it("404: not found", async () => {
    const { body } = await request(app).delete("/api/articles/not-there").expect(404);
    expect(body.msg).toBe("Article not found");
  });
});

// ------------------- COMMENTS -------------------

describe("GET /api/articles/:article_id/comments", () => {
  it("200: returns comments for an article", async () => {
    const { body } = await request(app).get("/api/articles/article-test-1/comments").expect(200);
    expect(body.comments).toBeInstanceOf(Array);
  });

  it("200: limit works", async () => {
    const { body } = await request(app).get("/api/articles/article-test-1/comments?limit=5").expect(200);
    expect(body.comments.length).toBeLessThanOrEqual(5);
  });

  it("200: pagination works", async () => {
    const { body } = await request(app).get("/api/articles/article-test-1/comments?limit=5&p=2").expect(200);
    expect(body.comments.length).toBeLessThanOrEqual(5);
  });

  it("404: no comments for article", async () => {
    const { body } = await request(app).get("/api/articles/article-test-2/comments").expect(404);
    expect(body.msg).toMatch(/no comments/);
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  it("200: increments comment votes", async () => {
    const { body } = await request(app)
      .patch("/api/comments/comment-test-1")
      .send({ inc_votes: 2 })
      .expect(200);
    expect(body.comment.votes).toBeGreaterThan(16);
  });

  it("400: invalid inc_votes", async () => {
    const { body } = await request(app)
      .patch("/api/comments/comment-test-1")
      .send({ inc_votes: "abc" })
      .expect(400);
    expect(body.msg).toBe("Invalid input");
  });

  it("404: non-existent comment id", async () => {
    const { body } = await request(app)
      .patch("/api/comments/notthere")
      .send({ inc_votes: 1 })
      .expect(404);
    expect(body.msg).toBe("Comment not found");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("204: deletes comment", async () => {
    await request(app).delete("/api/comments/comment-test-1").expect(204);
  });

  it("404: not found", async () => {
    const { body } = await request(app).delete("/api/comments/notthere").expect(404);
    expect(body.msg).toBe("Comment not found");
  });

  it("400: malformed id", async () => {
    const { body } = await request(app).delete("/api/comments/@@@").expect(400);
    expect(body.msg).toBe("Invalid input");
  });
});

// ------------------- USERS -------------------

describe("GET /api/users", () => {
  it("200: responds with all users", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body.users.length).toBeGreaterThan(0);
  });
});

describe("GET /api/users/:username", () => {
  it("200: returns user object by username", async () => {
    const { body } = await request(app).get("/api/users/lurker").expect(200);
    expect(body.user.username).toBe("lurker");
  });

  it("404: user not found", async () => {
    const { body } = await request(app).get("/api/users/ghost").expect(404);
    expect(body.msg).toBe("User not found");
  });
});