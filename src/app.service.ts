import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './User.Entity';
import { And, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor( @InjectRepository(User)
  private userRepository : Repository<User>,) {}

  async registor(data: any): Promise<User> {
    return this.userRepository.save(data)
  }

  async findOne(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async login(email: string): Promise<User> {
    return this.userRepository.findOne({where:{email}})
  }

  async all(){
    return this.userRepository.find()
  }
}
