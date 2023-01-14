import { Service } from 'typedi';
import { UserRole } from '@api/models/User';
import { AuthUserControlLevel } from '@api/middlewares/AuthUserControlLevel';

/**
 * The service that checks if user is logged and has `Admin` UserRole.
 */
@Service()
export class AdminControlLevel extends AuthUserControlLevel {
  role = UserRole.ADMIN;
}
