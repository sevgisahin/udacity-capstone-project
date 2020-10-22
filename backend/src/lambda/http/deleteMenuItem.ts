import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { MenuItemsAccess } from '../../dataLayer/menuItemsAccess'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const menuItemsAccess = new MenuItemsAccess()
const apiResponseHelper = new ApiResponseHelper()
const logger = createLogger('menuItems')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const menuItemId = event.pathParameters.menuItemId
    if(!menuItemId){
        logger.error('invalid delete attempt without menuItem id')
        return apiResponseHelper.generateErrorResponse(400,'invalid parameters')
    }
 
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)

    const item = await menuItemsAccess.getMenuItemById(menuItemId)
    if(item.Count == 0){
        logger.error(`user ${userId} requesting delete for non exists menuItem with id ${menuItemId}`)
        return apiResponseHelper.generateErrorResponse(400,'MenuItem not exists')
    }

    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting delete menuItem does not belong to his account with id ${menuItemId}`)
        return apiResponseHelper.generateErrorResponse(400,'MenuItem does not belong to authorized user')
    }

    logger.info(`User ${userId} deleting menuItem ${menuItemId}`)
    await menuItemsAccess.deleteMenuItemById(menuItemId)
    return apiResponseHelper.generateEmptySuccessResponse(204)

  
}
