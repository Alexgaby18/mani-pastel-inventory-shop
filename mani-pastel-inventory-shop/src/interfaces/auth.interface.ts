export interface Auth{
    name: string;
    email: string;
    password: string;
}

export type LoginAuth = Omit<Auth, 'name'>;