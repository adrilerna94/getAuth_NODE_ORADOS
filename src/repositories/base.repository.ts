// A generic repository class providing common database operations.
// Can be extended by specific repositories like user.repository.ts.

import { Model, ProjectionFields } from 'mongoose';
import { IUserDto } from '../types/userDto.interface';

export class BaseRepository<Document> {
  private readonly model: Model<Document>;
  private readonly defaultProjection : ProjectionFields<Document>;

  constructor(model: Model<Document>) {
    this.model = model;
    this.defaultProjection = { __v: 0 }; // evitamos versión document
  }

  async register (userData: IUserDto, projection?: ProjectionFields<Document>) {
    const newUser = new this.model(userData);
    const savedUser = await newUser.save();
    return this.model.findById(savedUser._id, projection);
  }
  findByEmail = (email: string) => this.model.findOne({email}, this.defaultProjection);
}
