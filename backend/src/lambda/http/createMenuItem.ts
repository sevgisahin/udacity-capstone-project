import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateMenuItemRequest } from '../../requests/createmenuItemRequest'
import { getUserId} from '../../helpers/authHelper'
import { MenuItemsAccess } from '../../dataLayer/menuItemsAccess'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const logger = createLogger('menuItems')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const newMenuItem: CreateMenuItemRequest = JSON.parse(event.body)

    
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    logger.info(`create group for user ${userId} with data ${newMenuItem}`)
    const item = await new MenuItemsAccess().createMenuItem(newMenuItem,userId)
    
    return new ApiResponseHelper().generateDataSuccessResponse(201,'item',item)

}
