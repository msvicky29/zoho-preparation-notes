/** 
 * @question: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Assume exactly one solution exists. 
 * @topic: Array 
 * @difficulty: Easy 
 * @platform: LeetCode 
 */ 
 
import java.util.HashMap; 
import java.util.Map; 
 
public class TwoSum { 
    public int[] twoSum(int[] nums, int target) { 
        Map<Integer, Integer> seen = new HashMap<>(); 
        for (int i = 0; i < nums.length; i++) { 
            int complement = target - nums[i]; 
            if (seen.containsKey(complement)) { 
                return new int[] { seen.get(complement), i }; 
            } 
            seen.put(nums[i], i); 
        } 
        throw new IllegalArgumentException("No solution found"); 
    } 
 
    public static void main(String[] args) { 
        TwoSum solver = new TwoSum(); 
        int[] result = solver.twoSum(new int[] {2, 7, 11, 15}, 9); 
        System.out.println(result[0] + ", " + result[1]); 
    } 
} 
