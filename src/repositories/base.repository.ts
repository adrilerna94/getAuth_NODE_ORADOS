// A generic repository class providing common database operations.
// Can be extended by specific repositories like user.repository.ts.

import { Model, ProjectionFields } from 'mongoose';
import { IUser } from '../types/user.interface';

export class BaseRepository<Document> {
  private model: Model<Document>;
  private defaultProjection : ProjectionFields<Document>;

  constructor(model: Model<Document>) {
    this.model = model;
    this.defaultProjection = { __v: 0 }; // evitamos versión document
  }

  async register (userData: Omit<IUser, 'createdAt' | 'updatedAt'>, projection?: ProjectionFields<Document>) {
    const newUser = new this.model(userData);
    const savedUser = await newUser.save();
    return this.model.findById(savedUser._id, projection);
  }
  findByEmail = (email: string) => this.model.findOne({email}, this.defaultProjection);
}
