//Two Dimensional Array with the of the schema
let dataSchema = [];

//Variables in relations with the cells.
let cellSize = 50;
let minCellSize = 5;
let maxCellSize = 200;
let amountCellsX = 8;
let amountCellsY = 8;

let schemaMarginX = 0;
let schemaMarginY = 0;
let widthSchema = 0;
let heightSchema = 0;

//Colors
let colorLines = "#c6a5d7";
let colorBg = "#e9eff9";
let colorUser = "#0000FF";

//Stroke levels
let strokeThin = 1;
let strokeRegular = 3;

//Function to populate the initial array
function populate(oldData = []) {
    let newArray = []
    for (let x = 0; x < amountCellsX; x++) {
        let line = new Array(amountCellsY);
        for (let y = 0; y < amountCellsY; y++) {
            if (oldData?.[x] !== undefined && typeof oldData[x][y] === "string") {
                line[y] = oldData[x][y];
            } else {
                line[y] = "#ffffff";
            }
        }
        newArray.push(line);
    }
    return newArray;
}

function refreshDimensions() {
    let totalSquaresX = amountCellsX;
    let totalSquaresY =  amountCellsY; 

    //Compute the size of the cell.
    cellSize = (width) / totalSquaresX; 

    //Check if we need space horizontally
    if( (totalSquaresX * cellSize) > (width - (3 * cellSize))) {
        cellSize = (width - (3 * cellSize)) / totalSquaresX; 
    }
    //Check if we need space vertically
    if((totalSquaresY * cellSize) > (height - (3 * cellSize))) {
        cellSize = (height - (3 * cellSize)) / totalSquaresY;
    }

    //Constraint it into the min and max.
    if(cellSize < minCellSize) {
        cellSize = minCellSize;
    }
    if(cellSize > maxCellSize) {
        cellSize = maxCellSize;
    }

    //Margin of the Schema
    schemaMarginX = (width - (cellSize * amountCellsX)) / 2;
    schemaMarginY = (height - (cellSize * amountCellsY)) / 2;

    //Width and height of the schema.
    widthSchema = amountCellsX * cellSize;
    heightSchema = amountCellsY * cellSize;

    //Allign margins on the grid.
    schemaMarginX = roundOnGrid(schemaMarginX);
    schemaMarginY = roundOnGrid(schemaMarginY);
}

//Recompute geometry and re display on window resize.
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    refreshDimensions();
    refreshScreen();
}

//When the mouse is clicked.
function updateWhenMouse() {
    updateGrid();  
    hoverGrid();
}

function refreshScreen() {
    drawMegaGrid();
    drawGridFromScratch();
}

function drawGridFromScratch() {
    stroke(0);
    strokeWeight(strokeRegular);
    for(let y = 0; y < amountCellsY; y++) {
        for(let x = 0; x < amountCellsX; x++) {
            fill(color(dataSchema[x][y]));
            rect(schemaMarginX + x * cellSize, schemaMarginY + y * cellSize, cellSize, cellSize);
        }
    }
}

//Function to animate the hovering over the grid.
function hoverGrid() {
    let x = int((mouseX - schemaMarginX) / cellSize);
    let y = int((mouseY - schemaMarginY) / cellSize);
    if(x >= 0 && x < amountCellsX && y >= 0 && y < amountCellsY) {
        noFill();
        stroke(color(colorLines));
        noFill();
        strokeWeight(strokeRegular);
        rect(x * cellSize + schemaMarginX, 
            y * cellSize + schemaMarginY, 
            cellSize, 
            cellSize);
    }
}

function updateGrid() {
    let x = int((mouseX - schemaMarginX) / cellSize);
    let y = int((mouseY - schemaMarginY) / cellSize);
    if(x >= 0 && x < amountCellsX && y >= 0 && y < amountCellsY) {
        if(mouseButton == LEFT) {
            dataSchema[x][y] = colorUser;
        } 
        else {
            dataSchema[x][y] = "#ffffff";
        }
        stroke(0);
        stroke(strokeRegular);
        rect(schemaMarginX + x * cellSize, schemaMarginY + y * cellSize, cellSize, cellSize);
    } 
}

function mouseReleased() {
    refreshScreen();
}


//Draw the background Grid
function drawMegaGrid() {
    stroke(color(colorLines));
    strokeWeight(strokeThin);
    fill(color(colorBg));
    for(let y = 0; y < height / cellSize; y++) {
        for(let x = 0; x < width / cellSize; x ++) {
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

//Helper function to allign on the grid.
function roundOnGrid(n) {
    return int(n / cellSize) * cellSize;
}

//Use the form to change the size of the thing.
let formSize = document.getElementById("formSize");
let colorPicked = document.getElementById("colorPicked")

function handleFormSize(event) {
    event.preventDefault();
    let newWidth = document.getElementById("newWidthSchema").value;
    let newHeight = document.getElementById("newHeightSchema").value;
    resizeSchema(newWidth, newHeight);
}



colorPicked.addEventListener("input", () => {
    colorUser = colorPicked.value
})

function resizeSchema(w, h) {
    amountCellsX = int(w);
    amountCellsY = int(h);
    dataSchema = populate(dataSchema);
    refreshDimensions();
    refreshScreen();
}

formSize.addEventListener("submit", handleFormSize);

function setup() {
    //Populate empty 2D array
    dataSchema = populate(dataSchema);
    //Create canvas.
    let cnv =createCanvas(windowWidth, windowHeight);
    cnv.elt.addEventListener("contextmenu", e => e.preventDefault());
    cnv.style('display', 'block');
    refreshDimensions();
    refreshScreen();
}

function draw() {
    drawGridFromScratch();
    hoverGrid();
    if(mouseIsPressed) {
        updateWhenMouse();
    }
}