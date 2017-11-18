//VARIABLES FOR SERIAL IN P5 SKETCH
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem120'; // fill in your serial port name here


//VARIABLES FOR WORDS AND MP3S ASSOCIATED WITH SOUNDS

//MOUTH SENSOR 0 = MOUTH OPEN = LOW VOWELS
let mouth0Sensor = ['Ahh', 'Aohh', 'Aye', 'Ehh', 'Ooh', 'Uhh', 'Hah', 'Jyah'];
let mouth0Index = 0;
let mouth0Sounds = [];


//MOUTH SENSOR 1 = MOUTH HALF-WAY OPEN = HIGH VOWELS
let mouth1Sensor = [''];
let mouth1Index = 0;
let mouth1Sounds = [];


let teeth1Sensor = [];
let tongue2Sensor = [];

//MOUTH SENSOR 2 = MOUTH CLOSED ALL THE WAY = CONSONANTS
let mouth2Sensor = [''];
let mouth2Index = 0;
let mouth2Sounds = [];

let mouth0Teeth1Sensors = ['Fah', 'Vah'];
let mouth0Teeth1Index = 0;
let mouth0Teeth1Sounds = [];

//TEETH SENSOR 3 = PINCHING TOP OF TEETH = CONSONANTS
let mouth0Tongue2Sensors = ['Dah', 'Nah', 'Tah', 'Kah'];
let mouth0Tongue2Index = 0;
let mouth0Tongue2Sounds = [];

//TONGUE SENSOR 4 = PRESSING TIP OF TONGUE = CONSONANTS

let teeth1Tongue2Sensors = ['Lah', 'Sah', 'Zah'];
let teeth1Tongue2Index = 0;
let teeth1Tongue2Sounds = [];


//TONGUE SENSOR 5 = PRESSING MIDDLE OF TONGUE = CONSONANTS


//TONGUE SENSOR 6 = PRESSING BACK OF TONGUE = CONSONANTS



//VARIABLES FOR BUILDING WORDS
let currentSyllable = "uhh";
let word = [];
let syllableArray;


//VARIABLES FOR RECEIVING SERIAL DATA
var code;
var arduinoToCodes = {
  '1,0,0': 65,
  '0,1,0': 83,
  '0,0,1': 68,
  '1,1,0': 75,
  '0,1,1': 76,
  '1,0,1': 186,
}
var previousData;
var scheduled;
var previousSum = 0;




//PRELOAD MP3S USING ARRAYS
function preload() {
  for (let i = 0; i < mouth0Sensor.length; i++) {
    mouth0Sounds.push(loadSound("soundfiles/" + mouth0Sensor[i] + ".mp3"));
  }
  for (let j = 0; j < mouth0Teeth1Sensors.length; j++) {
    mouth0Teeth1Sounds.push(loadSound("soundfiles/" + mouth0Teeth1Sensors[j] + ".mp3"));
  }
  for (let k = 0; k < mouth0Tongue2Sensors.length; k++) {
    mouth0Tongue2Sounds.push(loadSound("soundfiles/" + mouth0Tongue2Sensors[k] + ".mp3"));
  }
  for (let m = 0; m < teeth1Tongue2Sensors.length; m++) {
    teeth1Tongue2Sounds.push(loadSound("soundfiles/" + teeth1Tongue2Sensors[m] + ".mp3"));
  }
  for (let n = 0; n < mouth0Tongue2Sensors.length; n++) {
    mouth0Tongue2Sounds.push(loadSound("soundfiles/" + mouth0Tongue2Sensors[n] + ".mp3"));
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
  //console.log("helloooo");

  var data = serial.readLine();
  console.log(data);

  if (data.length > 0) {

    var states = data.split(',');
    // ['0','1','0']
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
//Called when the mouth0Sensor is pressed.
//Finds the next element in the mouth0Index
//by using an index pointer/counter
//and stores it into the currentSyllable
//variable which is GLOBAL so it can be used
//in other functions in my code
function mouthFunction() {
  print("Mouth Pressed");
  let sound = mouth0Sensor[mouth0Index];
  //Takes created array of mouth0Sounds with the index counter's value
  //and plays that sound
  mouth0Sounds[mouth0Index].play();
  currentSyllable = sound;
  print(sound);
  mouth0Index++;
  if (mouth0Index > mouth0Sensor.length - 1) {
    mouth0Index = 0;
  }
}
//No need for teeth or tongue sounds
function teethFunction() {
  print("teeth Pressed");
}

function tongueFunction() {
  print("tongue Pressed");
}
//Called when the mouth0Sensor and teeth1Sensor are pressed.
//Finds the next element in this array and stores it
//into a sound variable, which then stores it into a
//global variable to use later.
function mouthAndTeethFunction() {
  print("mouth AND teeth pressed!");
  let sound = mouth0Teeth1Sensors[mouth0Teeth1Index];
  mouth0Teeth1Sounds[mouth0Teeth1Index].play();
  currentSyllable = sound;
  print(sound);
  mouth0Teeth1Index++;
  if (mouth0Teeth1Index > mouth0Teeth1Sensors.length - 1) {
    mouth0Teeth1Index = 0;
  }
}
//Called when the teethSensor1 and tongueSensor2 are pressed.
function teethAndTongueFunction() {
  print("tongue AND teeth pressed!");
  let sound = teeth1Tongue2Sensors[teeth1Tongue2Index];
  teeth1Tongue2Sounds[teeth1Tongue2Index].play();
  print(sound);
  currentSyllable = sound;
  teeth1Tongue2Index++;
  if (teeth1Tongue2Index > teeth1Tongue2Sensors.length - 1) {
    teeth1Tongue2Index = 0;
  }
}

function mouthAndTongueFunction() {
  print("mouth AND tongue pressed!");
  let sound = mouth0Tongue2Sensors[mouth0Tongue2Index];
  mouth0Tongue2Sounds[mouth0Tongue2Index].play();
  print(sound);
  currentSyllable = sound;
  mouth0Tongue2Index++;
  if (mouth0Tongue2Index > mouth0Tongue2Sensors.length - 1) {
    mouth0Tongue2Index = 0;
  }
}


//VARIABLE FOR ASSIGNING SERIAL DATA TO KEY BUTTONS
//GETS MAPPED DATA OF WHICH SENSOR COMBINATIONS EQUAL
//WHICH CODES BELOW
//A larger function that allows the user to press various keys
//and call their related smaller functions
//Turning sensor value returns from serial/arduino into they
//keyboard keys written below

function playCode(code) {
  print(code);

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
  //When sensor0 is pressed, scroll through an array
  if (code === 65) {
    //Key A
    mouthFunction();
  }
  if (code === 83) {
    //Key S
    teethFunction();
  }
  if (code === 68) {
    //Key D
    tongueFunction();
  }
  //For now, press K or L to equal pressing two
  //sensors together. Later recreate this in Arduino
  if (code === 75) {
    //Key K
    mouthAndTeethFunction();
  }
  if (code === 76) {
    //Key L
    teethAndTongueFunction();
  }
  if (code === 186) {
    //Key ;
    mouthAndTongueFunction();
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
