import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class Credentials {
  @IsString()
  @IsOptional()
  public username?: string;
  @IsString()
  @IsOptional()
  public password?: string;
}

export class Transports {
  @IsString()
  @IsOptional()
  public bosh?: string;
  @IsString()
  @IsOptional()
  public websocket?: string;
}

export class ParticipantsDto {
  @Type(() => Credentials)
  @IsOptional()
  public credentials?: Credentials;
  @Type(() => Transports)
  @IsOptional()
  public transports?: Transports;
  @IsString()
  public room: string;
  @IsString()
  public domain: string;
}
