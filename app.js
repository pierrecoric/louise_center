//Two Dimensional Array with the of the schema
let dataSchema = [];

//Variables in relations with the cells.
let cellSize = 50;
let minCellSize = 5;
let maxCellSize = 200;
let amountCellsX = 7;
let amountCellsY = 7;

let schemaMarginX = 0;
let schemaMarginY = 0;

//Colors
let colorLines = "#c6a5d7";
let colorBg = "#e9eff9";
let colorUser = "#7B904B";

//Stroke levels
let strokeThin = 1;
let strokeRegular = 3;

//Variables for the highlighted line.
let highLightLine = true;
let highlightedLine = 7;
let highLightField = document.getElementById("highLight");
let highlightCheckBox = document.getElementById("hightLightCheckBox");
highlightCheckBox.addEventListener("change", () => {
    if(highLightLine === true) {
        highLightLine = false;
    }
    else {
        highLightLine = true;
    }
});

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

//Function to handle dimensions.
function refreshDimensions() {

    if(windowHeight > windowWidth) {
        resizeCanvas(windowWidth - 160, windowHeight / 2);
    } else {
        resizeCanvas(windowWidth - 160, windowHeight - 160);
    }
    //Reside the P5.js canvas.
    

    //Handle the highlighted line
    highLightField.setAttribute("max", amountCellsY);
    highLightField.setAttribute("value", amountCellsY);
    highlightedLine = amountCellsY;
    //Compute the size of the cell.
    cellSize = width / (amountCellsX + 4); 

    //Check if we need space horizontally
    if( (amountCellsX * cellSize) > (width - (2 * cellSize))) {
        cellSize = (width - (2 * cellSize)) / amountCellsX;
    }
    //Check if we need space vertically
    if((amountCellsY * cellSize) > (height - (2 * cellSize))) {
        cellSize = (height - (2 * cellSize)) / amountCellsY;
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

    //Allign margins on the grid.
    schemaMarginX = roundOnGrid(schemaMarginX);
    schemaMarginY = roundOnGrid(schemaMarginY);
}

//Recompute geometry and re-display on window resize.
function windowResized() {
    refreshDimensions();
    refreshScreen();
}

function updateWhenMouse() {
    updateGrid();  
    hoverGrid();
}

function refreshScreen() {
    drawMegaGrid();
    drawGridFromScratch();
}

//This functions draws the grid that contains the schema.
function drawGridFromScratch() {
    stroke(0);
    strokeWeight(strokeRegular);
    for(let y = 0; y < amountCellsY; y++) {
        for(let x = 0; x < amountCellsX; x++) {
            fill(color(dataSchema[x][y]));
            rect(schemaMarginX + x * cellSize, schemaMarginY + y * cellSize, cellSize, cellSize);
        }
    }
    if(highLightLine === true) {
        noFill();
        stroke(255,0,0);
        rect(schemaMarginX, (highlightedLine - 1) * cellSize + schemaMarginY, amountCellsX * cellSize, cellSize);
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

//Updates the value of a cell in the array based on the mouse position.
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
    } 
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

//Handle the input of colors by the user.
let colorPickers = document.querySelectorAll(".colorPicker");
colorPickers.forEach(picker => {
    picker.addEventListener("input", () => {
        colorUser = picker.value;
    });
    picker.addEventListener("click", () => {
        colorUser = picker.value;
    });
});

//Changing the position of the highlighted line.
highLightField.addEventListener("input", () => highlightedLine = highLightField.value);

//Changing the canvas size.
let newWidth = document.getElementById("newWidthSchema");
let newHeight = document.getElementById("newHeightSchema");
newWidth.addEventListener("input", () => resizeSchema(newWidth.value, newHeight.value));
newHeight.addEventListener("input", () => resizeSchema(newWidth.value, newHeight.value));

//Saving the picture
let saveButton = document.getElementById("save");
saveButton.addEventListener("click", () => {saveCanvas();})

//Function to resize the schema in amount of cells.
function resizeSchema(w, h) {
    amountCellsX = int(w);
    amountCellsY = int(h);
    dataSchema = populate(dataSchema);
    refreshDimensions();
    refreshScreen();
}

//Setup function.
function setup() {
    //Populate empty 2D array
    dataSchema = populate(dataSchema);
    //Create canvas.
    let cnv =createCanvas(windowWidth - 160, windowHeight - 160);
    //Prevent right click on the schema.
    cnv.elt.addEventListener("contextmenu", e => e.preventDefault());
    cnv.style('display', 'block');
    cnv.id("canvas");
    refreshDimensions();
    refreshScreen();
}

//The loop.
function draw() {
    drawGridFromScratch();
    hoverGrid();
    if(mouseIsPressed) {
        updateWhenMouse();
    }
}