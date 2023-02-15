const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gCurrImage
let gLastPos = { x: null, y: null }
let gIsDrag
let gColor
let gLastDiff

function onInit() {
  gElCanvas = document.querySelector('#my-canvas')
  gCtx = gElCanvas.getContext('2d')
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const image = document.getElementById("source");

  image.addEventListener("load", (e) => {
    ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
  });
  resizeCanvas()

  addListeners()
  toggleInputs(true)
}

function setShape(shape) {
  gCurrShape = shape
}

function resizeCanvas() {
  const elContainer = document.querySelector('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function resizeImg(){
  const elContainer = document.querySelector('.canvas-container')
  gImage.width = elContainer.offsetWidth
  gImage.height = elContainer.offsetHeight
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()
  window.addEventListener('resize', () => {
    resizeCanvas()
    resizeImg()
  })
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', onDown)
  gElCanvas.addEventListener('mousemove', onMove)
  gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', onDown)
  gElCanvas.addEventListener('touchmove', onMove)
  gElCanvas.addEventListener('touchend', onUp)
}

function getEvPos(ev) {
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }

  if (TOUCH_EVS.includes(ev.type)) {
    
    ev.preventDefault()
    ev = ev.changedTouches[0]
    
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

function renderCanvas() {
  gCtx.fillStyle = '#ede5ff59'
  gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
  renderImg()
}

function onDown(ev) {
  console.log('Down')
  const pos = getEvPos(ev)
  gIsDrag = true
  document.body.style.cursor = 'grabbing'
  gLastPos = pos
}

function onMove(ev) {
  if (!gIsDrag) return
  const diff = Math.abs(ev.movementX) > Math.abs(ev.movementY) ? Math.abs(ev.movementX) : Math.abs(ev.movementY)
  let size = 10 * diff
  if (size > 100) size = 100
  if (size < 10) size = 10

  const pos = getEvPos(ev)
  const { x, y } = pos
  const color = gColor
  drawShape(x, y, size, color, diff)
  gLastPos = pos
  gLastDiff = diff
}

function onUp() {
  console.log('Up')
  gIsDrag = false
  document.body.style.cursor = 'grab'
}

function drawShape(x, y, size, color, diff) {
  switch (gCurrShape) {
    case 'triangle':
      drawTriangle(x, y, size, color)
      break
    case 'circle':
      drawArc(x, y, size, color)
      break
    case 'rect':
      drawRect(x, y, size, color)
      break
    case 'text':
      const { txt, font, fontSize } = getTxtInfo()
      drawText(x, y, fontSize, color, txt, font)
      break
    case 'line':
      drawLine(x, y, size, color, diff)
      break
  }
}

function drawArc(x, y, size = 60, color = 'blue') {
  gCtx.beginPath()
  gCtx.lineWidth = '6'
  gCtx.arc(x, y, size, 0, 2 * Math.PI)
  gCtx.strokeStyle = 'white'
  gCtx.stroke()
  gCtx.fillStyle = color
  gCtx.fill()
}

function drawRect(x, y, size, color) {
  gCtx.strokeStyle = 'black'
  gCtx.strokeRect(x, y, size, size)
  gCtx.fillStyle = color
  gCtx.fillRect(x, y, size, size)
}

function drawImg(x, y, size, color, txt, font) {
  gCtx.lineWidth = 1
  gCtx.strokeStyle = 'brown'
  gCtx.fillStyle = color
  gCtx.font = `${size}px ${font}`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'middle'

  gCtx.fillText(txt, x, y) 
  gCtx.strokeText(txt, x, y) 
}

function drawTriangle(x, y, size, color) {
  gCtx.beginPath()

  gCtx.moveTo(x, y) 
  gCtx.lineTo(x + size, y + size) 
  gCtx.lineTo(x - size, y + size)
 
  gCtx.closePath()
  gCtx.strokeStyle = 'blue' 
  gCtx.stroke() 
  gCtx.fillStyle = color 
  gCtx.fill() 
}

function drawLine(x, y, size, color, diff) {
  if (diff === gLastDiff) gCtx.beginPath()
  const x1 = gLastPos.x
  const y1 = gLastPos.y
  gCtx.moveTo(x, y)
  gCtx.lineTo(x1, y1)

  gCtx.lineWidth = size / 15
  gCtx.strokeStyle = color
  gCtx.stroke()
}

function getTxtInfo() {
  const txt = document.querySelector('.txt').value
  const font = document.querySelector('.font').value
  const fontSize = document.querySelector('.font-size').value
  return { txt, fontSize, font }
}

function changeColor(color) {
  gColor = color
}

function toggleInputs(isHidden) {
  document.querySelector('.txt-inputs-container').hidden = isHidden
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function downloadCanvas(elLink) {
  const data = gElCanvas.toDataURL() 
  
  elLink.href = data 
  elLink.download = 'my-img' 
}

function onUploadImg() {
  const imgDataUrl = gElCanvas.toDataURL('image/jpeg') 

  function onSuccess(uploadedImgUrl) {

    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    console.log(encodedUploadedImgUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
  }
  doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData()
  formData.append('img', imgDataUrl)
  const XHR = new XMLHttpRequest()
  XHR.onreadystatechange = () => {
    if (XHR.readyState !== XMLHttpRequest.DONE) return
    if (XHR.status !== 200) return console.error('Error uploading image')
    const { responseText: url } = XHR
    console.log('Got back live url:', url)
    onSuccess(url)
  }
  XHR.onerror = (req, ev) => {
    console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
  }
  XHR.open('POST', '//ca-upload.com/here/upload.php')
  XHR.send(formData)
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

function renderImg(img) {
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

