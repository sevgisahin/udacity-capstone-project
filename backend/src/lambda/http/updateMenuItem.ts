import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { UpdateMenuItemRequest } from '../../requests/UpdateMenuItemRequest'
import { MenuItemsAccess } from '../../dataLayer/menuItemsAccess'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const logger = createLogger('menuItems')
const menuItemsAccess = new MenuItemsAccess()
const apiResponseHelper = new ApiResponseHelper()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const menuItemId = event.pathParameters.menuItemId
    const updatedMenuItem: UpdateMenuItemRequest = JSON.parse(event.body)
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
  
    const item = await menuItemsAccess.getMenuItemById(menuItemId)
  
    if(item.Count == 0){
        logger.error(`user ${userId} requesting update for non exists menuItem with id ${menuItemId}`)
        return apiResponseHelper.generateErrorResponse(400,'MenuItem not exists')
    } 

    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting update menuItem does not belong to his account with id ${menuItemId}`)
        return apiResponseHelper.generateErrorResponse(400,'MenuItem does not belong to authorized user')
    }

    logger.info(`User ${userId} updating group ${menuItemId} to be ${updatedMenuItem}`)
    await new MenuItemsAccess().updateMenuItem(updatedMenuItem, menuItemId)
    return apiResponseHelper.generateEmptySuccessResponse(204)
  
}
