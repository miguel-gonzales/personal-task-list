export interface CreateTaskBody {
  id?: string;
  title: string;
}

export interface UpdateTaskBody {
  title?: string;
  status?: 'todo' | 'done';
}