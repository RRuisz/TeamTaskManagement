import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {IsTeamRole} from "../decorator/is-team-role.decorator";


export class TeamCreateDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
