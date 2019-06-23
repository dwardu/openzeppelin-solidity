pragma solidity ^0.5.0;

import "../cryptography/MerkleTrees.sol";

contract MerkleTreesMock {

    function _split(bytes memory concatenated, uint256[] memory sizes)
        internal
        pure
        returns (bytes[] memory parts)
    {
        parts = new bytes[](sizes.length);
        uint256 k = 0;
        for (uint256 i = 0; i < sizes.length; i++) {
            uint256 size = sizes[i];
            parts[i] = new bytes(size);
            for (uint256 j = 0; j < size;) {
                parts[i][j++] = concatenated[k++];
            }
        }
        assert(k == concatenated.length);
    }

    using MerkleTrees for MerkleTrees.Tree;

    function computeRoot(bytes memory concatenatedLeafData, uint256[] memory leafDataLengths)
        public
        pure
        returns (bytes32)
    {
        bytes[] memory leaves = _split(concatenatedLeafData, leafDataLengths);
        MerkleTrees.Tree memory tree = MerkleTrees.newTree(leaves.length);
        for (uint256 i = 0; i < leaves.length; i++) {
            tree.setLeafDataBlock(i, leaves[i]);
        }
        return tree.computeRoot();
    }

    function verifyProof(
        bytes32 root,
        bytes memory leafData,
        bytes32[] memory proof
    )
        public
        pure
        returns (bool)
    {
        return MerkleTrees.verifyProof(root, leafData, proof);
    }

}
