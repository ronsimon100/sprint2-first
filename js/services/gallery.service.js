'use strict'

var gImgs = [
    {id: makeId(), url: './img/1.jpg', keywords: ['Trump']},
    {id: makeId(), url: './img/2.jpg', keywords: ['Dogs']},
    {id: makeId(), url: './img/3.jpg', keywords: ['Babe sleep']},
    {id: makeId(), url: './img/4.jpg', keywords: ['cat']},
    {id: makeId(), url: './img/5.jpg', keywords: ['winning babe']},
    {id: makeId(), url: './img/6.jpg', keywords: ['history channel']},
    {id: makeId(), url: './img/7.jpg', keywords: ['baby suprised']},
    {id: makeId(), url: './img/8.jpg', keywords: ['purple jacket']},
    {id: makeId(), url: './img/9.jpg', keywords: ['nasty babe']},
    {id: makeId(), url: './img/10.jpg', keywords: ['obama']},
    {id: makeId(), url: './img/11.jpg', keywords: ['paul pierce']},
    {id: makeId(), url: './img/12.jpg', keywords: ['yazata zadik']},
    {id: makeId(), url: './img/13.jpg', keywords: ['de caprio']},
    {id: makeId(), url: './img/14.jpg', keywords: ['matrix']},
    {id: makeId(), url: './img/15.jpg', keywords: ['lord of the rings']},
    {id: makeId(), url: './img/16.jpg', keywords: ['x man']},
    {id: makeId(), url: './img/17.jpg', keywords: ['putin']},
    {id: makeId(), url: './img/18.jpg', keywords: ['toy story']}
]; 
    

var IMG_KEY = 'currImg';

function init() {
    renderGallery(gImgs);
}

function toggleHoverGalleryNav() {
    var elGalleryLink = document.querySelector('.gallery-link-a');
    elGalleryLink.classList.toggle('gallery-link-hover');
}

function searchImg() {
    renderGallery();
}

function getImgsForDisplay() {
    var imgs = [];
    imgs = filterImgs(gImgs)
    return imgs;
}

function backToGallery() {
    showGallery();
    gMeme.txts.forEach(function (txt) {
        txt.line = '';
        })
}

function selectImg(elImg) {
    localStorage.clear();
    var imgId = elImg.id;
    var img = findItemById(imgId);
    showCanvas();
    saveCurrImg(img);
    initCanvas(img);
}



function findItemById(imgId) {
    for (var i = 0; i < gImgs.length; i++) {
        var img = gImgs[i];
        if (img.id === imgId) {
            return img;
        }
    }
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = function (event) {
        let img = new Image() 
        img.src = event.target.result 
        img.onload = onImageReady.bind(null, img)
    
    }
    reader.readAsDataURL(ev.target.files[0]) 
}


