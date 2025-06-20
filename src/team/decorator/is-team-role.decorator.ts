import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";
import {TeamRole} from "@prisma/client";


export function IsTeamRole(ValidationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isTeamRole",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: ValidationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return Object.values(TeamRole).includes(value)
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid team role (${Object.values(TeamRole).join(', ')})`;
                },
            }
        })
    }
}