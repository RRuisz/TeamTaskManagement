import {IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";



export class UserCreateDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string
}

export class userUpdateDto {
    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    password?: string

    @IsOptional()
    @IsString()
    firstName?: string

    @IsOptional()
    @IsString()
    lastName?: string
}

export class UserResponseDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
}