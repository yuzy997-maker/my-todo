import { useMemo } from 'react';
import { useTodos } from '../hooks/useTodos';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { TodoInput } from '../components/TodoInput';
import { FilterBar } from '../components/FilterBar';
import { TodoList } from '../components/TodoList';
import { Footer } from '../components/Footer';

export function TodoPage() {
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    activeCount,
  } = useTodos();

  const { user, logout } = useAuth();

  const date = useMemo(() => {
    return new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }, []);

  return (
    <div className="container">
      <Header date={date} />
      <div className="user-bar">
        <span>{user?.email}</span>
        <button onClick={logout} className="logout-btn">退出登录</button>
      </div>
      <TodoInput onAdd={addTodo} />
      <FilterBar filter={filter} onFilterChange={setFilter} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <Footer activeCount={activeCount} onClearCompleted={clearCompleted} />
    </div>
  );
}
