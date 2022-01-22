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

interface ValidateErrorJSON {
    message: "Validation failed";
    details: { [name: string]: unknown };
}

interface CannotCreateErrorJSON {
    message: "Validation failed";
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
        return new PostsService().getPosts();
    }


    @Response<NotFoundErrorJSON>(404, "Post not found")
    @Get("{postSlug}")
    public async getPost(
        @Path() postSlug: string
    ) {
        return new PostsService().getPosts(postSlug);
    }

    @Response<ValidateErrorJSON>(422, "Validation Failed")
    @Response<CannotCreateErrorJSON>(303, "Bad Request")
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createPost(
        @Body() requestBody: PostCreationParams,
        @Request() request?: express.Request
    ): Promise<blogPost | unknown> {
        new PostsService().create(requestBody) === false ? this.setStatus(303) : this.setStatus(201)
        return new PostsService().getPosts(requestBody.slug);
    };
}