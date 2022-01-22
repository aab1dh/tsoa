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

interface NotFoundErrorJSON {
    message: "Post not found";
    details: { [name: string]: unknown };
}

@Route("posts")
export class PostsController extends Controller {
    @Response<NotFoundErrorJSON>(404, "Post not found")
    @Get("{postId}")
    public async getPost(
        @Path() postId: number,
        @Query() name?: string
    ) {
        return new PostsService().get(postId, name);
    }

    @Response<ValidateErrorJSON>(422, "Validation Failed")
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createPost(
        @Body() requestBody: PostCreationParams,
        @Request() request?: express.Request
    ): Promise<blogPost> {
        this.setStatus(201); // set return status 201
        console.log(request?.body)
        return new PostsService().create(requestBody);;
    }
}