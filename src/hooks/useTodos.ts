import { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, FilterType } from '../types/todo';
import * as api from '../services/api';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTodos()
      .then(({ todos }) => setTodos(todos))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addTodo = useCallback((text: string) => {
    if (text.trim()) {
      const id = crypto.randomUUID();
      const newTodo = { id, text: text.trim(), completed: false };
      setTodos(prev => [...prev, newTodo]);
      api.createTodo(id, text.trim()).catch(console.error);
    }
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => {
      const todo = prev.find(t => t.id === id);
      if (!todo) return prev;
      const newCompleted = !todo.completed;
      api.updateTodo(id, newCompleted).catch(console.error);
      return prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t);
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    api.deleteTodo(id).catch(console.error);
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
    api.clearCompletedTodos().catch(console.error);
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const activeCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    activeCount,
    loading,
  };
}
