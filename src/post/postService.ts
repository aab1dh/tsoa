import { blogPost } from "./post";
const JSONdb = require('simple-json-db');
const db = new JSONdb('posts.json');
// A post request should not contain an id.
export type PostCreationParams = Pick<blogPost, "slug" | "status" | "content" | "author">;

export class PostsService {
    public getPosts(slug?: string): blogPost {
        if (!slug) return db.storage;
        return db.get(slug);
    }

    public create(postCreationParams: PostCreationParams): blogPost | boolean {
        if (db.has(postCreationParams.slug)) return false
        const { slug, ...postCreationParamsWoSlug } = postCreationParams;
        db.set(postCreationParams.slug, {
            ...postCreationParamsWoSlug,
        })
        return true;
    }
}