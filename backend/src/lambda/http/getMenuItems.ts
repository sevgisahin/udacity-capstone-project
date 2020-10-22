import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { MenuItemsAccess } from '../../dataLayer/menuItemsAccess'
import { S3Helper } from '../../helpers/s3Helper'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const s3Helper = new S3Helper()
const apiResponseHelper= new ApiResponseHelper()
const logger = createLogger('menuItems')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader) 
    logger.info(`get groups for user ${userId}`)
    const result = await new MenuItemsAccess().getUserMenuItems(userId)
      
    for(const record of result){
        record.attachmentUrl = await s3Helper.getMenuItemAttachmentUrl(record.menuItemId)
    }

    return apiResponseHelper.generateDataSuccessResponse(200,'items',result)
}