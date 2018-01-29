// @flow

import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { connectionArgs, fromGlobalId } from 'graphql-relay';
import { NodeField } from '../interface/NodeInterface';

import UserType from './UserType';
import { UserLoader, BoardLoader, TodoLoader } from '../loader';
import UserConnection from '../connection/UserConnection';
import TodoType from '../type/TodoType';
import BoardType from './BoardType';
import BoardConnection from '../connection/BoardConnection';
// import TodoConnection from '../connection/TodoConnection';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: NodeField,
    me: {
      type: UserType,
      resolve: (root, args, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => UserLoader.loadUsers(context, args),
    },
    todo: {
      type: TodoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return TodoLoader.load(context, id);
      },
    },
    board: {
      type: BoardType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return BoardLoader.load(context, id);
      },
    },
    boards: {
      type: BoardConnection.connectionType,
      args: {
        ...connectionArgs,
      },
      resolve: (obj, args, context) => BoardLoader.loadBoards(context, args),
    },
  }),
});
