
import { TodoItem } from '../models/TodoItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from "aws-sdk";
import {Types} from 'aws-sdk/clients/s3';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';

export class todoAccess {

    constructor( 
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly S3Bucket = process.env.S3_BUCKET_NAME,
        private readonly s3Client: Types = new AWS.S3({signatureVersion: 'v4'}) ) {}
    

        async createToDo(todoItem: TodoItem): Promise<TodoItem> {

            const params = {
                TableName: this.todoTable,
                Item: todoItem
            };

            await this.docClient.put(params).promise()

            return todoItem as TodoItem;
        }


        async deleteTodo(todoId: String, userId: String): Promise<String> {

            const params = {
                TableName: this.todoTable,
                Key: {
                    "userId": userId,
                    "todoId": todoId
                },
            }; 
            await this.docClient.delete(params).promise();

            return "Deleted" as String;
        }


        async getTodos(userId: String): Promise<TodoItem[]> {

            const params = {
                TableName: this.todoTable,
                KeyConditionExpression: "#userId = :userId",
                ExpressionAttributeNames: {
                    "#userId": "userId"
                },
                ExpressionAttributeValues: {
                    ":userId": userId
                }
            };
    
            const result = await this.docClient.query(params).promise();
            const items = result.Items;
    
            return items as TodoItem[]
        }


        async getPreSignedUrl(todoId: String): Promise<String> {

            const url = this.s3Client.getSignedUrl('putObject', {
                Bucket: this.S3Bucket,
                Key: todoId,
                Expires: 1000,
            });

            return url as String;
        }

        async updateTodo(updatedTodo: UpdateTodoRequest, todoId: String, userId: String) : Promise<TodoUpdate> {

            const params = {
                TableName: this.todoTable,
                Key: {
                    "userId": userId,
                    "todoId": todoId
                },
                UpdateExpression: "set #a = :a, #b = :b, #c = :c",
                ExpressionAttributeNames: {
                    "#a": "name",
                    "#b": "dueDate",
                    "#c": "done"
                },
                ExpressionAttributeValues: {
                    ":a": updatedTodo['name'],
                    ":b": updatedTodo['dueDate'],
                    ":c": updatedTodo['done']
                },
                ReturnValues: "ALL_NEW"
            };
    
            const result = await this.docClient.update(params).promise();
            const attributes = result.Attributes;
    
            return attributes as TodoUpdate;
        }

}