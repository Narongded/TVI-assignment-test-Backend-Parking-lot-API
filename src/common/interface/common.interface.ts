export interface IAppConfig {
  port: number;
  name: string;
  version: string;
}

export interface IAppCls {
  ipAddress: string;
  user: IPayloadUser;
}

export interface IJwtConfig {
  secret: string;
  signOptions: {
    expiresIn: string;
  };
  global: boolean;
}
export interface ITicketConfig {
  ticketSecret: string;
}

export interface IPayloadUser {
  email: string;
  sub: number;
  iat: number;
  exp: number;
}

export interface IDatabaseConfig {
  type: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  logger: string;
  logging: 'query' | 'error' | 'warn' | 'info' | 'log' | boolean;
  entities: [];
  synchronize: boolean;
  ssl: boolean;
  schema: string;
}
