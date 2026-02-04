interface FooterProps {
  activeCount: number;
  onClearCompleted: () => void;
}

export function Footer({ activeCount, onClearCompleted }: FooterProps) {
  return (
    <div className="footer">
      <span>{activeCount} 项待办</span>
      <button className="clear-completed" onClick={onClearCompleted}>
        清除已完成
      </button>
    </div>
  );
}
