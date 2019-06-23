const { bufferToHex, toBuffer } = require('ethereumjs-util');
const {
  arrayUtils: { zip, genIntSequence },
} = require('../helpers/merkleTree');

const { expect } = require('chai');

const bytesArray = (...strings) => strings.map(s => bufferToHex(toBuffer(s)));

function shouldBehaveLikeMerkleTreesVerifyProof () {
  describe('verifyProof', function () {
    it('returns true for a valid Merkle proof', async function () {
      const dataBlocks = bytesArray('p', 'qq', 'rrr', 'ssss');
      const { root, proofs } = this.jsLib.buildMerkleTree(dataBlocks);
      await Promise.all(
        zip(dataBlocks, proofs).map(async ([dataBlock, proof]) => {
          expect(await this.MerkleTrees.verifyProof(root, dataBlock, proof)).to.equal(true);
        })
      );
    });
    it('returns false for an invalid Merkle proof', async function () {
      const correctLeaves = bytesArray('p', 'qq', 'rrr', 'ssss');
      const { root: correctRoot } = this.jsLib.buildMerkleTree(correctLeaves);

      const badLeaves = bytesArray('t', 'u', 'v');
      const { proofs: badProofs } = this.jsLib.buildMerkleTree(badLeaves);

      await Promise.all(
        zip(correctLeaves, badProofs).map(async ([correctLeaf, badProof]) => {
          expect(await this.MerkleTrees.verifyProof(correctRoot, correctLeaf, badProof)).to.equal(false);
        })
      );
    });

    it('returns false for a Merkle proof of invalid length', async function () {
      const leaves = bytesArray('x', 'y', 'z');

      const { root, proofs } = this.jsLib.buildMerkleTree(leaves);

      const [leaf0, proof0] = zip(leaves, proofs)[0];

      const badProof0 = proof0.slice(0, proof0.length - 1);

      expect(await this.MerkleTrees.verifyProof(root, leaf0, badProof0)).to.equal(false);
    });
  });
}

function shouldBehaveLikeMerkleTreesComputeRoot () {
  describe('computeRoot', function () {
    // describe('for a tree with 0 leaves (no root)', () => {
    //   it('reverts', async function () {
    //     await assertRevert(this.MerkleTrees.computeRoot([]));
    //   });
    // });

    const testForTreeOfSize = (n, description) => {
      describe(description, () => {
        before(async function () {
          // '0x00', '0x01', '0x02', ...
          this.leaves = genIntSequence(n)
            .map(i => 0xfc + i)
            .map(toBuffer)
            .map(bufferToHex);

          // console.log({ leaves: this.leaves });

          const bufLeaves = this.leaves.map(toBuffer);
          const concatenatedBytes = bufferToHex(Buffer.concat(bufLeaves));
          const bytesLengths = bufLeaves.map(({ length }) => length);
          // console.log({ concatenatedBytes, bytesLengths });

          this.rootSolidity = await this.MerkleTrees.computeRoot(concatenatedBytes, bytesLengths);

          // console.log({ rootSolidity: this.rootSolidity });
          const { root, proofs } = this.jsLib.buildMerkleTree(this.leaves);
          this.rootJavaScript = root;
          this.proofs = proofs;
        });

        it('computes the same root as the JavaScript implementation for the same tree', function () {
          expect(this.rootSolidity).to.equal(this.rootJavaScript);
        });

        it(`using the computed root, MerkleTree.verifyProof works for all ${n} proofs`, async function () {
          await Promise.all(
            zip(this.leaves, this.proofs).map(async ([leaf, proof]) =>
              expect(await this.MerkleTrees.verifyProof(this.rootSolidity, leaf, proof)).to.equal(true)
            )
          );
        });
      });
    };

    testForTreeOfSize(1, 'for a tree with 1 leaf, the smallest tree possible');
    for (let n = 2; n <= 9; n++) {
      testForTreeOfSize(n, `for a tree with ${n} leaves`);
    }
    testForTreeOfSize(32, 'for a slightly larger tree with 32 leaves, the largest tree of height 5');
    testForTreeOfSize(33, 'for a slightly larger tree with 33 leaves, the smallest tree of height 6');
  });
}

module.exports = {
  shouldBehaveLikeMerkleTreesVerifyProof,
  shouldBehaveLikeMerkleTreesComputeRoot,
};
