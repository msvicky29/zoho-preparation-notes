# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
 
## DSA Solution Pipeline (auto-import) 
 
### How to add a problem 
1. Create a .java file anywhere in the repo (example: sample/dsa/TwoSum.java). 
2. Put your question metadata in the leading /** ... */ comment: 
   * @question: the problem statement 
   * @topic: Array, String, Graph, etc. 
   * @difficulty: Easy, Medium, Hard 
   * @platform: LeetCode, GFG, etc. 
3. Commit and push. The GitHub Action (Extract DSA Questions) extracts the 
   comment plus the code into data/problems.json and commits it back. 
 
### Where it shows up 
The React app reads data/problems.json on the /practice page: 
* Browse by topic 
* Question of the Day (changes daily, solution hidden until you click Reveal) 
* Copy-code button 
 
### Run the extractor locally 
   node scripts/extract-code.js
