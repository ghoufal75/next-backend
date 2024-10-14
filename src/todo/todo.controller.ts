import { Body, Controller, Get, Post } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {

    constructor(private todosService : TodoService){

    }

    @Get()
    getTodoAnuelle(){
        const resultat = this.todosService.getTodos();
        return resultat ;
    }

    @Post()
    addTodo(@Body() body : {nom  : string, description : string}){
        console.log(body);
        return;
    }

}
