import { Service } from 'typedi';
import { UserRole } from '@api/models/User';
import { AuthUserControlLevel } from '@api/middlewares/AuthUserControlLevel';

/**
 * The service that checks if user is logged and has `Seller` UserRole.
 */
@Service()
export class SellerControlLevel extends AuthUserControlLevel {
  role = UserRole.SELLER;
}
