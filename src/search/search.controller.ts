import { Body, Controller, Post } from '@nestjs/common';
import { PostSearchUsers } from './dtos/postSearchUsers.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}
  @Post()
  searchUsers(@Body() dto: PostSearchUsers) {
    return this.searchService.searchUsers(dto);
  }
}
