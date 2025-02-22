import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { getUserId } from '../utils'


import {createTodo}  from '../../BusinessLogic/todo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const userId = getUserId(event);
  const todoItem = await createTodo(newTodo, userId);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(todoItem)
  }
}
