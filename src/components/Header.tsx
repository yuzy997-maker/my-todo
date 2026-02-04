interface HeaderProps {
  date: string;
}

export function Header({ date }: HeaderProps) {
  return (
    <div className="header">
      <h1>待办事项</h1>
      <p>{date}</p>
    </div>
  );
}
