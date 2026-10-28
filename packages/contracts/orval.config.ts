import { defineConfig } from 'orval';

export default defineConfig({
  vietvi: {
    input: '../../docs/api/openapi.json',
    output: {
      mode: 'tags-split',
      target: './generated',
      schemas: './generated/models',
      client: 'react-query',
      mock: true,
    },
  },
});
