
class BasicRepository{
    async get(){
        return Math.random()
    }
}

const Repository = new BasicRepository()
export default Repository