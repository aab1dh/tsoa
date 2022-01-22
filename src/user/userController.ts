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
import { User } from "./user";
import { UsersService, UserCreationParams } from "./userService";

interface ValidateErrorJSON {
    message: "Validation failed";
    details: { [name: string]: unknown };
}

interface NotFoundErrorJSON {
    message: "User not found";
    details: { [name: string]: unknown };
}

@Route("users")
export class UsersController extends Controller {

    @Response<NotFoundErrorJSON>(404, "User not found")
    @Get("")
    public async getUsers(
    ) {
        return new UsersService().get();
    }


    @Response<NotFoundErrorJSON>(404, "User not found")
    @Get("{userId}")
    public async getUser(
        @Path() userId: number,
        @Query() name?: string
    ) {
        return new UsersService().get(userId, name);
    }

    @Response<ValidateErrorJSON>(422, "Validation Failed")
    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
        @Body() requestBody: UserCreationParams,
        @Request() request?: express.Request
    ): Promise<User> {
        this.setStatus(201); // set return status 201
        console.log(request?.body)
        return new UsersService().create(requestBody);;
    }
}