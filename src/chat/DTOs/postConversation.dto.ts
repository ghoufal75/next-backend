import { IsArray } from 'class-validator';

export class PostConversationDTO {
  @IsArray()
  users: string[];
}
