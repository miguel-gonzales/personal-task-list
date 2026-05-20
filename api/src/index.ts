import express from 'express';
import taskRoutes from './routes/tasks.js';

const app = express();
app.use(express.json());

app.use('/tasks', taskRoutes);

app.get('/test', (req, res) => {
  res.json({status: 'ok'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Taskminator API running on http://localhost:${PORT}`)
});
