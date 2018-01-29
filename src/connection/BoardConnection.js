// @flow

import { GraphQLInt } from 'graphql';

import { connectionDefinitions } from 'graphql-relay';
import BoardType from '../type/BoardType';

export default connectionDefinitions({
  name: 'Board',
  nodeType: BoardType,
  connectionFields: {
    count: {
      type: GraphQLInt,
    },
  },
});
