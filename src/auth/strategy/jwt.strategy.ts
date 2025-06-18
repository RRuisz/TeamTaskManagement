import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    async validate(payload: { sub: number, email: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        if (!user) throw new Error("User not found!")

        const {password_hash, ...result} = user;

        return result;
    }

    constructor(private config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            "secretOrKey": config.get('JWT_SECRET') || ''
        });
    }
}