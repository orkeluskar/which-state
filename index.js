const express = require('express');
const app = express();
const PORT = process.env.PORT || 9191;

const statesBound = require('./assets/states.json');

//Check if p2 lies on line p1-p3
const liesOnSegment = (p1, p2, p3) => {
    if (p2.x <= Math.max(p1.x, p3.x) && p2.x >= Math.min(p1.x, p3.x) 
                                    &&
        p2.y <= Math.max(p1.y, p3.y) && p2.y >= Math.min(p1.y, p3.y)){
            return true;
    }
    return false;
}

//find alignment of p1, p2, p3
const alignment = (p1, p2, p3) => {
    let ans = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
    
    if (ans === 0)
        return 0;   //colinear
    return (ans > 0) ? 1 : 2;  // clock or counterclock wise
}

//Find if p1-q1 and p2-q2 intersect
const intersect = (p1, q1, p2, q2) => {

    //Alignments needed for general & special cases
    let a1 = alignment(p1, q1, p2);
    let a2 = alignment(p1, q1, q2);
    let a3 = alignment(p2, q2, p1);
    let a4 = alignment(p2, q2, q1);

    //General case
    if (a1 !== a2 && a3 !== a4) 
        return true;
    
    //Special Cases
    //p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (a1 === 0 && liesOnSegment(p1, p2, q1))
        return true;
    
    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (a2 === 0 && liesOnSegment(p1, q2, q1))
        return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2    
    if (a3 === 0 && liesOnSegment(p2, p1, q2))
        return true;
    
    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (a4 === 0 && liesOnSegment(p2, q1, q2))
        return true;
    
    return false //Doesn't intersect
}

//if point p lies inside state boundaries with n vertices
const liesInState = (state, n, p) => {

    if (n < 3)
        return false;
    
    //Create a point for line segment from p to infinite
    let xInfinite = {
        x: Number.MAX_VALUE,
        y: p.y
    };

    let count = 0;
    let i = 0;

    //Counting intersections of line above with boundaries of the state
    do{
        let next = (i + 1) % n;

        if (intersect(state[i], state[next], p, xInfinite)){
            // If the point 'p' is colinear with line segment 'i-next',
            // then check if it lies on segment. If it lies, return true,
            // otherwise false
            if (alignment(state[i], p, state[next]) === 0 )
                return liesOnSegment(state[i], p, state[next]);
            count++;
        }
        i = next;
    }while(i !== 0)

    // Return true if count is odd, false otherwise
    return count % 2 === 1;
}

//transforming input states according to algorithm
const worker = async (states, p) => { 
    for (let i = 0; i < states.length; i++){
        let transformed = [];
        states[i].border.map(point => {
            transformed.push({
                x: point[0],
                y: point[1]
            })
        });

        if (liesInState(transformed, transformed.length, p))
            return states[i].state;
    }
    return "Outside US";
}

//api endpoint method to receive request and respond with result
const locateMe = async (req, res) => {
    //empty arguments
    if ( !('latitude' in req.query) || !('longitude' in req.query))
        await res.status(400).send({
            error: true,
            Message: 'Please provide latitude and longitude'
        });
    else{
        let latitude = parseFloat(req.query.latitude);
        let longitude = parseFloat(req.query.longitude);

        //arguments are not numbers
        if (Object.is(latitude, NaN) || Object.is(longitude, NaN))
            await res.status(400).send({
                error: true,
                Message: 'Provide coordinates in digits'
            });
        else{
            let point = {
                x: longitude,
                y: latitude
            };

            let result = await worker(statesBound, point);
            //coordinates are outside US
            if (result === "Outside US")
                await res.status(400).send({
                    error: true,
                    Message: 'Coordinates provide are ' + result,
                });
            else{
                res.status(200).send({
                    state: result
                })
            }
        }
    }
}

//pass the req to locateMe
app.get('/locate', locateMe);

app.use('/', express.static('static'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));