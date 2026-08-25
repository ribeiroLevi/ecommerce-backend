import { FastifyRequest, FastifyReply } from "fastify";
import {UserService} from "../services/user-services.js"

interface CreateUserBody{
    name: string,
    email: string
}

export class UserController {
    private userService: UserService;

    constructor(){
        this.userService = new UserService()
    }

    async create (request: FastifyRequest<{Body: CreateUserBody}>, reply: FastifyReply){
        try{
        const {name, email} = request.body
        const user = await this.userService.executeCreate({name, email})

        return reply.status(201).send(user)
        }catch (error){
        if (error instanceof Error && error.message == "User already exists"){
            return reply.status(409).send({message: error.message})
        }
        return reply.status(500).send({message: "Internal Server Error"})
        }
    } 

    async list (request: FastifyRequest, reply: FastifyReply){
        const users = await this.userService.executeList()
        return reply.status(200).send(users)
    }
}