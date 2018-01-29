// @flow

import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';
import UserType from './UserType';
import * as UserLoader from '../loader/UserLoader';

export default new GraphQLObjectType({
  name: 'Todo',
  description: 'Todo data',
  fields: () => ({
    id: globalIdField('Todo'),
    _id: {
      type: GraphQLString,
      resolve: todo => todo._id,
    },
    title: {
      type: GraphQLString,
      resolve: todo => todo.title,
    },
    description: {
      type: GraphQLString,
      resolve: todo => todo.description,
    },
    user: {
      type: UserType,
      resolve: ({ userId }, args, context) => UserLoader.load(context, userId),
    },
    active: {
      type: GraphQLBoolean,
      resolve: todo => todo.active,
    },
  }),
  interfaces: () => [NodeInterface],
});
