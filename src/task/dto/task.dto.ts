import {IsDate, IsNotEmpty, IsOptional, IsString} from "class-validator";
import * as string_decoder from "node:string_decoder";


export class TaskCreateDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}

export class TaskUpdateDto {
    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    status?: string

    @IsOptional()
    @IsDate()
    due_date?: Date

    @IsOptional()
    @IsString()
    assignee_id?: string
}