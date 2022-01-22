import { blogPost } from "./post";
const JSONdb = require('simple-json-db');
const db = new JSONdb('posts.json');
// A post request should not contain an id.
export type PostCreationParams = Pick<blogPost, "email" | "name" | "phoneNumbers">;

export class PostsService {
    public get(id: number, name?: string): blogPost {
        return db.get(id || name);
    }

    public create(userCreationParams: PostCreationParams): blogPost {
        return db.set(Math.floor(Math.random() * 10000), {
            status: "Happy",
            ...userCreationParams,
        });
    }
}