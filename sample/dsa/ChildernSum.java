/**
 * @question: Given the root of a binary tree, check whether it satisfies the children sum property. For every node except leaf nodes, the node's value must equal the sum of its left and right children's values, treating a missing child as 0.
 * @topic: Tree
 * @difficulty: Easy
 * @platform: GeeksforGeeks
 */
class Solution {
    public  boolean dfs(Node root){
        if(root==null){
            return true;
        }
        if(root.left==null && root.right==null){
            return true;
        }
       int left=(root.left!=null)? root.left.data : 0;
       int right=(root.right!=null)? root.right.data : 0;
       
       return (root.data== left+right) && dfs(root.left) && dfs(root.right);
        
    }
    public boolean isSumProperty(Node root) {

        return dfs(root);
    }
}