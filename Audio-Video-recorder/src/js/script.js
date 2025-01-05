// ###################################################################
// 							AUDIO RECORDER  - START 
// ###################################################################
const record = document.querySelector('.record')
const stop = document.querySelector('.stop')
const soundClips = document.querySelector('.sound-clips')
const canvas = document.querySelector('.visualizer')
const mainSection = document.querySelector('.main-controls')
const save = document.querySelector('.save')
const filterButton = document.querySelector('.filter')
const changeLevelsButton = document.querySelector('.change-levels')
//Audio recorder 
// disable stop button while not recording
stop.disabled = true
let chunks = []
// visualiser setup - create web audio api context and canvas
let audioCtx
const canvasCtx = canvas.getContext('2d')

//main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {
	console.log('getUserMedia supported.')

	const constraints = { audio: true }
	let chunks = []

	let onSuccess = function (stream) {
		const mediaRecorder = new MediaRecorder(stream)

		visualize(stream)

		record.onclick = function () {
			mediaRecorder.start()
			console.log(mediaRecorder.state)
			console.log('recorder started')
			record.style.background = 'red'

			stop.disabled = false
			record.disabled = true
		}

		stop.onclick = function () {
			mediaRecorder.stop()
			console.log(mediaRecorder.state)
			console.log('recorder stopped')
			record.style.background = ''
			record.style.color = ''
			// mediaRecorder.requestData();
			stop.disabled = true
			record.disabled = false
		}

		mediaRecorder.onstop = function (e) {
			console.log('data available after MediaRecorder.stop() called.')
			const clipName = prompt('Nazwij plik audio', '')
			const clipContainer = document.createElement('article')
			const clipLabel = document.createElement('p')
			const audio = document.createElement('audio')
			const deleteButton = document.createElement('button')
			const downloadButton = document.createElement('button')

			clipContainer.classList.add('clip')
			audio.setAttribute('controls', '')
			deleteButton.textContent = 'Delete'
			deleteButton.className = 'delete'
			downloadButton.textContent = 'Download'
			downloadButton.className = 'download'

			if (clipName === null) {
				clipLabel.textContent = ''
			} else {
				clipLabel.textContent = 'audio'
			}

			clipContainer.appendChild(audio)
			clipContainer.appendChild(clipLabel)
			clipContainer.appendChild(deleteButton)
			clipContainer.appendChild(downloadButton)
			soundClips.appendChild(clipContainer)

			audio.controls = true
			const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
			chunks = []
			const audioURL = window.URL.createObjectURL(blob)
			audio.src = audioURL
			console.log('recorder stopped')

			deleteButton.onclick = function (e) {
				e.target.closest('.clip').remove()
			}

			clipLabel.onclick = function () {
				const existingName = clipLabel.textContent
				const newClipName = prompt('Podaj nowa nazwę pliku audio')
				if (newClipName === null) {
					clipLabel.textContent = existingName
				} else {
					clipLabel.textContent = newClipName
				}
			}

			downloadButton.onclick = function () {
				const url = window.URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.style.display = 'none'
				a.href = url
				a.download = clipName + '.ogg'
				document.body.appendChild(a)
				a.click()
				setTimeout(() => {
					document.body.removeChild(a)
					window.URL.revokeObjectURL(url)
				}, 100)
			}
		}

		mediaRecorder.ondataavailable = function (e) {
			chunks.push(e.data)
		}
	}

	let onError = function (err) {
		console.log('The following error occured: ' + err)
	}
	navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError)
} else {
	console.log('getUserMedia not supported on your browser!')
}

function visualize(stream) {
	if (!audioCtx) {
		audioCtx = new AudioContext()
	}

	const source = audioCtx.createMediaStreamSource(stream)
	const analyser = audioCtx.createAnalyser()
	analyser.fftSize = 2048
	const bufferLength = analyser.frequencyBinCount
	const dataArray = new Uint8Array(bufferLength)

	source.connect(analyser)
	//analyser.connect(audioCtx.destination);

	draw()
	function draw() {
		const WIDTH = canvas.width
		const HEIGHT = canvas.height

		requestAnimationFrame(draw)
		analyser.getByteTimeDomainData(dataArray)
		canvasCtx.fillStyle = 'rgb(200, 200, 200)'
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)
		canvasCtx.lineWidth = 2
		canvasCtx.strokeStyle = 'rgb(0, 0, 0)'
		canvasCtx.beginPath()

		let sliceWidth = (WIDTH * 1.0) / bufferLength
		let x = 0
		for (let i = 0; i < bufferLength; i++) {
			let v = dataArray[i] / 128.0
			let y = (v * HEIGHT) / 2

			if (i === 0) {
				canvasCtx.moveTo(x, y)
			} else {
				canvasCtx.lineTo(x, y)
			}
			x += sliceWidth
		}
		canvasCtx.lineTo(canvas.width, canvas.height / 2)
		canvasCtx.stroke()
	}
	function applyFilter() {
		// apply audio filter to the last recorded clip
		const clips = document.querySelectorAll('.clip')
		const lastClip = clips[clips.length - 1]
		const audio = lastClip.querySelector('audio')
		const source = audioCtx.createMediaElementSource(audio)
		const filter = audioCtx.createBiquadFilter()
		filter.type = 'lowpass'
		filter.frequency.value = 1000
		source.connect(filter)
		filter.connect(audioCtx.destination)
	}
	function changeLevels() {
		// change audio levels of the last recorded clip
		const clips = document.querySelectorAll('.clip')
		const lastClip = clips[clips.length - 1]
		const audio = lastClip.querySelector('audio')
		const source = audioCtx.createMediaElementSource(audio)
		const gainNode = audioCtx.createGain()
		gainNode.gain.value = 220
		source.connect(gainNode)
		gainNode.connect(audioCtx.destination)
	}
	filterButton.addEventListener('click', applyFilter)
	changeLevelsButton.addEventListener('click', changeLevels)
}
window.onresize = function () {
	canvas.width = mainSection.offsetWidth
}
window.onresize()
// ###################################################################
// 							AUDIO RECORDER  - END 
// ###################################################################


// ###################################################################
// 							VIDEO RECORDER  - START 
// ###################################################################
let mediaRecorder;
let recordedBlobs;


const codecPreferences = document.querySelector('#codecPreferences');

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
    codecPreferences.disabled = false;
  }
});

const playButton = document.querySelector('button#play');
playButton.addEventListener('click', () => {
  const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value.split(';', 1)[0];
  const superBuffer = new Blob(recordedBlobs, {type: mimeType});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});

const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=av1,opus',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/mp4;codecs=h264,aac',
  ];
  return possibleTypes.filter(mimeType => {
    return MediaRecorder.isTypeSupported(mimeType);
  });
}

function startRecording() {
  recordedBlobs = [];
  const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value;
  const options = {mimeType};

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  codecPreferences.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;

  getSupportedMimeTypes().forEach(mimeType => {
    const option = document.createElement('option');
    option.value = mimeType;
    option.innerText = option.value;
    codecPreferences.appendChild(option);
  });
  codecPreferences.disabled = false;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  document.querySelector('button#start').disabled = true;
  const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
  const constraints = {
    audio: {
      echoCancellation: {exact: hasEchoCancellation}
    },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
});

/*const processor = {
		timerCallback() {
		  if (this.video.paused || this.video.ended) {
			return;
		  }
		  this.computeFrame();
		  setTimeout(() => {
			this.timerCallback();
		  }, 16); // roughly 60 frames per second
		},
	  
		doLoad() {
		  this.video = recordedVideo;
		  this.c1 = document.getElementById("my-canvas");
		  this.ctx1 = this.c1.getContext("2d");
	  
		  this.video.addEventListener(
			"play",
			() => {
			  this.width = 1280;
			  this.height = 720;
			  this.timerCallback();
			},
			false
		  );
		},
	  
		computeFrame() {
		  this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
		  const frame = this.ctx1.getImageData(0, 0, this.width, this.height);
		  const l = frame.data.length / 4;
	  
		  for (let i = 0; i < l; i++) {
			const grey =
			  (frame.data[i * 4 + 0] +
				frame.data[i * 4 + 1] +
				frame.data[i * 4 + 2]) /
			  3;
	  
			frame.data[i * 4 + 0] = grey;
			frame.data[i * 4 + 1] = grey;
			frame.data[i * 4 + 2] = grey;
		  }
		  this.ctx1.putImageData(frame, 0, 0);
	  
		  return;
		},
	  }; */


var filter1 = document.getElementById('filter1');
var clicked1 = false;
var currentFilters;
var grayscale = "0";
var contrast = "100";
var saturation = "100";
var brightness = "100";
var invert = "0";
var filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
filter1.addEventListener('click', () => {
	currentFilters = recordedVideo.style.webkitFilter;
	if(clicked1) {
		grayscale = "0";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.filter = filterString; 
		filter1.textContent = "Add Grayscale";
		clicked1 = false;
	}
	else {
		grayscale = "100";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.filter = filterString;
		filter1.textContent = "Remove Grayscale";
		clicked1 = true;
	}
	//processor.doLoad();
});

var filter2 = document.getElementById('filter2');
var clicked2 = false;
filter2.addEventListener('click', () => {
	currentFilters = recordedVideo.style.webkitFilter;
	if(clicked2) {
		contrast = "100";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.webkitFilter = filterString;
		filter2.textContent = "Add Contrast";
		clicked2 = false;
	}
	else {
		contrast = "80";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.webkitFilter = filterString;
		filter2.textContent = "Remove Contrast";
		clicked2 = true;
	}
});

var filter3 = document.getElementById('filter3');
var clicked3 = false;
filter3.addEventListener('click', () => {
	currentFilters = recordedVideo.style.webkitFilter;
	if(clicked3) {
		saturation = "100";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.webkitFilter = filterString;
		filter3.textContent = "Add Saturation";
		clicked3 = false;
	}
	else {
		saturation = "130";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.webkitFilter = filterString;
		filter3.textContent = "Remove Saturation";
		clicked3 = true;
	}
});

var filter4 = document.getElementById('filter4');
var clicked4 = false;
filter4.addEventListener('click', () => {
	currentFilters = recordedVideo.style.webkitFilter;
	if(clicked4) {
		brightness = "100";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.webkitFilter = filterString;
		filter4.textContent = "Add Brightness";
		clicked4 = false;
	}
	else {
		brightness = "120";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.webkitFilter = filterString;
		filter4.textContent = "Remove Brightness";
		clicked4 = true;
	}
});

var filter5 = document.getElementById('filter5');
var clicked5 = false;
filter5.addEventListener('click', () => {
	currentFilters = recordedVideo.style.webkitFilter;
	if(clicked5) {
		invert = "0";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.webkitFilter = filterString;
		filter5.textContent = "Add Invertion";
		clicked5 = false;
	}
	else {
		invert = "100";
		filterString = "grayscale("+grayscale+"%) "+"contrast("+contrast+"%) "+"saturate("+saturation+"%) "+"brightness("+brightness+"%) "+"invert("+invert+"%)";
		recordedVideo.style.webkitFilter = filterString;
		filter5.textContent = "Remove Invertion";
		clicked5 = true;
	}
});
// ###################################################################
// 							VIDEO RECORDER  - END 
// ###################################################################