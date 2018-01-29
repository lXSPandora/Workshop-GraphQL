// @flow

import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';
import BoardConnection from '../connection/BoardConnection';
import { BoardLoader } from '../loader';

export default new GraphQLObjectType({
  name: 'User',
  description: 'User data',
  fields: () => ({
    id: globalIdField('User'),
    _id: {
      type: GraphQLString,
      resolve: user => user._id,
    },
    name: {
      type: GraphQLString,
      resolve: user => user.name,
    },
    email: {
      type: GraphQLString,
      resolve: user => user.email,
    },
    myBoards: {
      type: BoardConnection.connectionType,
      resolve: ({ _id }, args, context) => BoardLoader.loadUserBoards(context, args, _id),
    },
    active: {
      type: GraphQLBoolean,
      resolve: user => user.active,
    },
  }),
  interfaces: () => [NodeInterface],
});
