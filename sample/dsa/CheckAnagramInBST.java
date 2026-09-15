/**
@question: Given two binary trees, determine whether they are level-wise anagrams of each other. This means that for every level, the two trees must contain the same node values with the same frequencies, regardless of order. Return true if all corresponding levels match, otherwise false.
@topic: Tree
@difficulty: Medium
@platform: GeeksforGeeks
*/
class Solution {
    public boolean areAnagrams(Node root1, Node root2) {
        Queue<Node> q1=new LinkedList<>();
        Queue<Node> q2=new LinkedList<>();
        q1.offer(root1);
        q2.offer(root2);
        while(!q1.isEmpty() || !q2.isEmpty()){
           int s1=q1.size();
           int s2=q2.size();
           if(s1!=s2){
               return false;
           }
           Map<Integer,Integer> map=new HashMap<>();
           for(int i=0;i<s1;i++){
               Node curr=q1.poll();
               map.put(curr.data,map.getOrDefault(curr.data,0)+1);
               if(curr.left!=null){
                   q1.offer(curr.left);
               }
               if(curr.right!=null){
                   q1.offer(curr.right);
               }
           }
           for(int i=0;i<s2;i++){
               Node curr=q2.poll();
               if(!map.containsKey(curr.data)){
                   return false;
               }
               map.put(curr.data,map.get(curr.data)-1);
               if(map.get(curr.data)==0){
                   map.remove(curr.data);
               }
               if(curr.left!=null){
                   q2.offer(curr.left);
               }
               if(curr.right!=null){
                   q2.offer(curr.right);
               }
               
           }
           if(!map.isEmpty()) {
               return false;
           }
        }
        
        return q1.isEmpty() && q2.isEmpty();
       
    }
}