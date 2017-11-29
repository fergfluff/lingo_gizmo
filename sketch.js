//Random todos

//Change "code" variable
//Why don't key presses work
//Do I need "no sound" feedback on the screen for the user?
//Talk to Aaron about re-edit (again) files to be mmm instead of mah
//Rerecord vah and eng to become ing
//Replace dtha with TAH!
//Design look of page!


//Aaarons code
let currentKey = null;

//VARIABLES FOR SERIAL IN P5 SKETCH
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here

//VARIABLES FOR PHONEMES
//MOUTH SENSORS 0 AND 1
let mouthOpenSensors = ['aeh', 'ahh', 'oahhh', 'uhh', 'hah', 'yah'];
let mouthOpenIndex = 0;
let mouthOpenSounds = [];

let mouthHalfwaySensors = ['ehh', 'ee', 'uouhh', 'er', 'aiy', 'aehh', 'ooo'];
let mouthHalfwayIndex = 0;
let mouthHalfwaySounds = [];

let mouthClosedSensors = ['mah', 'pah', 'bah', 'wah'];
let mouthClosedIndex = 0;
let mouthClosedSounds = [];

//TEETH SENSOR 3 = PINCHING TOP OF TEETH = CONSONANTS
let teethSensors = ['vah', 'fah', 'rah'];
let teethIndex = 0;
let teethSounds = [];

//TONGUE SENSOR 4 = PRESSING TIP OF TONGUE = CONSONANTS
let tipTongueSensors = ['sah', 'zah', 'tha', 'lah'];
let tipTongueIndex = 0;
let tipTongueSounds = [];

//TONGUE SENSOR 5 = PRESSING MIDDLE OF TONGUE = CONSONANTS
let middleTongueSensors = ['nah', 'cha', 'tah', 'sha', 'zjyah', 'dah', 'juh'];
let middleTongueIndex = 0;
let middleTongueSounds = [];

//TONGUE SENSOR 6 = PRESSING BACK OF TONGUE = CONSONANTS
let backTongueSensors = ['kah', 'gah', 'eng'];
let backTongueIndex = 0;
let backTongueSounds = [];


//VARIABLES FOR BUILDING WORDS
let currentSyllable = "uhh";
let word = [];
let syllableArray;


//VARIABLES FOR RECEIVING SERIAL
var code;

//CODES
var arduinoToCodes = {
  //Order: mouthpressed, mouthclosed/mouthhalfway/mouthopen, teethpressed, tiptongue, middletongue, backtongue
  //No sounds
  '0,0,0,0,0,0': 90,
  '0,2,0,0,0,0': 88,
  '0,3,0,0,0,0': 67,
  //Sounds
  //Mouth closed
  '0,1,0,0,0,0': 65,
  //Mouth pressed and half way open
  '1,2,0,0,0,0': 83,
  //Mouth pressed and all the way open
  '1,3,0,0,0,0': 68,
  //Teeth
  '0,0,1,0,0,0': 70,
  //Tip of tongue
  '0,0,0,1,0,0': 71,
  //Middle of tongue
  '0,0,0,0,1,0': 72,
  //Back of tongue
  '0,0,0,0,0,1': 74,
}

var previousData;
var scheduled;
var previousSum = 0;


//PRELOAD MP3S USING ARRAYS
function preload() {
  for (let i = 0; i < mouthOpenSensors.length; i++) {
    mouthOpenSounds.push(loadSound("soundfiles/" + mouthOpenSensors[i] + ".mp3"));
  }
  for (let j = 0; j < mouthHalfwaySensors.length; j++) {
    mouthHalfwaySounds.push(loadSound("soundfiles/" + mouthHalfwaySensors[j] + ".mp3"));
  }
  for (let k = 0; k < mouthClosedSensors.length; k++) {
    mouthClosedSounds.push(loadSound("soundfiles/" + mouthClosedSensors[k] + ".mp3"));
  }
  for (let m = 0; m < teethSensors.length; m++) {
    teethSounds.push(loadSound("soundfiles/" + teethSensors[m] + ".mp3"));
  }
  for (let n = 0; n < tipTongueSensors.length; n++) {
    tipTongueSounds.push(loadSound("soundfiles/" + tipTongueSensors[n] + ".mp3"));
  }
  for (let o = 0; o < middleTongueSensors.length; o++) {
    middleTongueSounds.push(loadSound("soundfiles/" + middleTongueSensors[o] + ".mp3"));
  }
  for (let p = 0; p < backTongueSensors.length; p++) {
    backTongueSounds.push(loadSound("soundfiles/" + backTongueSensors[p] + ".mp3"));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  smooth(); // antialias drawing lines

  try {
    serial = new p5.SerialPort(); // make a new instance of the serialport library
    serial.on('list', printList); // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen); // callback for the port opening
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.on('close', portClose); // callback for the port closing

    serial.list(); // list the serial ports
    serial.open(portName); // open a serial port

    serial.write('x');
  }
  catch(err) {
    console.log("oops");
  }

}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

function serialEvent() {
  //Takes string from serial communication, logs that string to the console,
  //finds out if the data is more than 0 (if data is coming in), splits the dataset
  //by looking for values in between commas, stores those values into spots in arrays
  //if there are no sensors pressed, store that in old data to compare to new dataset
  //if there is data that's different than the old data and is more than 0/less than 6
  //clear the data first, then store the new data into old data, then match data
  //to codes written above, and then call the function below for each code/sensor combination
  //being pressed.
  var data = serial.readLine();
  console.log(data);
  if (data.length > 0) {
    var states = data.split(',');
    var sum = int(states[0]) + int(states[1]) + int(states[2]) + int(states[3]) + int(states[4]) + int(states[5] + int(states[6]));
    if (sum == 0) {
      previousSum = 0;
      previousData = data;
    } else if (data != previousData && sum > previousSum && sum < 6) {
      clearTimeout(scheduled);
      previousData = data;
      previousSum = sum;
      scheduled = setTimeout(function() {
        code = arduinoToCodes[data];
        playCode(code);
      }, 200);
    }
    serial.write('x'); // send a byte requesting more serial data
  }
}
//SHOW CURRENT PHONEME IN CENTER AND SHOW USER'S SELECTED SOUNDS
//TO BOTTOM OF SCREEN
function draw() {
  background(33, 58, 104);

  fill(5, 169, 198);
  textAlign(CENTER, CENTER);
  textSize(60);
  text('Make a Word', width / 2, 60);

  // Whatever the value of the
  // currentSyllable variable is,
  //show it in the center of canvas
  textSize(20);
  text('1. Add syllables to your word by', width / 2, 150);
  text('pressing the mouth, teeth and/or tongue', width / 2, 175);

  textSize(50);
  fill(7, 147, 9);
  text(currentSyllable, width / 2, 250);

  // textSize(20);
  // fill(5, 169, 198);
  // text('2. Press the space bar to save your syllables', width / 2, 320);
  //
  // textAlign(LEFT);
  // textSize(30);
  // text("Current word:", 70, 430)
  // text(word, 270, height - 70);

  // textSize(20);
  // text("TBD Button: Hear Your Word", 70, 480);
  // textSize(30);
  // text("Do you want to define your word,", 70, 540);
  // text("or save it for someone else to define?", 70, 570);
  // textSize(20);
  // text("TBD Button: Save Your Word ", 70, 620)
  // text("TBD Button: Define Your Word", 70, 640)
  //
  // textSize(30);
  // text("Do you have a meaning that needs a word?", 70, 690);
  // textSize(20);
  // text("TBD Button: Describe your meaning that needs a word", 70, 720)
  //
  // textSize(30);
  // text("View the most popular BRAND NEW words!", 70, 780);
  // textSize(20);
  // text("TBD Button: View Words", 70, 810)
}

//FUNCTIONS THAT ARE CALLED WHEN SENSORS ARE PRESSED

//This function is called when the mouthOpenSensor is triggered.
//Finds the next element in the mouth0Index by using an index pointer/counter
//and stores it into the currentSyllable variable which is GLOBAL so it can be used
//in other functions in my code.
function mouthOpenFunction() {
  print("Mouth Open!");
  let sound = mouthOpenSensors[mouthOpenIndex];
  //Takes created array of mouth0Sounds with the index counter's value
  //and plays that sound
  mouthOpenSounds[mouthOpenIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthOpenIndex++;
  if (mouthOpenIndex > mouthOpenSensors.length - 1) {
    mouthOpenIndex = 0;
  }
}

function mouthHalfwayFunction() {
  print("Mouth Halfway Open!");
  let sound = mouthHalfwaySensors[mouthHalfwayIndex];
  mouthHalfwaySounds[mouthHalfwayIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthHalfwayIndex++;
  if (mouthHalfwayIndex > mouthHalfwaySensors.length - 1) {
    mouthHalfwayIndex = 0;
  }
}

function mouthClosedFunction() {
  print("Mouth Closed!");
  let sound = mouthClosedSensors[mouthClosedIndex];
  mouthClosedSounds[mouthClosedIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthClosedIndex++;
  if (mouthClosedIndex > mouthClosedSensors.length - 1) {
    mouthClosedIndex = 0;
  }
}

function teethFunction() {
  print("Teeth Pinched!");
  let sound = teethSensors[teethIndex];
  teethSounds[teethIndex].play();
  currentSyllable = sound;
  print(sound);
  teethIndex++;
  if (teethIndex > teethSensors.length - 1) {
    teethIndex = 0;
  }
}

function tipTongueFunction() {
  print("Tip of tongue pressed!");
  let sound = tipTongueSensors[tipTongueIndex];
  tipTongueSounds[tipTongueIndex].play();
  currentSyllable = sound;
  print(sound);
  tipTongueIndex++;
  if (tipTongueIndex > tipTongueSensors.length - 1) {
    tipTongueIndex = 0;
  }
}

function middleTongueFunction() {
  print("Middle of tongue pressed!!");
  let sound = middleTongueSensors[middleTongueIndex];
  middleTongueSounds[middleTongueIndex].play();
  print(sound);
  currentSyllable = sound;
  middleTongueIndex++;
  if (middleTongueIndex > middleTongueSensors.length - 1) {
    middleTongueIndex = 0;
  }
}

function backTongueFunction() {
  print("Back of tongue pressed!!");
  let sound = backTongueSensors[backTongueIndex];
  backTongueSounds[backTongueIndex].play();
  print(sound);
  currentSyllable = sound;
  backTongueIndex++;
  if (backTongueIndex > backTongueSensors.length - 1) {
    backTongueIndex = 0;
  }
}

//NOT FULLY WRITTEN YET
//Enters the currentSyllable into a growing
//word at the bottom of the screen.
function enterFunction() {
  // save results:
  print("Save results");
  word += currentSyllable;
}
//Delete latest sound of word
//How will this work? Currently returns a null
function deleteFunction() {
  // Delete results:
  print("Delete results");
  word -= currentSyllable;
}
//Saves results to the server
//When is this called?
//How will I do this?
function saveFunction() {
  //Save results to "server"
  print("Save results");
}


//VARIABLES FOR ASSIGNING SERIAL DATA TO KEY BUTTONS
//GETS MAPPED DATA OF WHICH SENSOR COMBINATIONS EQUAL WHICH CODES BELOW,
//AND ASSIGNS THEM TO FUNCTIONS TO BE CALLED

function playCode(code) {
  print(code);

  //NO SOUNDS
  if (code === 90 || currentKey === 90) {
    //Key Z
    noSoundsFunction();
  }
  if (code === 88 || currentKey === 88) {
    //Key X
    noSoundsFunction();
  }
  if (code === 67 || currentKey === 67) {
    //Key C
    noSoundsFunction();
  }
  //SOUNDS
  if (code === 65 || currentKey == 65) {
    //Key a;
    mouthClosedFunction();
  }
  if (code === 83 || currentKey === 83) {
    //Key s;
    mouthHalfwayFunction();
  }
  if (code === 68 || currentKey === 68) {
    //Key d;
    mouthOpenFunction();
  }
  if (code === 70 || currentKey === 70) {
    //Key e;
    teethFunction();
  }
  if (code === 71 || currentKey === 71) {
    //Key f;
    tipTongueFunction();
  }
  if (code === 72 || currentKey === 72) {
    //Key g;
    middleTongueFunction();
  }
  if (code === 74 || currentKey === 74) {
    //Key h;
    backTongueFunction();
  }


  //NOT WRITTEN YET
  //Not written yet
  //When delete is pressed, clear the result
  if (code === 8 || currentKey === 8) {
    //Delete key
    deleteFunction();
  }
  //Not written yet
  //When Command button is pressed, save the result
  if (code === 91 || currentKey === 91) {
    //Command button
    saveFunction();
  }
}


function keyPressed() {
  console.log('hellloooo')

  currentKey = keyCode;

  //retrieve the value from keyCode and assign it to my own variable currentKey
  if (keyCode === 32) {
    //Space bar
    enterFunction();
  }

  //NO SOUNDS
  if (code === 90 || currentKey === 90) {
    //Key Z
    noSoundsFunction();
  }
  if (code === 88 || currentKey === 88) {
    //Key X
    noSoundsFunction();
  }
  if (code === 67 || currentKey === 67) {
    //Key C
    noSoundsFunction();

  }
  //SOUNDS
  if (currentKey === 65) {
    //Key a;
    mouthClosedFunction();
  }
  if (currentKey === 83) {
    //Key s;
    mouthHalfwayFunction();
  }
  if (currentKey === 68) {
    //Key d;
    mouthOpenFunction();
  }
  if (currentKey === 70) {
    //Key e;
    teethFunction();
  }
  if (currentKey === 71) {
    //Key f;
    tipTongueFunction();
  }
  if (currentKey === 72) {
    //Key g;
    middleTongueFunction();
  }
  if (currentKey === 74) {
    //Key h;
    backTongueFunction();
  }


  //NOT WRITTEN YET
  //Not written yet
  //When delete is pressed, clear the result
  if (currentKey === 8) {
    //Delete key
    deleteFunction();
  }
  //Not written yet
  //When Command button is pressed, save the result
  if (currentKey === 91) {
    //Command button
    saveFunction();
  }
}
