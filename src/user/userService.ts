import { User } from "./user";
const JSONdb = require('simple-json-db');
const db = new JSONdb('users.json');
// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

export class UsersService {
    public get(id?: number, name?: string): User {
        if (!id) return db.storage;
        return db.get(id);
    }

    public create(userCreationParams: UserCreationParams): User {
        return db.set(Math.floor(Math.random() * 10000), {
            status: "Happy",
            ...userCreationParams,
        });
    }
}