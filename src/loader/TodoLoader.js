// @flow
import DataLoader from 'dataloader';
import { Todo as TodoModel } from '../model';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';

import type { ConnectionArguments } from 'graphql-relay';
import type { GraphQLContext } from '../TypeDefinition';

type TodoType = {
  id: string,
  _id: string,
  title: string,
  description: string,
  userId: string,
  active: boolean,
};

export default class Todo {
  id: string;
  _id: string;
  title: string;
  description: string;
  userId: string;
  active: boolean;

  constructor(data: TodoType) {
    this.id = data.id;
    this._id = data._id;
    this.title = data.title;
    this.description = data.description;
    this.userId = data.userId;
    this.active = data.active;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(TodoModel, ids));

const viewerCanSee = () =>
  // Anyone can see another user
  true;
export const load = async (context: GraphQLContext, id: string): Promise<?Todo> => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.TodoLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee(context, data) ? new Todo(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: string) => dataloaders.TodoLoader.clear(id.toString());

export const loadtodos = async (context: GraphQLContext, args: ConnectionArguments, boardId: string) => {
  const where = args.search ? { title: { $regex: new RegExp(`^${args.search}^`, 'ig') } } : {};
  const todos = TodoModel.find(where, { boardId });

  return connectionFromMongoCursor({
    cursor: todos,
    context,
    args,
    loader: load,
  });
};
