/**
 * @question: Given two integer arrays preorder and inorder representing the preorder and inorder traversal of a binary tree, construct and return the binary tree. You may assume there are no duplicate values in the tree.
 * @topic: Tree
 * @difficulty: Medium
 * @platform: LeetCode
 */
class Solution {
    Map<Integer,Integer> map = new HashMap<>();
    int preOrderIndex=0;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for(int i=0;i<inorder.length;i++){
            map.put(inorder[i],i);
        }
        return build(preorder,0,inorder.length-1);
    }
    public TreeNode build(int[] preorder,int left,int right){
        if(left>right) return null;
        TreeNode root=new TreeNode(preorder[preOrderIndex++]);
        int inOrderIndex=map.get(root.val);
        root.left=build(preorder,left,inOrderIndex-1);
        root.right=build(preorder,inOrderIndex+1,right);
        return root;
    }
}