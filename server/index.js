import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'my-todo-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// 验证 JWT 中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: '无效的认证令牌' });
  }
}

// 注册
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: '请输入有效的邮箱地址' });
  }

  // 验证密码长度
  if (!password || password.length < 6) {
    return res.status(400).json({ error: '密码不能少于6位' });
  }

  try {
    // 检查邮箱是否已存在
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户
    const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);

    res.status(201).json({ message: '注册成功', userId: result.lastInsertRowid });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登录
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '请输入邮箱和密码' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取当前用户信息
app.get('/api/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json({ user });
});

// 获取用户的所有待办事项
app.get('/api/todos', authenticateToken, (req, res) => {
  const todos = db.prepare('SELECT id, text, completed FROM todos WHERE user_id = ? ORDER BY created_at ASC').all(req.user.id);
  res.json({ todos: todos.map(t => ({ ...t, completed: Boolean(t.completed) })) });
});

// 创建待办事项
app.post('/api/todos', authenticateToken, (req, res) => {
  const { id, text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: '待办内容不能为空' });
  }

  const todoId = id || crypto.randomUUID();
  db.prepare('INSERT INTO todos (id, user_id, text, completed) VALUES (?, ?, ?, 0)').run(todoId, req.user.id, text.trim());

  res.status(201).json({ todo: { id: todoId, text: text.trim(), completed: false } });
});

// 更新待办事项
app.patch('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const todo = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!todo) {
    return res.status(404).json({ error: '待办事项不存在' });
  }

  if (typeof completed === 'boolean') {
    db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  }

  res.json({ todo: { id, text: todo.text, completed: typeof completed === 'boolean' ? completed : Boolean(todo.completed) } });
});

// 删除待办事项
app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const todo = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!todo) {
    return res.status(404).json({ error: '待办事项不存在' });
  }

  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.json({ message: '删除成功' });
});

// 清除已完成的待办事项
app.delete('/api/todos', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM todos WHERE user_id = ? AND completed = 1').run(req.user.id);
  res.json({ message: '清除成功' });
});

// 获取系统运营统计数据
app.get('/api/stats', authenticateToken, (req, res) => {
  const stats = db.prepare(`
    SELECT
      u.email,
      COUNT(t.id) as total_todos,
      SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) as completed_todos
    FROM users u
    LEFT JOIN todos t ON u.id = t.user_id
    GROUP BY u.id
    ORDER BY u.email
  `).all();
  res.json({ stats });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
