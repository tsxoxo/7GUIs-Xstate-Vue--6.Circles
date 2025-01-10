# How to select a circle

Available data:

[x, y] of mouseclick -- M

[x, y, r] of Circles -- C1, C2...

## Algorithm A

-   calculate distance M-C1, M-C2..: D1, D2...
-   check D1<r => select C1
    -   and so on

## Algorithm B

-   compare all distances D1, D2...
-   check if Dmin<r

## Check boxes

smth msth boxes

## Algorithm C

⭐️ WINNER

### 0.1

-   sort Circles[]
-   pick circle(s) with x closest to Mx -> Cx
-   pick circle(s) with y closest to My -> Cy
-   check if DCx<r and DCy<r
    -   find Dmin
    -   if both are within, pick smallest D
-   select Cmin
    -   how to change the CSS class of the winning circle?
    -   step 1: output the winning circle in console

Hypothesis: this will work if either Cx or Cy are the actual circle where I clicked

### 0.2

function getAllIndexes(arr, val) {
var indexes = [], i;
for(i = 0; i < arr.length; i++)
if (arr[i] === val)
indexes.push(i);
return indexes;
}

deltasOfX = circles.map([x] => Math.abs(x-r))
smallestX = Math.min(...deltasOfX)
// check if there are more of this smallest X
allX = getAllIndexes(deltasOfX, smallestX)
// what index do these have?

circleWinnersX = allX.map( indexOfCircle => circle[indexOfCircle] )
const isClickInside = circleWinnersX.map({coordinated: [x, y], radius} => {
const distance = Math.hypot(x-clickX, y-clickY)
return (distance<radius ? true : false)
})

if(isClickInside.indexOf(true) > -1) {console.log(isClickInside)}

// Improvements
allDeltasOfCoordinates = circles.map([x,y] => [Math.abs(x-r), Math.abs(y-r)])
indexOfwinnerX = Math.min(...allDeltasOfCoordinates)
