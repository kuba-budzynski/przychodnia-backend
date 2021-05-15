import {Controller, Get, Path, Route,} from "tsoa";
import BasicService from '../Services/BasicService'

@Route("basic")
export class BasicController extends Controller {
    @Get("/{num}")
    public async getBasic(@Path() num: number) {
       return BasicService.getBasics(num)
    }

}