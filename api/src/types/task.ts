export interface CreateTaskBody {
  id?: string;
  title: string;
}

export interface UpdateTaskBody {
  id: string;
  title?: string;
  status?: 'todo' | 'done';
}