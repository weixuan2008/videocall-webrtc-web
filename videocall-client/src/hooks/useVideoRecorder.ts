import { blobToFile, saveFile } from "@/utils/fileUtils";
import html2canvas from "@/utils/Canvas/html2canvas";

type Options = {
  background?: string;
  audioTracks?: MediaStreamTrack[];
}

function useVideoRecorder(el: HTMLElement, options?: Options) {
  const { background, audioTracks } = options || {}
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let animationFrameId = null
  animationFrameId = requestAnimationFrame(function createCanvas() {
    animationFrameId = requestAnimationFrame(createCanvas)
    const htmlCanvas = html2canvas(el)
    const { width, height } = htmlCanvas
    canvas.width = width
    canvas.height = height
    ctx.save()
    if (background) {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, width, height)
    }
    ctx.drawImage(htmlCanvas, 0, 0, width, height)
    ctx.restore()
  })

  const stream = canvas.captureStream(25);
  if (audioTracks) {
    audioTracks.forEach(t => stream.addTrack(t))
  }
  // const recorderOptions = {
  //   audioBitsPerSecond : 128000,
  //   videoBitsPerSecond : 2500000,
  //   mimeType : 'video/mp4'
  // }
  const recorder = new MediaRecorder(stream);

  // 创建一个 Date 对象
var today = new Date();
 
// 获取年、月、日、时、分、秒
var year = today.getFullYear();
var month = today.getMonth() + 1; // 月份是从 0 开始计数的，需要加1
var day = today.getDate();
var hours = today.getHours();
var minutes = today.getMinutes();
var seconds = today.getSeconds();
var millseconds = today.getMilliseconds();

var formattedTime = year + "-" + 
                   (month < 10 ? "0" : "") + month + "-" + 
                   (day < 10 ? "0" : "") + day + "_" + 
                   (hours < 10 ? "0" : "") + hours + "_" + 
                   (minutes < 10 ? "0" : "") + minutes + "_" + 
                   (seconds < 10 ? "0" : "") + seconds + "_" + 
                   millseconds;

var file_name = 'Videl_call_record_'+ formattedTime;

  let chunks: Blob[] = []
  recorder.onstop = function() {
    cancelAnimationFrame(animationFrameId)
    const blob = new Blob(chunks, { type: 'video/mp4' });
    saveFile(blobToFile(blob, file_name))
    chunks = []
  }

  recorder.ondataavailable = function(e) {
    chunks.push(e.data);
  }

  recorder.start();

  return recorder;
}

export default useVideoRecorder;