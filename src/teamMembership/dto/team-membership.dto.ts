import {IsEmail, IsNotEmpty} from "class-validator";
import {IsTeamRole} from "../../team/decorator/is-team-role.decorator";
import {TeamRole} from "@prisma/client";

export class TeamJoinUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsTeamRole()
    role: string;
}

export class UserRoleUpdateDto {
    @IsNotEmpty()
    @IsTeamRole()
    role: TeamRole;
}