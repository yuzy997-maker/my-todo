import { memo, KeyboardEvent } from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(todo.id);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div
        className="checkbox"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={todo.completed ? '标记为未完成' : '标记为已完成'}
        tabIndex={0}
        onClick={() => onToggle(todo.id)}
        onKeyDown={handleKeyDown}
      />
      <span className="todo-text">{todo.text}</span>
      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="删除待办事项"
      >
        ×
      </button>
    </li>
  );
});
