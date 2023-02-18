'use strict'
var gCanvas;
var gCtx;
var gMeme;
let state;
let style;

function initCanvas(img) {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    gMeme = createMeme();
    var imgSize = renderCanvas();
    resizeCanvas(imgSize);
    var txts = gMeme.txts;
    locateLine();
    renderTxtLine(txts);
    console.log(gMeme);
  }

  function getCurrImg() {
    var currImg = loadFromStorage(IMG_KEY);
    return currImg;
}

function createMeme() {
    return {
        width: gCanvas.width,
        height: gCanvas.height,
        size: 30,
        align: 'left',
        color: '#ffffff',
        textShadowWhite: false,
        textShadowBlack: true,
        font: 'Impact',
        txts: [
            {
                line: '',
                order: 0,
                posX: 80,
                posY: 60
            }]
        }
}

  function renderCanvas() {
    var img = getCurrImg();
    var imgCanvas = new Image();
    imgCanvas.src = img.url;
    console.log(img);
    imgCanvas.onload = function () {
        drawCanvas(this);
        console.log(this);
        gMeme.txts.forEach(function (txt, idx) {
            renderTxt(txt, idx);
        })
    };
    return { width: imgCanvas.width, height: imgCanvas.height };
  }

  function resizeCanvas(imgSize) {
    gCanvas.width = 400;
    gCanvas.height = 400;
    var ratio = imgSize.width / imgSize.height;
    if (imgSize.width > imgSize.height) {
        if (imgSize.width > gCanvas.width) {
            imgSize.height = gCanvas.width * (1 / ratio);
            gCanvas.height = imgSize.height;
        } else {
            var widthRatio = gCanvas.width / imgSize.width;
            imgSize.width = gCanvas.width;
            imgSize.height *= widthRatio;
        }
    } else {
        if (imgSize.height > gCanvas.height) {
            gCanvas.height = gCanvas.width;
            imgSize.width = gCanvas.height * ratio;
            gCanvas.width = imgSize.width;
        } else {
            var heightRatio = gCanvas.height / imgSize.height;
            imgSize.height = gCanvas.height;
            imgSize.width *= heightRatio;
        }
    }
    gCtx.fillStyle = 'rgb(239, 245, 243)';
    gCtx.fillRect(0, 0, imgSize.width, imgSize.height);
    gMeme.width = imgSize.width;
    gMeme.height = imgSize.height;
}
  
  function renderGallery(imgs) {
    imgs = getImgsForDisplay();
    var strHtml = '';
    imgs.forEach(function (img, idx) {
      strHtml += `<img id="${img.id}" class="item-img" onclick="selectImg(this)" style="background-image: url('${img.url}')"></img>\n`
    });
    document.querySelector('.gallery').innerHTML = strHtml;
  }


  function renderTxtLine() {
      var strHtml = ``
      gMeme.txts.forEach(function (txt, idx) {
          strHtml +=  `<div class="flex line-btns">
              <input type="txt" class="inline" id="${txt.order}" placeholder="Enter your text" `
              console.log(txt.line);
          if (txt.value !== '') {
              strHtml += ` value="${txt.line}" `;
          }
              
          strHtml += 
              `oninput="onTxtInsert(this)" onkeyup="handleKey(event)" autofocus>
              <div class="line-btns-container flex space-around align-center">
                  <button class="btn btn-danger" onclick="onDeleteLine(${idx})"><i class="fa fa-trash"></i></button>
                  <div class="flex arrows">
                      <button id="${txt.order}" class="btn left" onclick="moveLine(this, 'left')"><i class="fas fa-arrow-left"></i></button>
                      <button id="${txt.order}" class="btn up" onclick="moveLine(this, 'up')"><i class="fas fa-arrow-up"></i></button>
                      <button id="${txt.order}" class="btn down" onclick="moveLine(this, 'down')"><i class="fas fa-arrow-down"></i></button>
                      <button id="${txt.order}" class="btn right" onclick="moveLine(this, 'right')"><i class="fas fa-arrow-right"></i></button>
                  </div>
              </div>
          </div>`;
      })
      document.querySelector('.line-text').innerHTML = strHtml;
  }

function renderTxt(txt, idx) {
    var x = txt.posX;
    var y = txt.posY;
    var txtSize = `${gMeme.size}px`;
    var fontSize = `${gMeme.size}px`;
    var txtFont = gMeme.font;
    if (gCanvas.getContext) {
        gCtx.font = `${txtSize} ${txtFont}`;
        gCtx.font = `${fontSize} ${txtFont}`;  
        var currColor = gMeme.color
        gCtx.fillStyle = currColor;
        var shadowColor = '#000000';
        if (gMeme.textShadowBlack === false) {
            if (gMeme.textShadowWhite === true) {
                shadowColor = '#ffffff';
            } else shadowColor = null;  
        }
        gCtx.strokeStyle = shadowColor;
        gCtx.strokeText(txt.line,x, y);
        gCtx.fillText(txt.line, x, y);
        gCtx.save();
    }
}
  
function filterImgs(imgs) {
    var userSearch = document.getElementById('search').value;
    if (userSearch === '') return imgs;
    else return imgs.filter(function (img) {
        return img.keywords.some(function (keyword) {
            return keyword.substring(0, userSearch.length) === userSearch;
        });
    });
}
function showGallery() {
    var elAbout = document.querySelector('.about-me');
    elAbout.classList.add('hide');
    var elGallery = document.querySelector('.gallery');
    elGallery.classList.remove('hide');
    var elSearch = document.querySelector('.filter');
    elSearch.classList.remove('hide');
    var elCanvas = document.querySelector('.container-canvas-page');
    elCanvas.classList.add('hide');
    addActiveOnLink('.gallery-link');
    removeActiveOnLink('.about-link');
}
function showAbout() {
    var elAbout = document.querySelector('.about-me');
    elAbout.classList.remove('hide');
    var elGallery = document.querySelector('.gallery');
    elGallery.classList.add('hide');
    var elSearch = document.querySelector('.filter');
    elSearch.classList.add('hide');
    var elCanvas = document.querySelector('.container-canvas-page');
    elCanvas.classList.add('hide');
    addActiveOnLink('.about-link');
    removeActiveOnLink('.gallery-link');
}

function showCanvas() {
    var elCanvas = document.querySelector('.container-canvas-page');
    elCanvas.classList.remove('hide');
    var elGallery = document.querySelector('.gallery');
    elGallery.classList.add('hide');
    var elSearch = document.querySelector('.filter');
    elSearch.classList.remove('hide');
    var elAbout = document.querySelector('.about-me');
    elAbout.classList.add('hide');
    removeActiveOnLink('.gallery-link');
    removeActiveOnLink('.about-link');
    
}

function onTxtInsert(elLine) {
    if (elLine.value) {
        var idx = elLine.id;
        gMeme.txts[idx].line = elLine.value;
        var txt = getTxtById(+idx)
        renderCanvas();
    } 
}

function onChangeSize(diff) {
    gMeme.size += (diff * 3);
    renderCanvas();
}

function onChangeColor() {
    var elInputColor = document.querySelector('#colorValue').value;
    gMeme.color = elInputColor;
    renderCanvas();  
}

function changeFont() {
    var elFont = document.querySelector('.select-font').value;
        gMeme.font = elFont; 
    renderCanvas();  
}


function moveLine(elLine, pos) {
    var id = elLine.id;

    var x = gMeme.txts[id].posX;
    var y = gMeme.txts[id].posY;
    if (pos === 'up') {
        y -= 15; 
        gMeme.txts[id].posY = y;
    }
    if (pos === 'down') {
        y += 15; 
        gMeme.txts[id].posY = y;
    }
    if (pos === 'right') {
        x += 15; 
        gMeme.txts[id].posX = x;
    }
    if (pos === 'left') {
        x -= 15;
        gMeme.txts[id].posX = x;
    } 
    renderCanvas();

}

function saveCurrImg(img) {
    saveToStorage(IMG_KEY, img);
    }

//download
function downloadImg(elImg) {
    var currImg = gCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    elImg.href = currImg;
}

function onDeleteLine(id) {
    gMeme.txts[id].line = '';
    renderCanvas();
    renderTxtLine();
}

function handleKey(ev) {
    if (ev.key === 'Backspace') renderCanvas();
}


function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gMeme = createMeme();
}

function addActiveOnLink(className) {
    var elLink = document.querySelector(className);
    elLink.classList.add('active');
}

function removeActiveOnLink(className) {
    var elLink = document.querySelector(className);
    elLink.classList.remove('active');
}

function addClassBlockBtn() {
    var elAddBtn = document.querySelector('.add-line-btn');
    elAddBtn.classList.add('block-btn');
    elAddBtn.style.color = 'red';
}






