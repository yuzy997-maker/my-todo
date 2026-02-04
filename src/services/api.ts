import { LoginData, RegisterData, AuthResponse, User } from '../types/auth';
import { Todo } from '../types/todo';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || '请求失败');
  }

  return data;
}

export async function register(data: RegisterData): Promise<{ message: string; userId: number }> {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<{ user: User }> {
  return request('/me');
}

// Todos API
export async function getTodos(): Promise<{ todos: Todo[] }> {
  return request('/todos');
}

export async function createTodo(id: string, text: string): Promise<{ todo: Todo }> {
  return request('/todos', {
    method: 'POST',
    body: JSON.stringify({ id, text }),
  });
}

export async function updateTodo(id: string, completed: boolean): Promise<{ todo: Todo }> {
  return request(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  });
}

export async function deleteTodo(id: string): Promise<{ message: string }> {
  return request(`/todos/${id}`, {
    method: 'DELETE',
  });
}

export async function clearCompletedTodos(): Promise<{ message: string }> {
  return request('/todos', {
    method: 'DELETE',
  });
}

// Stats API
export interface UserStats {
  email: string;
  total_todos: number;
  completed_todos: number;
}

export async function getStats(): Promise<{ stats: UserStats[] }> {
  return request('/stats');
}
