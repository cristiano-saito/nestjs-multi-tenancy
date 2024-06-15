import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from './user.roles';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public listUsers() {
    return this.prismaService.user.findMany();
  }

  public listOneUser(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  public findOne(idOrEmail: number | string) {
    return this.prismaService.user.findFirst({
      where: {
        ...(typeof idOrEmail === 'number'
          ? { id: Number(idOrEmail) }
          : { email: idOrEmail }),
      },
    });
  }

  public async createPartnerUser(data: CreateUserDto) {
    const encriptedPass = this.encriptPassword(data.password);
    data.password = encriptedPass;
    return await this.prismaService.user.create({
      data: {
        ...data,
        roles: [UserRoles.PARTNER],
      },
    });
  }

  public async createCommonUser(data: CreateUserDto) {
    const encriptedPass = this.encriptPassword(data.password);
    data.password = encriptedPass;
    return await this.prismaService.user.create({
      data: {
        ...data,
        roles: [UserRoles.USER],
      },
    });
  }

  public async removeUser(id: number) {
    return await this.prismaService.user.delete({
      where: {
        id: Number(id),
      },
    });
  }

  private encriptPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }
}
