import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app.js';

describe('Tasks API', () => {
  describe('GET /tasks', () => {
    it('returns an empty list when there are no tasks', async () => {
      const res = await request(app).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns only non-deleted tasks', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Active task' });

      const deleted = await request(app)
        .post('/tasks')
        .send({ title: 'Deleted task' });

      await request(app).delete(`/tasks/${deleted.body.id}`);

      const res = await request(app).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(created.body.id);
    });
  });

  describe('POST /tasks', () => {
    it('creates a task', async () => {
      const res = await request(app).post('/tasks').send({ title: '  Buy milk  ' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Buy milk');
      expect(res.body.status).toBe('todo');
      expect(res.body.id).toBeDefined();
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app).post('/tasks').send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title is required');
    });

    it('returns 400 when title exceeds 280 characters', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'a'.repeat(281) });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title must be less than 280 characters');
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('updates title and status', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Original' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}`)
        .send({ title: 'Updated', status: 'done' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
      expect(res.body.status).toBe('done');
    });

    it('returns 400 when no fields are provided', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Task' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('At least one field must be provided');
    });

    it('returns 400 for an invalid status', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Task' });

      const res = await request(app)
        .patch(`/tasks/${created.body.id}`)
        .send({ status: 'invalid' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Status must be either "todo" or "done"');
    });

    it('returns 404 when the task does not exist', async () => {
      const res = await request(app)
        .patch('/tasks/00000000-0000-0000-0000-000000000000')
        .send({ status: 'done' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('soft-deletes a task', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'To delete' });

      const res = await request(app).delete(`/tasks/${created.body.id}`);

      expect(res.status).toBe(204);

      const list = await request(app).get('/tasks');
      expect(list.body).toEqual([]);
    });

    it('returns 404 when the task does not exist', async () => {
      const res = await request(app).delete(
        '/tasks/00000000-0000-0000-0000-000000000000'
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });
  });
});
