//Two Dimensional Array with the of the schema
let dataSchema = [];
let cellSize = 30;
let minCellSize = 5;
let maxCellSize = 100;
let amountCellsX = 5;
let amountCellsY = 5;

let schemaMarginX = 0;
let schemaMarginY = 0;
let schemaMarginLeft = 0;
let totalWidth = 0;
let widthSchema = 0;
let heightSchema = 0;

//Colors
let colorLines;
let colorBg;
let colorControl;

//Stroke levels
let strokeThin = 1;
let strokeRegular = 2;
let strokeBold = 4;

function refreshDimensions() {
    //Compute the cell Size. Min 5 max 35;
    //The width of the whole thing =  + widthSchema + schemaMarginLeft 
    let totalSquaresX = amountCellsX;
    let totalSquaresY =  amountCellsY; 

    //Compute the size of the cell.
    cellSize = (width - (50)) / totalSquaresX; 

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

    totalWidth = totalSquaresX * cellSize;

    //Margin of the Schema
    schemaMarginLeft = (width - (cellSize * amountCellsX)) / 2;
    schemaMarginX = schemaMarginLeft;
    schemaMarginY = (height - (cellSize * amountCellsY)) / 2;

    //Width and height of the schema.
    widthSchema = amountCellsX * cellSize;
    heightSchema = amountCellsY * cellSize;

    //Allign margins on the grid.
    schemaMarginX = roundOnGrid(schemaMarginX);
    schemaMarginY = roundOnGrid(schemaMarginY);
}

//Function to populate the initial array
function populate(oldData = []) {
    let newArray = []
    for (let x = 0; x < amountCellsX; x++) {
        let line = new Array(amountCellsY);
        for (let y = 0; y < amountCellsY; y++) {
            if (oldData?.[x] !== undefined && (oldData[x][y] === 0 || oldData[x][y] === 1)) {
                line[y] = oldData[x][y];
            } else {
                line[y] = 0;
            }
        }
        newArray.push(line);
    }
    return newArray;
}


function setup() {
    //Populate empty 2D array
    dataSchema = populate(dataSchema);
    //Create canvas.
    let cnv =createCanvas(windowWidth, windowHeight);
    cnv.elt.addEventListener("contextmenu", e => e.preventDefault());
    cnv.style('display', 'block');
    //Define the colors
    colorLines = color(210,210,255);
    colorBg = color(250);
    colorControl = color(20,20,255);
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
            if(dataSchema[x][y] == 0) {
                fill(255);
            } else fill(0);
            rect(schemaMarginX + x * cellSize, schemaMarginY + y * cellSize, cellSize, cellSize);
        }
    }
}

function hoverGrid() {
    let x = int((mouseX - schemaMarginX) / cellSize);
    let y = int((mouseY - schemaMarginY) / cellSize);
    if(x >= 0 && x < amountCellsX && y >= 0 && y < amountCellsY) {
        noFill();
        stroke(colorControl)
        strokeWeight(strokeBold);
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
            dataSchema[x][y] = 1;
        } 
        else {
            dataSchema[x][y] = 0;
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
    stroke(colorLines);
    strokeWeight(strokeThin);
    fill(colorBg);
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
let colorPicker = document.getElementById("colorPicker");
let colorPicked = document.getElementById("colorPicked")

function handleFormSize(event) {
    event.preventDefault();
    let newWidth = document.getElementById("newWidthSchema").value;
    let newHeight = document.getElementById("newHeightSchema").value;
    resizeSchema(newWidth, newHeight);
}

function handleColorPicker(event) {
    event.preventDefault();
    let newColor = colorPicked.value;
    alert(newColor);
}

function resizeSchema(w, h) {
    amountCellsX = int(w);
    amountCellsY = int(h);
    dataSchema = populate(dataSchema);
    refreshDimensions();
    refreshScreen();
}

formSize.addEventListener("submit", handleFormSize);
colorPicker.addEventListener("submit", handleColorPicker);
