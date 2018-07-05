# which-state

A server which finds if a specified point, if any, is in provides list of geo boundaries.



## Getting Started

Assuming you have [node](https://nodejs.org/en/) & git installed on your machine

1. Clone the repo
   ```
   git clone https://github.com/orkeluskar/which-state.git
   ```
2. Change directory
   ```
   cd which-state
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



## Endpoints


| Name | Path | Description |
| - | - | - |
| Locator | [/locate](#locate) | Locates the coordinate provided |
| React UI | / | A react Front-End to interact with the node server |


---
###### /locate

|Parameter | type | Description|
| - | - | - |
| latitude | Float | **Required**. In geocoordinate format |
| longitude | Float | **Required**. In geocoordinate format |


## Examples

1. 
Request:
```
http://localhost:9191/locate?longitude=-77.036133&latitude=40.513799
```

Response:
```json
    {
        "state":"Pennsylvania"
    }
```

2. 
Request:
```
http://localhost:9191/locate?longitude=abc&latitude=baca
```

Response:
```json
    {
        "error":true,
        "Message":"Provide coordinates in digits"
    }
    
```

3. 
Request:
```
http://localhost:9191/locate?
```

Response:
```json
    {
        "error":true,
        "Message":"Please provide latitude and longitude"
    }
    