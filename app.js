const myVideo = document.getElementById("video")
var playingvideo = false;
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models')


   


]).then(document.getElementById("playbutton").disabled=false)
function getMyVideo(){
if(!playingvideo){
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video:true})
        .then(function(stream){
         
            myVideo.srcObject = stream
   
            
            
        })
        .catch(function(error){
            
            console.log(error);
        })
     } 
     playingvideo = true
}
else{
    alert("already plaing video");
}
}
function stopMyVideo(){
    if(playingvideo){
        var stream = myVideo.srcObject;
        var tracks = stream.getTracks();
        for(let i = 0;i<tracks.length;i++){
            var track = tracks[i];
            track.stop();
        }
        video.srcObject = null;
        playingvideo = false
    }
    else{
        alert("video not playing")
    }
}
myVideo.addEventListener("play",()=>{
    const displaySize = { width: myVideo.width, height: myVideo.height }
    
    const canvas = document.getElementById('overlay')
faceapi.matchDimensions(canvas, displaySize)

   faceapi.matchDimensions(canvas,displaySize)
    setInterval( async function(){
        const expression = await faceapi.detectAllFaces(myVideo, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
        console.log(expression)
        const resizedResults = faceapi.resizeResults(expression, displaySize)
       
       
   if(expression==null){
    var text = [
        'Gender',
        'Age'
      ]
   }
   else{
    var text = [
        expression[0].gender,
        Math.floor(expression[0].age)
      ]
   }
          const anchor = { x: 50, y: 200 }
          
          const drawOptions = {
            anchorPosition: 'TOP_LEFT',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
          const drawBox = new faceapi.draw.DrawTextField(text, anchor, drawOptions)


          
          
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawDetections(canvas, resizedResults)
        faceapi.draw.drawFaceLandmarks(canvas, resizedResults, { drawLines: true })
        faceapi.draw.drawFaceExpressions(canvas, resizedResults)
        drawBox.draw(canvas)
       
        
    }, 50);
})
