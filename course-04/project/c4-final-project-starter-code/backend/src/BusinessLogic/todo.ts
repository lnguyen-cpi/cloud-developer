
import { CreateTodoRequest } from '../requests//CreateTodoRequest';
import { TodoItem } from '../models/TodoItem';
import * as uuid from 'uuid';
import { todoAccess } from  '../DataLayer/todoAccess';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';

const toDoAccess = new todoAccess();

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string) : Promise<TodoItem> {

    const uniqueID = uuid.v4();
    const todoItem = {
      todoId: uniqueID,
      createdAt: new Date().getTime().toString(),
      done: false,
      userId: userId,
      ...createTodoRequest
    }

    return toDoAccess.createToDo(todoItem);
}

export async function deleteTodo(todoId: string, userId: string) : Promise<String> {
    return toDoAccess.deleteTodo(todoId, userId);
}

export async function getTodos(userId: string) : Promise<TodoItem[]> {
    return toDoAccess.getTodos(userId);
}

export async function getPreSingedUrl(todoId: string): Promise<String> {
    return toDoAccess.getPreSignedUrl(todoId);
}

export async function updateTodoItem(updatedTodo: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
    return toDoAccess.updateTodo(updatedTodo, todoId, userId);
}