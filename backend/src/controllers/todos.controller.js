import Todo from '../models/Todo.js';

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({ where: { userId: req.user.id } });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({
      title,
      description,
      userId: req.user.id
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todo = await Todo.findOne({ where: { id, userId: req.user.id } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    if (completed !== undefined) {
      todo.completed = completed;
    }

    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({ where: { id, userId: req.user.id } });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};