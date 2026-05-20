import { Router } from 'express';
import prisma from '../db.js';
import {v4 as uuidv4 } from 'uuid';
import type { CreateTaskBody, UpdateTaskBody } from '../types/task.js'

const router = Router();

router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: {deleted_at: null},
    orderBy: {created_at: 'asc'}
  });

  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { id, title } = req.body as CreateTaskBody;

  if (!title || title.trim() === '') {
    res.status(400).json({ error: 'Title is required'});
    return;
  }

  if (title.length > 280) {
    res.status(400).json({ error: 'Title must be less than 280 characters'});
    return;
  }

  const task = await prisma.task.create({
    data: {
      id: id ?? uuidv4(),
      title: title.trim(),
    }
  });

  res.status(201).json(task)
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params as UpdateTaskBody;
  const { title, status } = req.body as UpdateTaskBody;
  const existingTask = await prisma.task.findFirst({
    where: { id, deleted_at: null }
  });

  if (!title && !status) {
    res.status(400).json({ error: 'At least one field must be provided'});
    return;
  }

  if ( title !== undefined && title.trim() === '' ) {
    res.status(400).json({ error: 'Title cannot be empty' });
    return;
  } 

  if ( status !== undefined && ['todo', 'done'].includes(status) ) {
    res.status(400).json({ error: 'Status must be either "todo" or "done"' });
    return;
  }

  if (!existingTask) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { 
      ...(title && { title:title.trim() }), 
      ...(status && { status }) 
    }
  });

  res.json(updatedTask)
})

export default router;
