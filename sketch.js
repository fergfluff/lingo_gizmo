//Random todos

//Figure out how to send new Arduino data to this code
//Talk to Aaron about re-edit (again) files to be mmm instead of mah
//Rerecord vah and eng to become ing
//Change "code" variable


//VARIABLES FOR SERIAL IN P5 SKETCH
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem120'; // fill in your serial port name here


//VARIABLES FOR WORDS AND MP3S ASSOCIATED WITH SOUNDS

//? HOW DO I SEPARATE FIRST TWO INTO DIFFERENT READINGS
//create variables for sensors to store data in
let mouth0Sensor;
let mouth1Sensor;
let openSensor;
let halfwaySensor;


//specify separate data variables if mouth1 sensor is greater or lesser than X
//Is this the best way to do it? Syntax?
if (mouth1Sensor > x); {
  mouth1Sensor = 1;
  mouth1Sensor = openSensor;
}
else (mouth1Sensor < x); {
  mouth1Sensor = 1;
  mouth1Sensor = halfwaySensor;
}

//FIRST INTERACTION = LOW VOWELS
//0) PRESS BOTTOM OF MOUTH SENSOR 0
//1) WITH MOUTH SENSOR 1 OPEN ALL THE WAY

//If mouth0sensor is true, and mouthOpen is true, store that in a new variable
// ? How to write this syntax?
if (mouth0Sensor && openSensor); {
  mouthOpenSensors = ???True;
}
let mouthOpenSensors = ['aeh', 'ahh', 'oahhh', 'uhh', 'hah', 'yah'];
let mouthOpenIndex = 0;
let mouthOpenSounds = [];

//SECOND INTERACTION = HIGH VOWELS
//0) PRESS BOTTOM OF MOUTH SENSOR 0
//1) WITH MOUTH SENSOR 1 HALF-WAY OPEN
if (mouth0Sensor && halfwaySensor); {
  mouthHalfwaySensors = ???True;
}
let mouthHalfwaySensors = ['ehh', 'ee', 'uouhh', 'er', 'aiy', 'aehh', 'ooo'];
let mouthHalfwayIndex = 0;
let mouthHalfwaySounds = [];

//THIRD INTERACTION = CONSONANTS
//1 AND 2) WHEN MOUTH SENSORS 1 AND 2 ARE BOTH PRESSED
//TO CLOSE THE LIPS OF THE MOUTH
let mouthClosedSensors = ['mah', 'pah', 'bah', 'wah'];
let mouthClosedIndex = 0;
let mouthClosedSounds = [];

//TEETH SENSOR 3 = PINCHING TOP OF TEETH = CONSONANTS
let teeth3Sensors = ['vah', 'fah', 'rah'];
let teeth3Index = 0;
let teeth3Sounds = [];

//TONGUE SENSOR 4 = PRESSING TIP OF TONGUE = CONSONANTS
let tongue4Sensors = ['sah', 'zah','tha','lah'];
let tongue4Index = 0;
let tongue4Sounds = [];

//TONGUE SENSOR 5 = PRESSING MIDDLE OF TONGUE = CONSONANTS
let tongue5Sensors = ['nah', 'cha','tah','sha', 'zjyah', 'dah', 'juh'];
let tongue5Index = 0;
let tongue5Sounds = [];

//TONGUE SENSOR 6 = PRESSING BACK OF TONGUE = CONSONANTS
let tongue6Sensors = ['kah', 'gah', 'ing'];
let tongue6Index = 0;
let tongue6Sounds = [];


//VARIABLES FOR BUILDING WORDS
let currentSyllable = "uhh";
let word = [];
let syllableArray;


//VARIABLES FOR RECEIVING SERIAL
var code;

//SEE BELOW FOR OLD CODE BASED ON OLD sensors
//NEW CODES
var arduinoToCodes = {
  '1,0,0,0,0,0': 65,
  //How do I receive and parse the same data for open and halfway open mouth?
  '1,1,0,0,0,0': 83,
  '1,1,0,0,0,0': 68,
  //
  '0,0,1,0,0,0': 70,
  '0,0,0,1,0,0': 71,
  '0,0,0,0,1,0': 72,
  '0,0,0,0,0,1': 74,

  //what combinations equal no sounds?
  
  //Order: mouthpressed, mouthclosed/mouthhalfway/mouthopen, teethpressed, tiptongue, middletongue, backtongue
  // '0,1,0,0,0,0' = no sound until mouth is closed all the way = TBD KEY /65
  // '1,1,0,0,0,0': 68 == no one will try this?
  // '0,2,0,0,0,0' = no sound without pressing mouth = TBD KEY
  // '0,3,0,0,0,0' = no sound without pressing mouth = TBD KEY
  // '1,2,0,0,0,0': 83 = high vowels
  // '1,3,0,0,0,0': 83 = low vowels
  // '0,0,1,0,0,0': 70 = teeth
  // '0,0,0,1,0,0': 71  = tip of tongue
  // '0,0,0,0,1,0': 72 = middle of tongue
  // '0,0,0,0,0,1': 74 = back of tongue
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
  for (let m = 0; m < teeth3Sensors.length; m++) {
    teeth3SensorsSounds.push(loadSound("soundfiles/" + teeth3Sensors[m] + ".mp3"));
  }
  for (let n = 0; n < tongue4Sensors.length; n++) {
    tongue4Sounds.push(loadSound("soundfiles/" + tongue4Sensors[n] + ".mp3"));
  }
  for (let o = 0; o < tongue5Sensors.length; o++) {
    tongue5Sounds.push(loadSound("soundfiles/" + tongue5Sensors[o] + ".mp3"));
  }
  for (let p = 0; p < tongue6Sensors.length; p++) {
    tongue6Sounds.push(loadSound("soundfiles/" + tongue6Sensors[p] + ".mp3"));
  }
}

function setup() {
	createCanvas(windowWidth, windowHeight);

  smooth(); // antialias drawing lines

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
  console.log("helloooo");

  var data = serial.readLine();
  console.log(data);

  if (data.length > 0) {

    var states = data.split(',');
    //DO I STILL NEED THIS IF THE USER DOESN'T  COMBINE SENSORS?
    var sum = int(states[0]) + int(states[1]) + int(states[2]);

    if (sum == 0) {
      previousSum = 0;
      previousData = data;
    } else if (data != previousData && sum > previousSum && sum < 3) {
      clearTimeout(scheduled);
      previousData = data;
      previousSum = sum;
      scheduled = setTimeout(function() {
        code = arduinoToCodes[data];
        playCode(code);
        console.log('hellooo');
        //playCode(data);
      }, 200);
    }

    serial.write('x'); // send a byte requesting more serial data
  }
}
//DRAW CURRENT SOUND IN CENTER AND DRAW SELECTED SOUNDS
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

  textSize(20);
  fill(5, 169, 198);
  text('2. Press the space bar to save your syllables', width / 2, 320);

  textAlign(LEFT);
  textSize(30);
  text("Current word:", 70, 430)
  text(word, 270, height - 70);

  textSize(20);
  text("TBD Button: Hear Your Word", 70, 480);
  textSize(30);
  text("Do you want to define your word,", 70, 540);
  text("or save it for someone else to define?", 70, 570);
  textSize(20);
  text("TBD Button: Save Your Word ", 70, 620)
  text("TBD Button: Define Your Word", 70, 640)

  textSize(30);
  text("Do you have a meaning that needs a word?", 70, 690);
	textSize(20);
  text("TBD Button: Describe your meaning that needs a word", 70, 720)

  textSize(30);
  text("View the most popular BRAND NEW words!", 70, 780);
  textSize(20);
  text("TBD Button: View Words", 70, 810)

}

//FUNCTIONS THAT ARE CALLED WHEN SENSORS ARE PRESSED

//Called when the mouth0Sensor is pressed.
//Finds the next element in the mouth0Index
//by using an index pointer/counter
//and stores it into the currentSyllable
//variable which is GLOBAL so it can be used
//in other functions in my code
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
//No need for teeth or tongue sounds
function mouthHalfwayFunction() {
  print("Mouth Halfway Open!");
  let sound = mouthHalfwaySensors[mouthHalfwayIndex];
  //Takes created array of mouth0Sounds with the index counter's value
  //and plays that sound
  mouthHalfwaySounds[mouthHalfwayIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthHalfwayIndex++;
  if (mouthHalfwayIndex > mouthHalfwaySensors.length - 1) {
    mouthHalfwayIndex = 0;
  }
}

//No need for teeth or tongue sounds
function mouthClosedFunction() {
  print("Mouth Closed!");
  let sound = mouthClosedSensors[mouthClosedIndex];
  //Takes created array of mouth0Sounds with the index counter's value
  //and plays that sound
  mouthHalfwaySounds[mouthClosedIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthClosedIndex++;
  if (mouthClosedIndex > mouthClosedSensors.length - 1) {
    mouthClosedIndex = 0;
  }
}

function teethFunction() {
  print("Teeth Pinched!");
  let sound = teeth3Sensors[teeth3Index];
  //Takes created array of mouth0Sounds with the index counter's value
  //and plays that sound
  teeth3Sounds[teeth3Index].play();
  currentSyllable = sound;
  print(sound);
  teeth3Index++;
  if (teeth3Index > teeth3Sensors.length - 1) {
    teeth3Index = 0;
  }
}

function tongue4Function() {
  print("Tip of tongue pressed!");
  let sound = tongue4SoundsSensors[tongue4Index];
  teeth4Sounds[tongue4Index].play();
  currentSyllable = sound;
  print(sound);
  tongue4Index++;
  if (tongue4Index > teeth4Sensors.length - 1) {
    tongue4Index = 0;
  }
}
function tongue5Function() {
  print("Middle of tongue pressed!!");
  let sound = tongue5Sensors[tongue5Index];
  tongue5Sounds[tongue5Index].play();
  print(sound);
  currentSyllable = sound;
  tongue5Index++;
  if (tongue5Index > tongue5Sensors.length - 1) {
    tongue5Index = 0;
  }
}

function tongue6Function() {
  print("Back of tongue pressed!!");
  let sound = tongue6Sensors[tongue6Index];
  tongue6Sounds[tongue6Index].play();
  print(sound);
  currentSyllable = sound;
  tongue6Index++;
  if (tongue6Index > tongue6Sensors.length - 1) {
    tongue6Index = 0;
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
}


//VARIABLE FOR ASSIGNING SERIAL DATA TO KEY BUTTONS
//GETS MAPPED DATA OF WHICH SENSOR COMBINATIONS EQUAL WHICH CODES BELOW
//A larger function that allows the user to press various keys
//and call their related smaller functions
//Turning sensor value returns from serial/arduino into they
//keyboard keys written below

function playCode(code) {
  print(code);

  //When mouth0Sensor is pressed, scroll through an array
  if (code === 65) {
    //Key A
    mouthOpenFunction();
  }
  if (code === 83) {
    //Key S
    mouthHalfwayFunction();
  }
  if (code === 68) {
    //Key D
    mouthClosedFunction();
  }
  if (code === 70) {
    //Key K
    teeth3Function();
  }
  if (code === 71) {
    //Key L
    tongue4Function();
  }
  if (code === 72) {
    //Key ;
    tongue5Function();
  }
  //UPDATE CODE KEY
  if (code === 74) {
    //Key ;
    tongue6Function();
  }

  //NOT WRITTEN YET
  //Not written yet
  //When delete is pressed, clear the result
  if (code === 8) {
    //Delete key
    deleteFunction();
  }
  //Not written yet
  //When Command button is pressed, save the result
  if (code === 91) {
    //Command button
    saveFunction();
  }
}

function keyPressed(){
  //When the space bar is pressed, move the result to the bottom
  //of the screen
  if (keyCode === 32) {
    //Space bar
    enterFunction();
  }
}
