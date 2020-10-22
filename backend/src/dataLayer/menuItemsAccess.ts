import { MenuItem } from "../models/menuItem";
import { CreateMenuItemRequest } from "../requests/createMenuItemRequest";
import { UpdateMenuItemRequest } from "../requests/updateMenuItemRequest";
const uuid = require('uuid/v4')
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'



export class MenuItemsAccess{
    constructor(
        private readonly XAWS = AWSXRay.captureAWS(AWS),
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly menuItemsTable = process.env.MENU_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    )
        {}

    async getUserMenuItems(userId: string): Promise<MenuItem[]>{
        const result = await this.docClient.query({
            TableName: this.menuItemsTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId':userId
            }
        }).promise()
        return result.Items as MenuItem[]
    }

    async createMenuItem(request: CreateMenuItemRequest,userId: string): Promise<MenuItem>{
        const newId = uuid()
        const item = new MenuItem()
        item.userId= userId
        item.menuItemId= newId
        item.createdAt= new Date().toISOString()
        item.name= request.name
        item.itemType= request.itemType
        item.ingredient= request.ingredient
        item.finished= false
  
        await this.docClient.put({
            TableName: this.menuItemsTable,
            Item: item
        }).promise()

        return item
    }


    async getMenuItemById(id: string): Promise<AWS.DynamoDB.QueryOutput>{
        return await this.docClient.query({
            TableName: this.menuItemsTable,
            KeyConditionExpression: 'menuItemId = :menuItemId',
            ExpressionAttributeValues:{
                ':menuItemId': id
            }
        }).promise()
    }

    async updateMenuItem(updatedMenuItem:UpdateMenuItemRequest,menuItemId:string){
        await this.docClient.update({
            TableName: this.menuItemsTable,
            Key:{
                'menuItemId':menuItemId
            },
            UpdateExpression: 'set #namefield = :n, ingredient = :ingredient, finished = :finished',
            ExpressionAttributeValues: {
                ':n' : updatedMenuItem.name,
                ':ingredient' : updatedMenuItem.ingredient,
                ':finished' : updatedMenuItem.finished
            },
            ExpressionAttributeNames:{
                "#namefield": "name"
              }
          }).promise()
    }

    async deleteMenuItemById(menuItemId: string){
        const param = {
            TableName: this.menuItemsTable,
            Key:{
                "menuItemId":menuItemId
            }
        }
      
         await this.docClient.delete(param).promise()
    }
    
}