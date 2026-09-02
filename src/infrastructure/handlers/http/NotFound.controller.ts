import ControllerBuilder from "../../../shared/utils/controllerBuilder"
import NotFoundException from "../../../shared/exceptions/NotFound.exception"

const NotFoundController = ControllerBuilder(() => {
    throw new NotFoundException("Not Found")
})

export default NotFoundController
