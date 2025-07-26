import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserProvider = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Якщо передано поле: @User('email') → вернемо тільки email
    return data ? user?.[data] : user;
  },
);
