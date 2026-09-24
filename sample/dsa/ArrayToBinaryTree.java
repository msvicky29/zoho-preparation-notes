/**
 * @question: Given a list of integers representing the level order traversal of a complete binary tree, construct the binary tree and return its root. The list is indexed such that for a node at index i, its left child is at 2*i+1 and its right child is at 2*i+2.
 * @topic: Tree
 * @difficulty: Easy
 * @platform: GeeksforGeeks
 */
class Solution {
    public Node buildTree(List<Integer> nodes) {
        // code here
        int n=nodes.size();
        if(n==0) return null;
        
        Node[] tree=new Node[n];
        
        for(int i=0;i<n;i++){
            tree[i]=new Node(nodes.get(i));
        }
        for(int i=0;i<n;i++){
            int left=2*i+1;
            int right=2*i+2;
            if(left<n){
                tree[i].left=tree[left];
            }
            if(right<n){
                tree[i].right=tree[right];
            }
        }
        
        return tree[0];
    }
}