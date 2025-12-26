import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    nickname: string;

    @IsString()
    @IsOptional()
    region?: string;
}
