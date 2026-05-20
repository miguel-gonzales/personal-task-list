import { Router } from 'express';
import prisma from '../db.js';
import {v4 as uuidv4 } from 'uuid';
import type { CreateTaskBody } from '../types/task.js'

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

export default router;
