'use strict'

function locateLine() {
    var y;
    gMeme.txts.forEach(function (txt, idx) {
        if (idx === 0) y = 50;
        else if (idx === 1) y = gCanvas.height / 2;
        else y = gCanvas.height - 50;
        txt.posY = y;
    })
}

function drawCanvas(imgCanvas) {
    var x = 0;
    var y = 0;
    gCtx.drawImage(imgCanvas, x, y, gCanvas.width, gCanvas.height);
}
// make a default black and white fill and stoke
function txtShadow(color) {
    if (color === '#ffffff') {
        if (!gMeme.textShadowWhite) {
            gMeme.textShadowWhite = true;
        }
        else {
            gMeme.textShadowWhite = false;
        }
        gMeme.textShadowBlack = false;
        renderCanvas();
    } else if (color === '#000000') {
        if (!gMeme.textShadowBlack) {
            gMeme.textShadowBlack = true;
        }
        else {
            gMeme.textShadowBlack = false;
        }
        gMeme.textShadowWhite = false;
        renderCanvas();
    }
}

function txtAlign(alignValue) {
    if (alignValue === 'left') {
        gMeme.align = 'left';
    }
    if (alignValue === 'center') {
        gMeme.align = 'center';
    }
    if (alignValue === 'right') {
        gMeme.align = 'right';
    }

    updateRowPos();
}

function updateRowPos() {
    gMeme.txts.forEach(function (txt, idx) {
        if (gMeme.align === 'left') txt.posX = 10;
        if (gMeme.align === 'right') txt.posX = gCanvas.width - 80;
        if (gMeme.align === 'center') txt.posX = gCanvas.width / 2 - 40;
    })
    renderCanvas();  
}

function addLine() {
    if (gMeme.txts.length === 3) {
        addClassBlockBtn();
        return;
    }
    var nextId = 1;
    var posY = 250
    if (gMeme.txts.length === 2) {
        nextId = 2;                     
        posY = 400
    }
    var newLine = creatLine(nextId, posY);
    var txts = gMeme.txts;
    txts.push(newLine);
    locateLine();
    
    renderTxtLine(txts);
}

function creatLine(num, y) {
    return {
        line: '',
        order: num,
        posX: 80,
        posY: y
    }
}

function getTxtById(id) {
    for (var i = 0; i < gMeme.txts.length; i++) {
        var txt = gMeme.txts[i];
        if (txt.order === + id) {
            return txt;
        }
    }
}
