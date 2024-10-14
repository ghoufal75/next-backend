import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TodoService {
    private readonly url = 'https://dummyapi.online/api/todos';
   
   
    async getTodos(){
        try{
            const {data} = await axios.get(this.url);
            return data;
        }
        catch(err){
            console.log(err);
        }
    }

}

