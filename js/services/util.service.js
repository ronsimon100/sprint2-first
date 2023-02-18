'use strict'

function makeId(length=6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function shareOnFacebook() {
    const imgDataUrl = gCanvas.toDataURL('image/jpeg') 
  
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log(encodedUploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    // Send the image to the server
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