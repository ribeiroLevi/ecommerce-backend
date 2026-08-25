import {randomUUID} from "node:crypto"

interface CreateUserDTO {
    name: string
    email: string
}

const users: Array <{id: string; name: string; email: string}> = []

export class UserService {
        async executeCreate ({name,email}: CreateUserDTO){
            const userAlreadyExists = users.find ((user) => user.email === email)
            if (userAlreadyExists){
                throw new Error ("User already existes")
            }

            const user = {
                id: randomUUID(),
                name,
                email,
            }

            users.push (user)
            return user;
        }
        
        async executeList (){
            return users
        }
}