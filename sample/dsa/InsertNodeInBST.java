/**
 * @question: Given the root node of a binary search tree (BST) and a value to insert, insert the value into the BST such that the tree remains a valid BST. Return the root of the tree after insertion.
 * @topic: Tree
 * @difficulty: Medium
 * @platform: LeetCode
 */
class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        if(root==null){
            return new TreeNode(val);
        }
        if(root.val<val){
            root.right=insertIntoBST(root.right,val);
        }
        else{
            root.left=insertIntoBST(root.left,val);
        }
        return root;
    }
}