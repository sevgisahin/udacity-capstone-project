import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { S3Helper } from '../../helpers/s3Helper';
import { ApiResponseHelper } from '../../helpers/apiResponseHelper';
import { MenuItemsAccess } from '../../dataLayer/menuItemsAccess'
import { getUserId} from '../../helpers/authHelper'
import { createLogger } from '../../utils/logger'

const menuItemsAccess = new MenuItemsAccess()
const apiResponseHelper = new ApiResponseHelper()
const logger = createLogger('menuItems')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const menuItemId = event.pathParameters.menuItemId
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
 
    const item = await menuItemsAccess.getMenuItemById(menuItemId)
    if(item.Count == 0){
        logger.error(`user ${userId} requesting put url for non exists todo with id ${menuItemId}`)
        return apiResponseHelper.generateErrorResponse(400,'MenuItem not exists')
    }

    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting put url menuItem does not belong to his account with id ${menuItemId}`)
        return apiResponseHelper.generateErrorResponse(400,'MenuItem does not belong to authorized user')
    }
    
    const url = new S3Helper().getPresignedUrl(menuItemId)
    return apiResponseHelper
            .generateDataSuccessResponse(200,"uploadUrl",url)
}
