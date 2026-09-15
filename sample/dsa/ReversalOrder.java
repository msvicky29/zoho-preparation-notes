/**
 * @question: Given the root of a binary tree, return its reverse level order traversal. The traversal should process nodes from the bottommost level up to the root, and within each level from left to right.
 * @topic: Tree
 * @difficulty: Easy
 * @platform: GeeksforGeeks
 */
class Solution {
    public List<Integer> reverseLevelOrder(Node root) {
        LinkedList<Node> ll=new LinkedList<>();
        LinkedList<Integer> result=new LinkedList<>();
        if(root==null){
            return result;
        }
        ll.addFirst(root);
        while(!ll.isEmpty()){
            int size=ll.size();
            for(int i=0;i<size;i++){
                Node node=ll.pollFirst();
                result.addFirst(node.data);
                if(node.right!=null){
                    ll.addLast(node.right);
                }
                if(node.left!=null){
                    ll.addLast(node.left);
                }
            }
        }
        return result;
    }
}