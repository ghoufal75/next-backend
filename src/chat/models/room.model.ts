interface ConnectedUser {
  userId: string;
  socketId: string;
}


export interface Room {
  roomId: string;
  users: string[];
  joined: ConnectedUser[];
}
