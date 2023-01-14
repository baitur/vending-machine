import { Service } from 'typedi';
import { UserRole } from '@api/models/User';
import { AuthUserControlLevel } from '@api/middlewares/AuthUserControlLevel';

/**
 * The service that checks if user is logged and has `Buyer` UserRole
 */
@Service()
export class BuyerControlLevel extends AuthUserControlLevel {
  role = UserRole.BUYER;
}
