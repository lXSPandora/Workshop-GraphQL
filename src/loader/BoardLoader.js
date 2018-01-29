// @flow
import DataLoader from 'dataloader';
import { Board as BoardModel } from '../model';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';

import type { ConnectionArguments } from 'graphql-relay';
import type { GraphQLContext } from '../TypeDefinition';

type BoardType = {
  id: string,
  _id: string,
  title: string,
  userId: string,
  active: boolean,
};

export default class Board {
  id: string;
  _id: string;
  title: string;
  userId: string;
  active: boolean;

  constructor(data: BoardType) {
    this.id = data.id;
    this._id = data._id;
    this.title = data.title;
    this.userId = data.userId;
    this.active = data.active;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(BoardModel, ids));

const viewerCanSee = () => true;
export const load = async (context: GraphQLContext, id: string): Promise<?Board> => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.BoardLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee(context, data) ? new Board(data, context) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: string) => dataloaders.BoardLoader.clear(id.toString());

export const loadUserBoards = (context: GraphQLContext, args: ConnectionArguments, userId: string) => {
  const Boards = BoardModel.find({
    userId,
  });

  return connectionFromMongoCursor({
    cursor: Boards,
    context,
    args,
    loader: load,
  });
};

export const loadBoards = async (context: GraphQLContext, args: ConnectionArguments) => {
  const Boards = BoardModel.find({});

  return connectionFromMongoCursor({
    cursor: Boards,
    context,
    args,
    loader: load,
  });
};
