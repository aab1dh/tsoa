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
const cluster = require('cluster');
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