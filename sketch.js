//CREATE THREE WEBPAGES
//1) Fix border
//2) Fix Start Over function
//3) Add recording visual icon
//4) Figure out how to show animation at first


//VARIABLES FOR SOUND recorder
let oldWords = [];
let newWord;
let hearCompButton;
let textbox;
let definition;
let spelling;
let spellButton;
let recordButton;
let stopRecordButton;
let saveButton;
let name;
let nameBox;
let definitionBox;




//VARIABLES FOR SERIAL IN P5 SKETCH
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/cu.usbmodem1421'; // fill in your serial port name here

//VARIABLES FOR PHONEMES
//MOUTH SENSORS 0 AND 1

//REORGANIZE SOUNDS TO MATCH A E I O U IF YOU PRESS ALL THREE OR TWO
let mouthOneSensors = ['ee', 'ehh', 'uouhh', 'er'];
let mouthOneIndex = 0;
let mouthOneSounds = [];

let mouthTwoSensors = ['aiy', 'aehh', 'ooo'];
let mouthTwoIndex = 0;
let mouthTwoSounds = [];

let mouthThreeSensors = ['ahh', 'oahhh', 'uhh','hah',];
//save for later aeh
let mouthThreeIndex = 0;
let mouthThreeSounds = [];

let mouthClosedSensors = ['bah','pah', 'wah', 'yah', 'mmm'];
let mouthClosedIndex = 0;
let mouthClosedSounds = [];

//TEETH SENSOR 3 = PINCHING TOP OF TEETH = CONSONANTS
let teethOneSensors = ['vah', 'fah', 'rah'];
let teethOneIndex = 0;
let teethOneSounds = [];

//TEETH SENSOR 4 = PINCHING BOTTOM OF TEETH = CONSONANTS
let teethTwoSensors = ['vah', 'fah', 'rah'];
let teethTwoIndex = 0;
let teethTwoSounds = [];

//TONGUE SENSOR 5 = PRESSING TIP OF TONGUE = CONSONANTS
let tipTongueSensors = ['lah', 'sah', 'tha'];
let tipTongueIndex = 0;
let tipTongueSounds = [];

//TONGUE SENSOR 6 = PRESSING MIDDLE OF TONGUE = CONSONANTS
let middleTongueSensors = ['nah', 'dah', 'tah', 'sha', 'cha', 'zah', 'juh'];
let middleTongueIndex = 0;
let middleTongueSounds = [];

//TONGUE SENSOR 7 = PRESSING BACK OF TONGUE = CONSONANTS
let backTongueSensors = ['kah', 'gah', 'eng'];
let backTongueIndex = 0;
let backTongueSounds = [];

//VARIABLES FOR BUILDING WORDS
let currentSyllable = "uhh";
let word = [];
//let syllableArray;
//Aarons code
let currentKey = null;


//VARIABLES FOR RECEIVING SERIAL
var code;

//CODES
var arduinoToCodes = {
  //Order: mouthpressed, mouthclosed/mouthhalfway/mouthopen, teethpressed, tiptongue, middletongue, backtongue
  //No sounds
  //No user inputs at all
  '0,0,0,0,0,0,0,0,0': 192,
  //Sounds
  //Front of mouth
  '1,0,0,0,0,0,0,0,0': 49,
  '1,0,0,1,0,0,0,0,0': 49,
  //Middle of mouth
  '0,1,0,0,0,0,0,0,0': 50,
  '0,1,0,1,0,0,0,0,0': 50,

  //Back of mouth
  '0,0,1,0,0,0,0,0,0': 51,
  '0,0,1,1,0,0,0,0,0': 51,

  //Top of teeth
  '0,0,0,1,0,0,0,0,0': 52,
  //Bottom of teeth
  '0,0,0,0,1,0,0,0,0': 53,
  '0,0,0,1,1,0,0,0,0': 53,

  //Tip of tongue
  '0,0,0,0,0,1,0,0,0': 54,
  '0,0,0,0,0,1,1,0,0': 54,
  '0,0,0,1,0,1,0,0,0': 54,


  //Middle of tongue
  '0,0,0,0,0,0,1,0,0': 55,
  '0,0,0,1,0,0,1,0,0': 55,

  //Back of tongue
  '0,0,0,0,0,0,0,1,0': 56,
  '0,0,0,1,0,0,0,1,0': 56,

  //Mouth closed
  '0,0,0,0,0,0,0,0,1': 57,
  '1,0,0,0,0,0,0,0,1': 57,
  '0,0,0,1,0,0,0,0,1': 57,

}

var previousData;
var scheduled;
var previousSum = 0;


//PRELOAD

//PRELOAD BACKGROUND IMAGE
function preload() {
  felt = loadImage("feltbackground.jpg");

  //PRELOAD MP3S USING ARRAYS
  for (let i = 0; i < mouthOneSensors.length; i++) {
    mouthOneSounds.push(loadSound("soundfiles/" + mouthOneSensors[i] + ".mp3"));
  }
  for (let j = 0; j < mouthTwoSensors.length; j++) {
    mouthTwoSounds.push(loadSound("soundfiles/" + mouthTwoSensors[j] + ".mp3"));
  }
  for (let k = 0; k < mouthThreeSensors.length; k++) {
    mouthThreeSounds.push(loadSound("soundfiles/" + mouthThreeSensors[k] + ".mp3"));
  }
  for (let m = 0; m < teethOneSensors.length; m++) {
    teethOneSounds.push(loadSound("soundfiles/" + teethOneSensors[m] + ".mp3"));
  }
  for (let o = 0; o < teethTwoSensors.length; o++) {
    teethTwoSounds.push(loadSound("soundfiles/" + teethTwoSensors[o] + ".mp3"));
  }
  for (let p = 0; p < tipTongueSensors.length; p++) {
    tipTongueSounds.push(loadSound("soundfiles/" + tipTongueSensors[p] + ".mp3"));
  }
  for (let q = 0; q < middleTongueSensors.length; q++) {
    middleTongueSounds.push(loadSound("soundfiles/" + middleTongueSensors[q] + ".mp3"));
  }
  for (let r = 0; r < backTongueSensors.length; r++) {
    backTongueSounds.push(loadSound("soundfiles/" + backTongueSensors[r] + ".mp3"));
  }
  for (let s = 0; s < mouthClosedSensors.length; s++) {
    mouthClosedSounds.push(loadSound("soundfiles/" + mouthClosedSensors[s] + ".mp3"));
  }
}

//SET UP
function setup() {
  //SET UP CANVAS
  createCanvas(windowWidth, windowHeight);
  background(felt);
  smooth(); // antialias drawing lines
  textFont("PT Mono");





  //ADD A PHONEME
  let addSoundButton = createButton('Add to Word');
  addSoundButton.mousePressed(addSoundFunction);
  addSoundButton.position(width / 3 + 70, height / 3 + 50);
  addSoundButton.style('font-size', '30px');
  addSoundButton.size(190, 70);

  //DELETE A PHONEME
  let deleteSoundButton = createButton('Start Over');
  deleteSoundButton.mousePressed(deleteSoundFunction);
  deleteSoundButton.position(width / 3 + 280, height / 3 + 50);
  deleteSoundButton.style('font-size', '30px');
  deleteSoundButton.size(170, 70);

  //INPUT FIELD FOR USER DEFINITION
  definitionBox = createInput();
  textSize(30);
  definitionBox.style('font-size', '30px');
  definitionBox.position(width / 2, height / 3 + 280);
  definitionBox.size(500,  30);

  //INPUT FIELD FOR USER SPELLING
  spellingBox = createInput();
  textSize(30);
  spellingBox.style('font-size', '30px');
  spellingBox.position(width / 2, height / 3 + 240);
  spellingBox.size(500,  30);

  //RECORD BUTTON
  let recordButton = createButton('Record');
  recordButton.mousePressed(recordFunction);
  recordButton.position(width / 2, height / 3 + 320);
  recordButton.style('font-size', '30px');
  recordButton.size(150, 40);

  //STOP RECORDING BUTTON
  let stopRecordButton = createButton('Stop');
  stopRecordButton.mousePressed(stopRecordFunction);
  stopRecordButton.position(width / 2 + 200, height / 3 + 320);
  stopRecordButton.style('font-size', '30px');
  stopRecordButton.size(150, 40);

  //INPUT FIELD FOR USER NAME
  nameBox = createInput();
  nameBox.style('font-size', '30px');
  nameBox.position(width / 2, height / 3 + 365);
  nameBox.size(500, 40);

  //BUTTON FOR SAVING WORD
  let saveButton = createButton('Save Your Word');
  saveButton.mousePressed(saveFunction);
  saveButton.position(width / 2 - 100, height / 3 + 420);
  saveButton.style('font-size', '35px', 'color', '#ff0000')
  saveButton.size(300, 70);


  //SET UP SERIAL PORT
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
  } catch (err) {
    console.log("oops");
  }

  //SET UP RECORDER
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  newWord = new p5.SoundFile();

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
    var sum = int(states[0]) + int(states[1]) + int(states[2]) + int(states[3]) + int(states[4]) + int(states[5]) + int(states[6]) + int(states[7]) + int(states[8]);
    if (sum == 0) {
      previousSum = 0;
      previousData = data;
      //SHOULD THIS BE 8 OR 9?
    } else if (data != previousData && sum > previousSum && sum < 9) {
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
  background(felt);
  textSize(200);
  fill(0);
  text(currentSyllable, width / 3 + 75, height / 3);

  //LIST OF KEYBOARD COMMANDS
  textSize(20);
  text("Play Online with Keyboard Commands:", 10, 20);
  text("Vowels", 10, 60);
  text("Key 1: Front of mouth", 10, 80);
  text("Key 2: Middle of mouth", 10, 100);
  text("Key 3: Back of mouth", 10, 120);
  text("Consonants", 10, 160);
  text("Key 4 or 5: Teeth", 10, 180);
  text("Key 6: Tip of Tongue", 10, 200);
  text("Key 7: Middle of Tongue", 10, 220);
  text("Key 8: Back of Tongue", 10, 240);
  text("Key 9: Closed lips", 10, 260);







  //SET UP TEXT, BUTTONS, INPUTS ON SCREEN
  //TITLE
  fill(0);
  textAlign(width / 2, height / 2);
  textSize(60);
  text('Invent an Original Word', width / 3 - 125, 75);


  //CURRENT PHONEME
  //Found in draw()

  //PRINT OUT CURRENT WORD
  textSize(74);
  text('Current Word:', width / 3 - 350, height / 3 + 200);
  text(word, width / 3 + 300, height / 3 + 175);
  strokeWeight(10);
  line(width / 3 + 300, height / 4 * 2.3, 1400, height / 4 * 2.3);

  fill(0);
  textSize(30);
  text('Define your word:', definitionBox.x - 335, definitionBox.y + definitionBox.height - 8);
  definition = definitionBox.value();

  text('Spell your word:', spellingBox.x - 335, spellingBox.y + spellingBox.height - 8);
  spelling = spellingBox.value();

  text('Record your word:', width / 2 - 335, height / 3 + 350);

  fill(0);
  textSize(30);
  text('Your name:', nameBox.x - 335, nameBox.y + nameBox.height - 20);
  name = nameBox.value();

}

//FUNCTIONS THAT ARE CALLED WHEN SENSORS ARE PRESSED

//This function is called when the mouthOpenSensor is triggered.
//Finds the next element in the mouth0Index by using an index pointer/counter
//and stores it into the currentSyllable variable which is GLOBAL so it can be used
//in other functions in my code.
function mouthOneFunction() {
  print("Mouth 1!");
  let sound = mouthOneSensors[mouthOneIndex];
  //Takes created array of mouth0Sounds with the index counter's value
  //and plays that sound
  mouthOneSounds[mouthOneIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthOneIndex++;
  if (mouthOneIndex > mouthOneSensors.length - 1) {
    mouthOneIndex = 0;
  }
}

function mouthTwoFunction() {
  print("Mouth 2!");
  let sound = mouthTwoSensors[mouthTwoIndex];
  mouthTwoSounds[mouthTwoIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthTwoIndex++;
  if (mouthTwoIndex > mouthTwoSensors.length - 1) {
    mouthTwoIndex = 0;
  }
}

function mouthThreeFunction() {
  print("Mouth 3!");
  let sound = mouthThreeSensors[mouthThreeIndex];
  mouthThreeSounds[mouthThreeIndex].play();
  currentSyllable = sound;
  print(sound);
  mouthThreeIndex++;
  if (mouthThreeIndex > mouthThreeSensors.length - 1) {
    mouthThreeIndex = 0;
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

function teethOneFunction() {
  print("Top of Teeth Pinched!");
  let sound = teethOneSensors[teethOneIndex];
  teethOneSounds[teethOneIndex].play();
  currentSyllable = sound;
  print(sound);
  teethOneIndex++;
  if (teethOneIndex > teethOneSensors.length - 1) {
    teethOneIndex = 0;
  }
}

function teethTwoFunction() {
  print("Bottom of Teeth Pinched!");
  let sound = teethTwoSensors[teethTwoIndex];
  teethTwoSounds[teethTwoIndex].play();
  currentSyllable = sound;
  print(sound);
  teethTwoIndex++;
  if (teethTwoIndex > teethTwoSensors.length - 1) {
    teethTwoIndex = 0;
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
  print("Middle of tongue pressed!");
  let sound = middleTongueSensors[middleTongueIndex];
  middleTongueSounds[middleTongueIndex].play();
  currentSyllable = sound;
  print(sound);
  middleTongueIndex++;
  if (middleTongueIndex > middleTongueSensors.length - 1) {
    middleTongueIndex = 0;
  }
}

function backTongueFunction() {
  print("Back of tongue pressed!");
  let sound = backTongueSensors[backTongueIndex];
  backTongueSounds[backTongueIndex].play();
  currentSyllable = sound;
  print(sound);
  backTongueIndex++;
  if (backTongueIndex > backTongueSensors.length - 1) {
    backTongueIndex = 0;
  }
}


//VARIABLES FOR ASSIGNING SERIAL DATA TO KEY BUTTONS
//GETS MAPPED DATA OF WHICH SENSOR COMBINATIONS EQUAL WHICH CODES BELOW,
//AND ASSIGNS THEM TO FUNCTIONS TO BE CALLED

function playCode(code) {
  console.log(code);

  //NO SOUNDS
  if (code === 192) {
    noSoundsFunction();
  }
  //SOUNDS
  if (code === 49) {
    mouthOneFunction();
  }
  if (code === 50) {
    mouthTwoFunction();
  }
  if (code === 51) {
    mouthThreeFunction();
  }
  if (code === 52) {
    teethOneFunction();
  }
  if (code === 53) {
    teethTwoFunction();
  }
  if (code === 54) {
    tipTongueFunction();
  }
  if (code === 55) {
    //Key g;
    middleTongueFunction();
  }
  if (code === 56) {
    //Key h;
    backTongueFunction();
  }
  if (code === 57) {
    mouthClosedFunction();
  }
}


function keyPressed() {
  console.log('hellloooo')

  currentKey = keyCode;

  //retrieve the value from keyCode and assign it to my own variable currentKey

  //SOUNDS
  if (currentKey === 192) {
    //Key C
    noSoundsFunction();
  }
  if (currentKey === 49) {
    //Key 1;
    mouthOneFunction();
  }
  if (currentKey === 50) {
    //Key 2;
    mouthTwoFunction();
  }
  if (currentKey === 51) {
    //Key 3;
    mouthThreeFunction();
  }
  if (currentKey === 52) {
    //Key 5;
    teethOneFunction();
  }
  if (currentKey === 53) {
    //Key 5;
    teethTwoFunction();
  }
  if (currentKey === 54) {
    //Key 6;
    tipTongueFunction();
  }
  if (currentKey === 55) {
    //Key 6;
    middleTongueFunction();
  }
  if (currentKey === 56) {
    //Key 7;
    backTongueFunction();
  }
  if (currentKey === 57) {
    //Key 4;
    mouthClosedFunction();
  }
}


//FUNCTIONS FOR RECORDING
function addSoundFunction() {
  console.log("heyooo");
  word += currentSyllable;
}

function deleteSoundFunction() {
  console.log("haii");
  word = "";
}

function recordFunction() {
  if (mic.enabled) {
    console.log("helllooo")
    recorder.record(newWord);
  }
}

function stopRecordFunction() {
  recorder.stop();
  console.log("hiiiii")
}

function nameFunction() {
  console.log("yooooo")
  name = nameBox.value();
  console.log(name);
}

function saveFunction() {
  newWord.play(); // play the result!
  save(newWord, spelling + 'means' + definition + 'by' + name + '.wav'); // save the result
}

//FUNCTION FOR PLAYING BACK WORDS ALREADY MADE
