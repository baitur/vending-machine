import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { OpenAPI } from 'routing-controllers-openapi';
import { AdminControlLevel } from '@api/middlewares/AdminControlLevel';
import { UserService } from '@api/services/UserService';
import { LoggedUser } from '@api/decorators/LoggedUser';
import { UserCreateRequest } from '@api/Interfaces/UserCreateRequest';
import { UserUpdateRequest } from '@api/Interfaces/UserUpdateRequest';
import { AuthUserControlLevel } from '@api/middlewares/AuthUserControlLevel';
import { LoggedUserInterface } from '@api/Interfaces/LoggedUserInterface';
import { AllowAnonUsersControlLevel } from '@api/middlewares/AllowAnonUsersControlLevel';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/users')
export class UserController {
  public constructor(private userService: UserService) {
  }

  @UseBefore(AdminControlLevel)
  @Get()
  public async getAll() {
    return await this.userService.getAll();
  }

  @UseBefore(AdminControlLevel)
  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number) {
    return await this.userService.findOneById(id);
  }

  @UseBefore(AuthUserControlLevel)
  @Get('/me')
  public async getMe(@LoggedUser() loggedUser: LoggedUserInterface) {
    return await this.userService.findOneById(loggedUser.userId);
  }

  @UseBefore(AllowAnonUsersControlLevel)
  @Post()
  @HttpCode(201)
  public async create(@Body() user: UserCreateRequest, @LoggedUser() loggedUser: LoggedUserInterface) {
    return await this.userService.create(user, loggedUser);
  }

  @UseBefore(AdminControlLevel)
  @Put('/:id')
  public async update(@Param('id') id: number, @Body() user: UserUpdateRequest) {
    return await this.userService.updateOneById(id, user);
  }

  @UseBefore(AdminControlLevel)
  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    await this.userService.deleteOneById(id);
    return {};
  }
}

