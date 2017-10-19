import { extract } from '../../../../../src/operations/extract';
import { Serializeable } from '../../../../../src/primitive';
import { StaticNodeId } from '../../../../../src/schema';
import { createSnapshot } from '../../../../helpers';

const { QueryRoot: QueryRootId } = StaticNodeId;

describe.skip(`operations.extract`, () => {
  describe(`new array of references hanging off of a root`, () => {

    let extractResult: Serializeable.GraphSnapshot;
    beforeAll(() => {
      const snapshot = createSnapshot(
        {
          viewer: [
            {
              id: 123,
              name: 'Gouda',
            },
            {
              id: 456,
              name: 'Brie',
            },
          ],
        },
        `{ viewer { id name } }`
      ).snapshot;

      extractResult = extract(snapshot);
    });

    it(`extracts JSON serializable object`, () => {
      expect(extractResult).to.deep.eq({
        [QueryRootId]: {
          nodeSnapshotType: Serializeable.NodeSnapshotType.EntitySnapshot,
          outbound: [
            { id: '123', path: ['viewer', 0] },
            { id: '456', path: ['viewer', 1] },
          ],
          data: {
            viewer: [],
          },
        },
        '123': {
          nodeSnapshotType: Serializeable.NodeSnapshotType.EntitySnapshot,
          inbound: [{ id: QueryRootId, path: ['viewer', 0] }],
          data: { id: 123, name: 'Gouda' },
        },
        '456': {
          nodeSnapshotType: Serializeable.NodeSnapshotType.EntitySnapshot,
          inbound: [{ id: QueryRootId, path: ['viewer', 1] }],
          data: { id: 456, name: 'Brie' },
        },
      });
    });

  });
});
