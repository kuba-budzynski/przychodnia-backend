import {BadRequestError} from "../config/handleError";
import Repository from "../Repositories/BasicRepository";

export type BasicDTO = {
    content: string
}[];

class BasicService {
    async getBasics(n: Number) {
        if (n < 0){
            throw new BadRequestError("n <")
        }
        var data = []
        for(var i=0; i<n; i++) data.push(await Repository.get())
        return {data}
    }
}

export default new BasicService();