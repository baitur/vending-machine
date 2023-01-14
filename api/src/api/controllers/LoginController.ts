import { Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { LoginService } from '@api/services/LoginService';
import { LoginRequest } from '@api/Interfaces/LoginRequest';

@Service()
@OpenAPI({
  tags: ['Auth'],
})
@JsonController('/login')
export class LoginController {
  public constructor(private loginService: LoginService) {
  }

  @Post()
  public async login(@Body() user: LoginRequest) {
    return await this.loginService.login(user);
  }
}
