import {Controller, Get, Path, Route} from "tsoa";
import knex from '../config/database'

@Route("user")
export class BasicController extends Controller {
    @Get("/emails")
    public async getBasic() {
        const x = knex('users').select({email: 'users.email'})
        return x
    }
}