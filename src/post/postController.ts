// src/users/usersController.ts
import * as express from "express";
import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    Request,
    Response,
    SuccessResponse
} from "tsoa";
import { blogPost } from "./post";
import { PostsService, PostCreationParams } from "./postService";
import axios from "axios";
const redis = require("redis");

interface ValidateErrorJSON {
    message: "Validation failed";
    details: { [name: string]: unknown };
}

interface CannotCreateErrorJSON {
    message: "See Other";
    details: { [name: string]: unknown };
}

interface NotFoundErrorJSON {
    message: "Post not found";
    details: { [name: string]: unknown };
}

const redisPort = 6379
const client = redis.createClient(redisPort);
(async function () { await client.connect() })()
//log error to the console if any occurs
client.on("error", (err: any) => {
    console.log(err);
});


@Route("posts")
export class PostsController extends Controller {
    @Response<NotFoundErrorJSON>(404, "Post not found")
    @Get("")
    public async getPosts(
    ) {
        console.log('Worker pid:', process.pid);
        return new PostsService().getPosts();

    }


    @Response<NotFoundErrorJSON>(404, "Post not found")
    @Get("{postSlug}")
    public async getPost(
        @Path() postSlug: string
    ) {
        console.log('Worker pid:', process.pid);
        return new PostsService().getPosts(postSlug);
    }

    @Response<NotFoundErrorJSON>(404, "Post not found")
    @Get("/test/{n}")
    public async test(
        @Path() n: number
    ) {
        console.log('Worker pid:', process.pid);

        let count = 0;

        if (n > 5000000000) n = 5000000000;

        for (let i = 0; i <= n; i++) {
            count += i;
        }

        return `Final count is ${count}`
    }



    @Response<ValidateErrorJSON>(422, "Validation Failed")
    @Response<CannotCreateErrorJSON>(303, "See Other")
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createPost(
        @Body() requestBody: PostCreationParams,
        @Request() request?: express.Request
    ): Promise<blogPost | unknown> {
        console.log('Worker pid:', process.pid);
        new PostsService().create(requestBody) === false ? this.setStatus(303) : this.setStatus(201)
        return new PostsService().getPosts(requestBody.slug);
    };
}


@Route("fake")
export class FakePostsController extends Controller {
    @Response<NotFoundErrorJSON>(404, "Post not found")
    @Get("")
    public async fakePosts(
    ) {
        console.log('Worker pid:', process.pid);

        // await client.ping().then(console.log)
        return await client.get('posts').then(async (posts: any, err: any) => {

            if (err) return err;
            if (posts) {
                console.log('from cache')
                return JSON.parse(posts)
            } else {
                const posts = await axios.get(`https://jsonplaceholder.typicode.com/posts`)
                // console.log(posts.data)
                // await client.setex('posts', 99, JSON.stringify(posts.data));

                await client.set('posts', JSON.stringify(posts.data), 600);

                return posts.data;
            }
        })


    }



    @Response<NotFoundErrorJSON>(404, "Post not found")
    @Get("/{postId}")
    public async fakePost(
        @Path() postId: string
    ) {
        console.log('Worker pid:', process.pid);

        try {
            console.log('here')
            const posts = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
            return posts.data;
        } catch (err) {
            return err
        }

    }
}