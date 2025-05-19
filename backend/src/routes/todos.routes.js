import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todos.controller.js';
import { validateTodoInput, handleValidationErrors } from '../utils/validation.js';

const router = Router();

router.use(protect);

router.get('/', getTodos);
router.post(
  '/',
  validateTodoInput,
  handleValidationErrors,
  createTodo
);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;