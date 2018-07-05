# which-state

A server which finds if a specified point, if any, is in provides list of geo boundaries.



## Getting Started

To get started quickly, assuming you have node & git installed on your machine
```bash
chmod +x quickstart.sh && ./quickstart.sh
```

**OR, follow these steps**

1. Clone the repo
   ```
   git clone https://github.com/orkeluskar/which-state.git
   ```
2. Install dependencies
   ```
   npm install
   ```
3. Run the server
   ```
   npm run start
   ```
4. Visit [localhost:9191](http://localhost:9191)



## Solution Overview

> Inspired from [here](https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon/)

1. For any given point, draw a horizontal line across the globe
2. Count the number of times the line intersects state boundaries
3. A point is inside the state if either of intersection is odd or point lies on the edge of state. If none of the conditions is true, then 
   point lies outside.