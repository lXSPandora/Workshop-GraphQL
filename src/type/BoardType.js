import { GraphQLString, GraphQLBoolean, GraphQLObjectType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import UserType from './UserType';
import * as UserLoader from '../loader/UserLoader';
import * as TodoLoader from '../loader/TodoLoader';
import TodoConnection from '../connection/TodoConnection';

export default new GraphQLObjectType({
  name: 'Board',
  description: 'A Board that contains some todos',
  fields: () => ({
    id: globalIdField('Board'),
    _id: {
      type: GraphQLString,
      resolve: board => board._id,
    },
    title: {
      type: GraphQLString,
      resolve: board => board.title,
    },
    user: {
      type: UserType,
      resolve: ({ userId }, args, context) => UserLoader.load(context, userId),
    },
    todos: {
      type: TodoConnection.connectionType,
      resolve: ({ _id }, args, context) => TodoLoader.loadtodos(context, args, _id),
    },
    active: {
      type: GraphQLBoolean,
      resolve: board => board.active,
    },
  }),
});
