import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({ name: 'userRoleclientPipe', standalone: false })

export class UserRoleclientPipe implements PipeTransform {
    transform(users: User[] | null): User[] {
        if (!users) return []; 
        return users.filter(
            user => user.role === 'USER' 
        );
    }
}
