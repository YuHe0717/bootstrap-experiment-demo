
//const mode = 'live' // '', 'dev', 'live'

/*let start_time = Date.now();*/
let exercise_start_time = 0;
let exercise_end_time = 0;
let training_start_time = 0;
let training_end_time = 0;
let control_taskR_end_time = 0;
let control_taskF_end_time = 0;
let training_task1_end_time = 0;
let training_task2_end_time = 0;


/** Collect prolific id */
let subjectData = {};

/**if (mode == '' || mode == 'dev') {
  subjectData['prolific_id'] = 'NA';
  hide('prolific_id');
  showNext('task', 'block');
} else {*/
  const prolificIdBtn = document.getElementById('prolific_id-btn');
  const prolificText = document.getElementById('prolific_id_text');
  prolificIdBtn.onclick = () => {
    subjectData['prolific_id'] = prolificText.value;
    hide('prolific_id');
    showNext('training', 'block');
  }
//}

// document.getElementById('consentButton').addEventListener('click', function() {
//   alert('You have consented and will now continue to the experiment.');
//   hide('consent_sheet');
//   showNext('training', 'block');
//   exercise_start_time = Date.now();

// });

/** Trainings */
// Enable the Next button only after sufficient play
let demoTraces = {'tria': 0,'rotate': 0, 'direc': 0 ,'flip':0};
const trainingNextBtn = document.getElementById('training-next-btn');
trainingNextBtn.onclick = () => {
  hide('training');
  showNext('training-quiz', 'block');
}

function trainProceed(clickHistory) {
  if (Object.values(clickHistory).filter(v => v < 1).length < 1) {
    trainingNextBtn.disabled = false;
  }
}

// Draw grid
const N = 9;

let demoGrid = makeGridVars(N, showCenter=0);
let demoGridDiv = document.getElementById('demo-grid');
for (let i = 0; i < N; i++) {
  let tcCodeList = demoGridDiv.insertRow();
  for (let j = 0; j < N; j++) {
    let tcell = tcCodeList.insertCell();
    tcell.id = `demo-grid-c` + i.toString() + '-' + j.toString();
    tcell.style.border = '#ffffff solid 1px';
  }
}
let centerCellId = makeUnit(Math.floor(N/2),Math.floor(N/2));
document.getElementById(`demo-grid-${centerCellId}`).style.borderColor='red';

// Button functionalities
const demoClearBtn = document.getElementById('training-clear-btn');
demoClearBtn.onclick = () => resetGrid('demo-grid', demoGrid, N, false);


let keyPresses = {
  'demo-grid': [],
  task_1: [],
  task_2: [],
  task_3: [],
  task_4: [],
  task_5: []
};



document.addEventListener('keydown', function(event) {
  if (event.key === "r") {
    rotateRightCenter2('demo-grid', demoGrid, N);
    demoTraces['rotate'] += 1;
    trainProceed(demoTraces);
    keyPresses['demo-grid'].push('r');
  }
});

// Add an L-shape figure
document.addEventListener('keydown', function(event) {
  if (event.key === "l") {
    addLshape('demo-grid', demoGrid, N);
    demoTraces['tria'] += 1;
    trainProceed(demoTraces);
    keyPresses['demo-grid'].push('l');
  }
});

// Add flip event
document.addEventListener('keydown', function(event) {
  if (event.key === "f") {
    flipLeftRight('demo-grid', demoGrid, N); 
    demoTraces['flip'] += 1; 
    trainProceed(demoTraces); 
    keyPresses['demo-grid'].push('f');
  }
});

// Add key event for movements
document.addEventListener('keydown', function(e) {
  e = e || window.event;
  switch(e.key) {
    case 'ArrowUp':
      moveUpInf('demo-grid', demoGrid, 1, N);
      demoTraces['direc'] += 1;
      trainProceed(demoTraces);
      keyPresses['demo-grid'].push('up');
      break;

    case 'ArrowDown':
      moveDownInf('demo-grid', demoGrid, 1, N);
      demoTraces['direc'] += 1;
      trainProceed(demoTraces);
      keyPresses['demo-grid'].push('down');
      break;

    case 'ArrowLeft':
      moveLeftInf('demo-grid', demoGrid, 1, N);
      demoTraces['direc'] += 1;
      trainProceed(demoTraces);
      keyPresses['demo-grid'].push('left');
      break;

    case 'ArrowRight':
      moveRightInf('demo-grid', demoGrid, 1, N);
      demoTraces['direc'] += 1;
      trainProceed(demoTraces);
      keyPresses['demo-grid'].push('right');
      break;
  }
});

/** Training quiz */
let triaDraw = document.getElementById('canvas-triangle').getContext('2d');
triaDraw.fillRect(0,0,30,90);
triaDraw.fillRect(30,60,30,30);
triaDraw.strokeStyle = "#ffffff";
triaDraw.lineWidth = 2;
triaDraw.strokeRect(0,0,30,30);
triaDraw.strokeRect(0,30,30,30);
triaDraw.strokeRect(0,60,30,30);
triaDraw.strokeRect(30,60,30,30);

const trainingQuizForm = document.getElementById('training-quiz-form');
const trainingRetryBtn = document.getElementById('training-retry-btn');
const trainingQuizCheckBtn = document.getElementById('training-quiz-check-btn');

const trainingChecks = [ 'check1', 'check2', 'check3', 'check4', 'check5'];
const trainingAnswers = [ 'addLshape', 'fliplr', 'right90', 'yes' ,'false'];

trainingQuizCheckBtn.onclick = () => {
  trainingQuizCheckBtn.style.display = 'none';
  let inputs = [];
  trainingChecks.map(check => {
    const vals = document.getElementsByName(check);
    vals.forEach(v => { v.checked? inputs.push(v.value): null; });
  });
  const pass = (inputs.join('') === trainingAnswers.join(''));
  if (pass) {
    hide('training-quiz');
    showNext('instruction', 'block');
    exercise_end_time = Date.now();
    console.log("Exercise time:", exercise_end_time - exercise_start_time);
  } else {
    showNext('training-retry', 'block');
  }
}

trainingRetryBtn.onclick = () => {
  hide("training-retry");
  hide("training-quiz");
  showNext("training", "block");
  trainingQuizCheckBtn.style.display = 'flex';
};

trainingQuizForm.onchange = () => compIsFilled(trainingChecks.length) ? trainingQuizCheckBtn.disabled = false : null;



/** Instructions */
const introNextBtn = document.getElementById('intro-next-btn');
introNextBtn.onclick = () => {
  hide('instruction');
  resetGrid('task-1', taskGridVars['task_1'], N, false);
   // 清空当前任务的按键记录
  keyPresses['task_1'] = [];
  showNext('training-task', 'block');
  training_start_time = Date.now();
}

/** Training Tasks */
let nCorrect = 0;
/*let toShow = (mode == 'dev') ? true : false;*/

// randomize group assignment
let group = (Math.random() < 0.5) ? 'experiment' : 'control';
//console.log(`Group: ${group}`);



function parseCoordinates(coordString) {
  const pairs = coordString.match(/\((\d+),(\d+)\)/g); // 匹配所有的坐标对
  const result = {};
  pairs.forEach(pair => {
    const [row, col] = pair.slice(1, -1).split(',').map(Number); // 去掉括号并拆分为数字
    result[`${row}_${col}`] = 1; // 修改这里，使坐标格式变为 "1_2"
  });
  return result;
}

let tasks = {};
if (group == 'experiment') {
  tasks = {
    'task_1': parseCoordinates('(2,3), (2,4), (3,4), (4,4), (5,3), (5,4), (5,5), (6,3)'),
    'task_2': parseCoordinates('(3,3), (3,4), (3,5), (3,6), (4,4), (5,4)'),
    'task_3': parseCoordinates('(3,5), (3,4), (3,3), (4,3), (4,5), (5,5)'),
    'task_4': parseCoordinates('(4,4), (4,5), (4,3), (3,5)'
    ),
    'task_5': parseCoordinates('(2,4), (3,4), (4,4), (4,3)')
  };
} else if (group == 'control') {
  tasks = {
    'task_1': parseCoordinates('(2,3), (3,3), (4,3), (4,4), (4,5), (6,5), (6,4), (5,5)'),
    'task_2': parseCoordinates('(2,4), (3,4), (4,4), (4,5), (5,3), (5,4)'),
    'task_3': parseCoordinates('(3,3), (3,5), (4,3), (4,5), (5,3), (5,5), (5,4)'),
    'task_4': parseCoordinates('(4,4), (4,5), (4,3), (3,5)'),
    'task_5': parseCoordinates('(2,4), (3,4), (4,4), (4,3)')
  };
}

// Define task shapes for experimental group
const expTaskTargets = {
  'task_1': {
    [`${makeUnit(2, 3, 'target-1-')}`]: 1,
    [`${makeUnit(2, 4, 'target-1-')}`]: 1,
    [`${makeUnit(3, 4, 'target-1-')}`]: 1,
    [`${makeUnit(4, 4, 'target-1-')}`]: 1,
    [`${makeUnit(5, 3, 'target-1-')}`]: 1,
    [`${makeUnit(5, 4, 'target-1-')}`]: 1,
    [`${makeUnit(5, 5, 'target-1-')}`]: 1,
    [`${makeUnit(6, 3, 'target-1-')}`]: 1
  },
  'task_2': {
    [`${makeUnit(3, 3, 'target-2-')}`]: 1,
    [`${makeUnit(3, 4, 'target-2-')}`]: 1,
    [`${makeUnit(3, 5, 'target-2-')}`]: 1,
    [`${makeUnit(3, 6, 'target-2-')}`]: 1,
    [`${makeUnit(4, 4, 'target-2-')}`]: 1,
    [`${makeUnit(5, 4, 'target-2-')}`]: 1
  },
  'task_3': {
    [`${makeUnit(3, 5, 'target-3-')}`]: 1,
    [`${makeUnit(3, 4, 'target-3-')}`]: 1,
    [`${makeUnit(3, 3, 'target-3-')}`]: 1,
    [`${makeUnit(4, 3, 'target-3-')}`]: 1,
    [`${makeUnit(4, 5, 'target-3-')}`]: 1,
    [`${makeUnit(5, 5, 'target-3-')}`]: 1
  },
  'task_4': {
    [`${makeUnit(4, 4, 'target-4-')}`]: 1,
    [`${makeUnit(4, 5, 'target-4-')}`]: 1,
    [`${makeUnit(4, 3, 'target-4-')}`]: 1,
    [`${makeUnit(3, 5, 'target-4-')}`]: 1
  },
  'task_5': {
    [`${makeUnit(2, 4, 'target-5-')}`]: 1,
    [`${makeUnit(3, 4, 'target-5-')}`]: 1,
    [`${makeUnit(4, 4, 'target-5-')}`]: 1,
    [`${makeUnit(4, 3, 'target-5-')}`]: 1
  },
};

// Define task shapes for control group
const ctrlTaskTargets = {
  'task_1': {
  

    [`${makeUnit(2, 3, 'target-1-')}`]: 1,
    [`${makeUnit(3, 3, 'target-1-')}`]: 1,
    [`${makeUnit(4, 3, 'target-1-')}`]: 1,
    [`${makeUnit(4, 4, 'target-1-')}`]: 1,
    [`${makeUnit(4, 5, 'target-1-')}`]: 1,
    [`${makeUnit(6, 5, 'target-1-')}`]: 1,
    [`${makeUnit(6, 4, 'target-1-')}`]: 1,
    [`${makeUnit(5, 5, 'target-1-')}`]: 1
  },
  'task_2': {
    [`${makeUnit(2, 4, 'target-2-')}`]: 1,
    [`${makeUnit(3, 4, 'target-2-')}`]: 1,
    [`${makeUnit(4, 4, 'target-2-')}`]: 1,
    [`${makeUnit(4, 5, 'target-2-')}`]: 1,
    [`${makeUnit(5, 3, 'target-2-')}`]: 1,
    [`${makeUnit(5, 4, 'target-2-')}`]: 1
  },
  'task_3': {
    [`${makeUnit(3, 3, 'target-3-')}`]: 1,
    [`${makeUnit(3, 5, 'target-3-')}`]: 1,
    [`${makeUnit(4, 3, 'target-3-')}`]: 1,
    [`${makeUnit(4, 5, 'target-3-')}`]: 1,
    [`${makeUnit(5, 3, 'target-3-')}`]: 1,
    [`${makeUnit(5, 5, 'target-3-')}`]: 1,
    [`${makeUnit(5, 4, 'target-3-')}`]: 1
  },
  'task_4': {
    [`${makeUnit(4, 4, 'target-4-')}`]: 1,
    [`${makeUnit(4, 5, 'target-4-')}`]: 1,
    [`${makeUnit(4, 3, 'target-4-')}`]: 1,
    [`${makeUnit(3, 5, 'target-4-')}`]: 1
  },
  'task_5': {
    [`${makeUnit(2, 4, 'target-5-')}`]: 1,
    [`${makeUnit(3, 4, 'target-5-')}`]: 1,
    [`${makeUnit(4, 4, 'target-5-')}`]: 1,
    [`${makeUnit(4, 3, 'target-5-')}`]: 1
  },
};

// Assign appropriate task targets based on the group
const taskTargets = group === 'experiment' ? expTaskTargets : ctrlTaskTargets;

// Prep data vars
let taskGridVars = {};
for (let i = 0; i < 5; i++) {
  taskGridVars[`task_${i + 1}`] = makeGridVars(N, showCenter = false);
}

//check function
function getTargetShape(tasks, taskNumber) {
  return Object.keys(tasks[`task_${taskNumber}`]).sort().join(',');
}



function normalize(shape) {
  const coords = shape.split(',').map(coord => coord.split('_').map(Number));
  const minX = Math.min(...coords.map(coord => coord[0]));
  const minY = Math.min(...coords.map(coord => coord[1]));
  return coords.map(([x, y]) => `${x - minX}_${y - minY}`).join(',');
}




function CheckShape(taskNumber, tabVars) {
  const taskGrid = getTaskcheckid(tabVars,taskNumber);
  /*console.log("taskGrid:", taskGrid); // 输出taskGrid以检查其内容*/

  let targetShape = getTargetShape(tasks, taskNumber).replace(/\s+/g, '');

  let taskShape = Object.keys(taskGrid).sort().join(',').replace(/\s+/g, '');
  
  targetShape = normalize(targetShape);
  taskShape = normalize(taskShape);

  let nextButton = document.getElementById(`task-${taskNumber}-next-btn`);

  // 如果目标形状和任务形状不同，则禁用Next按钮
  if (targetShape !== taskShape) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }
}




// 生成任务页面
function generateTaskDiv(index, limit = 1, gridVar, targetGridVar, display = true) {
  const taskDiv = createCustomElement('div', '', `task-${index}`);

  const baseDiv = createCustomElement('div', 'frame-simple', '');
  baseDiv.append(createText('h2', `Task ${index} / 5`));

  const taskWrapper = createCustomElement('div', 'taskwrapper', '');

  const targetGroup = createCustomElement('div', 'targetgroup', `target-${index}-group`);
  const targetGrid = createCustomElement('table', 'target-tabs', `target-${index}-grid`);
  for (let i = 0; i < N; i++) {
    let tcCodeList = targetGrid.insertRow();
    for (let j = 0; j < N; j++) {
      let tcell = tcCodeList.insertCell();
      let cellId = makeUnit(i, j, `target-${index}-`);
      tcell.id = cellId;
      tcell.style.backgroundColor = (targetGridVar[cellId] > 0) ? 'black' : '#fafafa';
    }
  }
  targetGroup.append(targetGrid);

  const taskGroup = createCustomElement('div', 'taskgroup', `task-${index}-group`);

  const taskDesc = createCustomElement('div', '', '');
  taskDesc.style.marginLeft = '55px';
  

  const taskbox = createCustomElement('div', 'taskbox', '');
  const taskinnerbox = createCustomElement('div', 'taskinnerbox', '');
  let taskGrid = createCustomElement('table', 'demo-tabs', `task-${index}-grid`);
  for (let i = 0; i < N; i++) {
    let tcCodeList = taskGrid.insertRow();
    for (let j = 0; j < N; j++) {
      let tcell = tcCodeList.insertCell();
      let cellId = makeUnit(i, j, `task-${index}-`);
      tcell.id = cellId;
      tcell.style.backgroundColor = '#fff';
      tcell.style.border = '#fff solid 1px';
      if (i == Math.floor(N / 2) && j == Math.floor(N / 2)) {
        tcell.style.borderColor = 'red';
      }
    }
  }
  taskinnerbox.append(taskGrid);
  taskbox.append(taskinnerbox);

  taskGroup.append(taskDesc);
  taskGroup.append(taskbox);

  taskWrapper.append(targetGroup);
  taskWrapper.append(taskGroup);
  baseDiv.append(taskWrapper);

  const btnDiv = createCustomElement('div', 'button-group-vc', '');
  btnDiv.append(createBtn(`task-${index}-clear-btn`, 'Clear all', true, 'big-button'));
  btnDiv.append(createBtn(`task-${index}-next-btn`, 'Next', false, 'big-button'));

  taskDiv.append(baseDiv);
  taskDiv.append(btnDiv);

  taskDiv.style.display = display ? 'block' : 'none';
  return taskDiv;
}

// Generate task pages
document.getElementById('training-task').append(generateTaskDiv(1, 1, taskGridVars['task_1'], taskTargets['task_1'], true));
document.getElementById('task-1-next-btn').onclick = () => {
  resetGrid('task-1', taskGridVars['task_1'], N, false);
  switchTask('task-1', 'task-2', 'block');
  training_task1_end_time = Date.now();
};
document.getElementById('task-1-clear-btn').onclick = () => {
  resetGrid('task-1', taskGridVars['task_1'], N, false);
  document.getElementById('task-1-grid').querySelectorAll('td').forEach(cell => {
    cell.style.backgroundColor = '#fff';
  });
  keyPresses['task_1'].push('clear');
};

document.getElementById('training-task').append(generateTaskDiv(2, 2, taskGridVars['task_2'], taskTargets['task_2'], false));
document.getElementById('task-2-next-btn').onclick = () => {
  resetGrid('task-2', taskGridVars['task_2'], N, false);
  switchTask('task-2', 'task-3', 'block');
  training_task2_end_time = Date.now();
};
document.getElementById('task-2-clear-btn').onclick = () => {
  resetGrid('task-2', taskGridVars['task_2'], N, false);
  document.getElementById('task-2-grid').querySelectorAll('td').forEach(cell => {
    cell.style.backgroundColor = '#fff';
  });
  keyPresses['task_2'].push('clear');
};

document.getElementById('training-task').append(generateTaskDiv(3, 3, taskGridVars['task_3'], taskTargets['task_3'], false));
/*document.getElementById('task-3-next-btn').onclick = () => switchTask('task-3', 'test-intro', 'block');*/
document.getElementById('task-3-next-btn').onclick = () => {
  resetGrid('task-3', taskGridVars['task_3'], N, false);
  switchTask('task-3', 'task-4', 'block');
  training_end_time = Date.now();

  console.log("Training time:", training_end_time - training_start_time);
  
};
document.getElementById('task-3-clear-btn').onclick = () => {
  resetGrid('task-3', taskGridVars['task_3'], N, false);
  document.getElementById('task-3-grid').querySelectorAll('td').forEach(cell => {
    cell.style.backgroundColor = '#fff';
  });
  keyPresses['task_3'].push('clear');
};

document.getElementById('training-task').append(generateTaskDiv(4, 4, taskGridVars['task_4'], taskTargets['task_4'], false));
document.getElementById('task-4-next-btn').onclick = () => {
  resetGrid('task-4', taskGridVars['task_4'], N, false);
  switchTask('task-4', 'task-5', 'block');
  control_taskR_end_time = Date.now();
  console.log("Control taskL time:", control_taskR_end_time - training_end_time);
};
document.getElementById('task-4-clear-btn').onclick = () => {
  resetGrid('task-4', taskGridVars['task_4'], N, false);
  document.getElementById('task-4-grid').querySelectorAll('td').forEach(cell => {
    cell.style.backgroundColor = '#fff';
  });
  keyPresses['task_4'].push('clear');
};

document.getElementById('training-task').append(generateTaskDiv(5, 5, taskGridVars['task_5'], taskTargets['task_5'], false));
document.getElementById('task-5-next-btn').onclick = () => {  
  switchTask('task-5', 'test-intro', 'block');
  control_taskF_end_time = Date.now();
  //console.log("Control taskF time:", control_taskF_end_time - control_taskR_end_time);
};
document.getElementById('task-5-clear-btn').onclick = () => {
  resetGrid('task-5', taskGridVars['task_5'], N, false);
  document.getElementById('task-5-grid').querySelectorAll('td').forEach(cell => {
    cell.style.backgroundColor = '#fff';
  });
  keyPresses['task_5'].push('clear');
}


//add key functions for training sessions 


document.addEventListener('keydown', function (event) {
  let taskNumber = 0;
 
  let key = event.key;

  if (document.getElementById('task-1').style.display === 'block') {
    taskNumber = 1;
  } else if (document.getElementById('task-2').style.display === 'block') {
    taskNumber = 2;
  } else if (document.getElementById('task-3').style.display === 'block') {
    taskNumber = 3;
  } else if (document.getElementById('task-4').style.display === 'block') {
    taskNumber = 4;
  } else if (document.getElementById('task-5').style.display === 'block') {
    taskNumber = 5;
  }

  if (taskNumber > 0) {
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        moveFunction(key, `task-${taskNumber}`, taskGridVars[`task_${taskNumber}`], 1, N);
        keyPresses[`task_${taskNumber}`].push(key);
        break;
      case 'r':
        rotateRightCenter2(`task-${taskNumber}`, taskGridVars[`task_${taskNumber}`], N);
        keyPresses[`task_${taskNumber}`].push(key);
        break;
      case 'l':
        addLshape(`task-${taskNumber}`, taskGridVars[`task_${taskNumber}`], N);
        keyPresses[`task_${taskNumber}`].push(key);
        break;
      case 'f':
        flipLeftRight(`task-${taskNumber}`, taskGridVars[`task_${taskNumber}`], N);
        keyPresses[`task_${taskNumber}`].push(key);
        break;
    }
    CheckShape(taskNumber, taskGridVars);
  }
});

function moveFunction(key, taskId, taskGridVar, num, N) {
  switch (key) {
    case 'ArrowUp':
      moveUpInf(taskId, taskGridVar, num, N);
      break;
    case 'ArrowDown':
      moveDownInf(taskId, taskGridVar, num, N);
      break;
    case 'ArrowLeft':
      moveLeftInf(taskId, taskGridVar, num, N);
      break;
    case 'ArrowRight':
      moveRightInf(taskId, taskGridVar, num, N);
      break;
  }
}



let task_start_time = 0;
let task1_end_time = 0;
let task2_end_time = 0;
let task3_end_time = 0;
let task4_end_time = 0;
let task5_end_time = 0;



// **Test instructions */
const testIntroNextBtn = document.getElementById('test-intro-next-btn');
testIntroNextBtn.onclick = () => {
  hide('test-intro');
  resetGrid('test-task-1', test_taskGridVars['task_1'], N, false);
  showNext('instruction-quiz', 'block');
  keyPresses_test['test-task-1'] = [];
}

/** Instruction quiz */
const introQuizForm = document.getElementById('intro-quiz-form');
const introRetryBtn = document.getElementById('intro-retry-btn');
const introPassBtn = document.getElementById('intro-pass-btn');
const introQuizCheckBtn = document.getElementById('intro-quiz-check-btn');

const introChecks = [ 'intro1', 'intro2', 'intro3', 'intro4', 'intro5'];
const introAnswers = [ true, false, false, true, true];

introQuizCheckBtn.onclick = () => {
  introQuizCheckBtn.style.display = 'none';
  let inputs = [];
  introChecks.map(check => {
    const vals = document.getElementsByName(check);
    inputs.push(vals[0].checked);
  });
  const pass = (inputs.join('') === introAnswers.join(''));
  if (pass) {
    hide('intro-quiz-check-btn');
    showNext('intro-pass', 'block');
  } else {
    showNext('intro-retry', 'block');
  }
}

introRetryBtn.onclick = () => {
  hide("intro-retry");
  hide("instruction-quiz");
  showNext("test-intro", "block");
  introQuizCheckBtn.style.display = 'flex';
};
introPassBtn.onclick = () => {
  hide("instruction-quiz");
  showNext('test-task', 'block');
  task_start_time = Date.now();
}




introQuizForm.onchange = () => compIsFilled(introAnswers.length + trainingAnswers.length) ? introQuizCheckBtn.disabled = false : null;




// **Test session */

let test_nCorrect = 0;


// Initialize task definitions and targets


const test_Targets = {
  'task_1': parseCoordinates('(2,3),(2,4),(2,5),(3,3),(3,5),(4,3),(4,5),(5,3),(5,4)'),
  'task_2': parseCoordinates('(2,4),(3,3),(3,4),(4,2),(4,3),(4,4),(4,5),(5,2),(5,4)'),
  'task_3': parseCoordinates('(3,4),(3,5),(4,2),(4,3),(4,4),(4,5),(5,2),(5,5),(5,6)'),
  'task_4': parseCoordinates('(2,3),(2,4),(2,5),(3,4),(3,5),(4,3),(4,4),(5,4),(5,5)')
};



let keyPresses_test = {
  'test-task-1': [],
  'test-task-2': [],
  'test-task-3': [],
  'test-task-4': []
};


//randomize the order of the tasks
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

let shuffledTargets = ['task_1', 'task_2', 'task_3', 'task_4'];
shuffle(shuffledTargets);


const rTestTargets = {
  'task_1': test_Targets[shuffledTargets[0]],
  'task_2': test_Targets[shuffledTargets[1]],
  'task_3': test_Targets[shuffledTargets[2]],
  'task_4': test_Targets[shuffledTargets[3]]
};


const taskOrder = shuffledTargets;




function getTargetShape2(rTestTargets, taskNumber) {
  return Object.keys(rTestTargets[`task_${taskNumber}`]).sort().join(',');
}



function CheckShape_test(taskNumber, tabVars) {
  const taskGrid = getTaskcheckid(tabVars, taskNumber);
  let targetShape2 = getTargetShape2(rTestTargets, taskNumber).replace(/\s+/g, '');
  let taskShape2 = Object.keys(taskGrid).sort().join(',').replace(/\s+/g, '');
  // Normalize the shapes
  targetShape2 = normalize(targetShape2);
  taskShape2 = normalize(taskShape2);
  return targetShape2 === taskShape2;
}



// Define task shapes
const test_taskTargets = {
  'task_1': {
    [`${makeUnit(2, 3, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
    [`${makeUnit(2, 4, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
    [`${makeUnit(2, 5, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
    [`${makeUnit(3, 3, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
    [`${makeUnit(3, 5, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 3, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 5, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 3, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 4, 'test-target-' + (shuffledTargets.indexOf('task_1') + 1) + '-')}`]: 1,
  },
  'task_2': {
    [`${makeUnit(2, 4, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
    [`${makeUnit(3, 3, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
    [`${makeUnit(3, 4, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 2, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 3, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 4, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 5, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 2, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 4, 'test-target-' + (shuffledTargets.indexOf('task_2') + 1) + '-')}`]: 1,
  },
  'task_3': {
    [`${makeUnit(3, 4, 'test-target-'+(shuffledTargets.indexOf('task_3') + 1) + '-')}`]: 1,
    [`${makeUnit(3, 5, 'test-target-'+(shuffledTargets.indexOf('task_3') + 1) + '-')}`]: 1, 
    [`${makeUnit(4, 2, 'test-target-'+(shuffledTargets.indexOf  ('task_3') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 3, 'test-target-'+(shuffledTargets.indexOf('task_3') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 4, 'test-target-'+(shuffledTargets.indexOf('task_3') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 5, 'test-target-'+(shuffledTargets.indexOf('task_3') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 2, 'test-target-'+(shuffledTargets.indexOf('task_3') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 5, 'test-target-'+(shuffledTargets.indexOf('task_3') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 6, 'test-target-'+(shuffledTargets.indexOf('task_3') + 1) + '-')}`]: 1,
  },
  'task_4': {
    [`${makeUnit(2, 3, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
    [`${makeUnit(2, 4, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
    [`${makeUnit(2, 5, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
    [`${makeUnit(3, 4, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
    [`${makeUnit(3, 5, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 3, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
    [`${makeUnit(4, 4, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 4, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
    [`${makeUnit(5, 5, 'test-target-'+(shuffledTargets.indexOf('task_4') + 1) + '-')}`]: 1,
  }
};


const randomizedTaskTargets = {
  'task_1': test_taskTargets[shuffledTargets[0]],
  'task_2': test_taskTargets[shuffledTargets[1]],
  'task_3': test_taskTargets[shuffledTargets[2]],
  'task_4': test_taskTargets[shuffledTargets[3]]
  
};






// Initialize grid variables
let test_taskGridVars = {};
let test_taskData = {};
for (let i = 1; i <= 4; i++) {
  test_taskGridVars[`task_${i}`] = makeGridVars(N, false);
  test_taskData[`task_${i}`] = [];
}

// Function to generate task div
function test_generateTaskDiv(index, gridVar, targetGridVar, display = true) {
  const taskDiv = createCustomElement('div', 'task', `test-task-${index}`);
  const baseDiv = createCustomElement('div', 'frame-simple', '');
  baseDiv.append(createText('h2', `Task ${index} / 4`));

  const taskWrapper = createCustomElement('div', 'taskwrapper', '');

  const targetGroup = createCustomElement('div', 'targetgroup', `test-target-${index}-group`);
  const targetGrid = createCustomElement('table', 'target-tabs', `test-target-${index}-grid`);
  
 
  

  for (let i = 0; i < N; i++) {
    let tcCodeList = targetGrid.insertRow();
    for (let j = 0; j < N; j++) {
      let tcell = tcCodeList.insertCell();
      let cellId = makeUnit(i, j, `test-target-${index}-`);
      tcell.id = cellId;
      if (targetGridVar[cellId] > 0) {
        tcell.style.backgroundColor = 'black';
      } else {
        tcell.style.backgroundColor = '#fafafa';
      }
    }
  }
  targetGroup.append(targetGrid);

  const taskGroup = createCustomElement('div', 'test-taskgroup', `test-task-${index}-group`);
  const taskDesc = createCustomElement('div', '', '');
  taskDesc.style.marginLeft = '55px';
 

  const taskbox = createCustomElement('div', 'taskbox', '');
  const taskinnerbox = createCustomElement('div', 'taskinnerbox', '');
  const taskGrid = createCustomElement('table', 'demo-tabs', `test-task-${index}-grid`);
  for (let i = 0; i < N; i++) {
    let tcCodeList = taskGrid.insertRow();
    for (let j = 0; j < N; j++) {
      let tcell = tcCodeList.insertCell();
      let cellId = makeUnit(i, j, `test-task-${index}-`);
      tcell.id = cellId;
      tcell.style.backgroundColor = '#fff';
      tcell.style.border = '#fff solid 1px';
      if (i == Math.floor(N / 2) && j == Math.floor(N / 2)) {
        tcell.style.borderColor = 'red';
      }
    }
  }
  taskinnerbox.append(taskGrid);
  taskbox.append(taskinnerbox);

  taskGroup.append(taskDesc);
  taskGroup.append(taskbox);

  taskWrapper.append(targetGroup);
  taskWrapper.append(taskGroup);
  baseDiv.append(taskWrapper);

  const btnDiv = createCustomElement('div', 'button-group-vc', '');
  btnDiv.append(createBtn(`test-task-${index}-next-btn`, 'Next', true, 'big-button'));

  taskDiv.append(baseDiv);
  taskDiv.append(btnDiv);

  taskDiv.style.display = display ? 'block' : 'none';
  return taskDiv;
}

// Generate task pages
document.getElementById('test-task').append(test_generateTaskDiv(1, test_taskGridVars['task_1'], randomizedTaskTargets['task_1'], true));
document.getElementById('test-task-1-next-btn').onclick = () => {switchTask('test-task-1', 'test-task-2', 'block');
resetGrid('test-task-1', test_taskGridVars['task_1'], N, false);
  task1_end_time = Date.now();
  console.log("Task 1 time:", task1_end_time - task_start_time);
};

document.getElementById('test-task').append(test_generateTaskDiv(2, test_taskGridVars['task_2'], randomizedTaskTargets['task_2'], false));
document.getElementById('test-task-2-next-btn').onclick = () => {
  resetGrid('test-task-2', test_taskGridVars['task_2'], N, false);
  switchTask('test-task-2', 'test-task-3', 'block');
  task2_end_time = Date.now();
  console.log("Task 2 time:", task2_end_time - task1_end_time);
};

document.getElementById('test-task').append(test_generateTaskDiv(3, test_taskGridVars['task_3'], randomizedTaskTargets['task_3'], false));
document.getElementById('test-task-3-next-btn').onclick = () => {
  resetGrid('test-task-3', test_taskGridVars['task_3'], N, false);
  switchTask('test-task-3', 'test-task-4', 'block');
  task3_end_time = Date.now();
  console.log("Task 3 time:", task3_end_time - task2_end_time);
};

document.getElementById('test-task').append(test_generateTaskDiv(4, test_taskGridVars['task_4'], randomizedTaskTargets['task_4'], false));
document.getElementById('test-task-4-next-btn').onclick = () => {
  resetGrid('test-task-4', test_taskGridVars['task_4'], N, false);
  switchTask('test-task-4', 'debrief', 'block');
  task4_end_time = Date.now();  
  console.log("Task 4 time:", task4_end_time - task3_end_time);
};



let test_taskResults = {
  'test-task-1': false,
  'test-task-2': false,
  'test-task-3': false,
  'test-task-4': false,
};

document.addEventListener('keydown', function (event) {
  if (event.key === "r") {
    if (document.getElementById('test-task-1').style.display === 'block') {
      rotateRightCenter2('test-task-1', test_taskGridVars['task_1'], N);
      test_taskResults['test-task-1'] = CheckShape_test(1, test_taskGridVars);
      keyPresses_test['test-task-1'].push('r');
    } else if (document.getElementById('test-task-2').style.display === 'block') {
      rotateRightCenter2('test-task-2', test_taskGridVars['task_2'], N);
      test_taskResults['test-task-2'] = CheckShape_test(2, test_taskGridVars);
      keyPresses_test['test-task-2'].push('r');
    } else if (document.getElementById('test-task-3').style.display === 'block') {
      rotateRightCenter2('test-task-3', test_taskGridVars['task_3'], N);
      test_taskResults['test-task-3'] = CheckShape_test(3, test_taskGridVars);
      keyPresses_test['test-task-3'].push('r');
    } else if (document.getElementById('test-task-4').style.display === 'block') {
      rotateRightCenter2('test-task-4', test_taskGridVars['task_4'], N);
      test_taskResults['test-task-4'] = CheckShape_test(4, test_taskGridVars);
      keyPresses_test['test-task-4'].push('r');
    } else if (document.getElementById('test-task-5').style.display === 'block') {
      rotateRightCenter2('test-task-5', test_taskGridVars['task_5'], N);
      test_taskResults['test-task-5'] = CheckShape_test(5, test_taskGridVars);
      keyPresses_test['test-task-5'].push('r');
    }
  }
});

// Add an L-shape figure
document.addEventListener('keydown', function (event) {
  if (event.key === "l") {
    if (document.getElementById('test-task-1').style.display === 'block') {
      addLshape('test-task-1', test_taskGridVars['task_1'], N);
      test_taskResults['test-task-1'] = CheckShape_test(1, test_taskGridVars);
      keyPresses_test['test-task-1'].push('l');
    } else if (document.getElementById('test-task-2').style.display === 'block') {
      addLshape('test-task-2', test_taskGridVars['task_2'], N);
      test_taskResults['test-task-2'] = CheckShape_test(2, test_taskGridVars);
      keyPresses_test['test-task-2'].push('l');
    } else if (document.getElementById('test-task-3').style.display === 'block') {
      addLshape('test-task-3', test_taskGridVars['task_3'], N);
      test_taskResults['test-task-3'] = CheckShape_test(3, test_taskGridVars);
      keyPresses_test['test-task-3'].push('l');
    } else if (document.getElementById('test-task-4').style.display === 'block') {
      addLshape('test-task-4', test_taskGridVars['task_4'], N);
      test_taskResults['test-task-4'] = CheckShape_test(4, test_taskGridVars);
      keyPresses_test['test-task-4'].push('l');
    } else if (document.getElementById('test-task-5').style.display === 'block') {
      addLshape('test-task-5', test_taskGridVars['task_5'], N);
      test_taskResults['test-task-5'] = CheckShape_test(5, test_taskGridVars);
      keyPresses_test['test-task-5'].push('l');
    }
  }
});

// Flip
document.addEventListener('keydown', function (event) {
  if (event.key === "f") {
    if (document.getElementById('test-task-1').style.display === 'block') {
      flipLeftRight('test-task-1', test_taskGridVars['task_1'], N);
      test_taskResults['test-task-1'] = CheckShape_test(1, test_taskGridVars);
      keyPresses_test['test-task-1'].push('f');
    } else if (document.getElementById('test-task-2').style.display === 'block') {
      flipLeftRight('test-task-2', test_taskGridVars['task_2'], N);
      test_taskResults['test-task-2'] = CheckShape_test(2, test_taskGridVars);
      keyPresses_test['test-task-2'].push('f');
    } else if (document.getElementById('test-task-3').style.display === 'block') {
      flipLeftRight('test-task-3', test_taskGridVars['task_3'], N);
      test_taskResults['test-task-3'] = CheckShape_test(3, test_taskGridVars);
      keyPresses_test['test-task-3'].push('f');
    } else if (document.getElementById('test-task-4').style.display === 'block') {
      flipLeftRight('test-task-4', test_taskGridVars['task_4'], N);
      test_taskResults['test-task-4'] = CheckShape_test(4, test_taskGridVars);
      keyPresses_test['test-task-4'].push('f');
    } else if (document.getElementById('test-task-5').style.display === 'block') {
      flipLeftRight('test-task-5', test_taskGridVars['task_5'], N);
      test_taskResults['test-task-5'] = CheckShape_test(5, test_taskGridVars);
      keyPresses_test['test-task-5'].push('f');
    }
  }
});

// Add key event for movements
document.addEventListener('keydown', function (event) { 
  switch (event.key) { 
  case 'ArrowUp': if (document.getElementById('test-task-1').style.display === 'block') {
    moveUpInf('test-task-1', test_taskGridVars['task_1'], 1, N);
    test_taskResults['test-task-1'] = CheckShape_test(1, test_taskGridVars);
    keyPresses_test['test-task-1'].push('up'); 
  } else if (document.getElementById('test-task-2').style.display === 'block') {
    moveUpInf('test-task-2', test_taskGridVars['task_2'], 1, N);
    test_taskResults['test-task-2'] = CheckShape_test(2, test_taskGridVars);
    keyPresses_test['test-task-2'].push('up');
  } else if (document.getElementById('test-task-3').style.display === 'block') {
    moveUpInf('test-task-3', test_taskGridVars['task_3'], 1, N);
    test_taskResults['test-task-3'] = CheckShape_test(3, test_taskGridVars);
    keyPresses_test['test-task-3'].push('up');
  } else if (document.getElementById('test-task-4').style.display === 'block') {
    moveUpInf('test-task-4', test_taskGridVars['task_4'], 1, N);
    test_taskResults['test-task-4'] = CheckShape_test(4, test_taskGridVars);
    keyPresses_test['test-task-4'].push('up');
  } else if (document.getElementById('test-task-5').style.display === 'block') {
    moveUpInf('test-task-5', test_taskGridVars['task_5'], 1, N);
    test_taskResults['test-task-5'] = CheckShape_test(5, test_taskGridVars);
    keyPresses_test['test-task-5'].push('up');
  }
  break;
case 'ArrowDown':
  if (document.getElementById('test-task-1').style.display === 'block') {
    moveDownInf('test-task-1', test_taskGridVars['task_1'], 1, N);
    test_taskResults['test-task-1'] = CheckShape_test(1, test_taskGridVars);
    keyPresses_test['test-task-1'].push('down');
  } else if (document.getElementById('test-task-2').style.display === 'block') {
    moveDownInf('test-task-2', test_taskGridVars['task_2'], 1, N);
    test_taskResults['test-task-2'] = CheckShape_test(2, test_taskGridVars);
    keyPresses_test['test-task-2'].push('down');
  } else if (document.getElementById('test-task-3').style.display === 'block') {
    moveDownInf('test-task-3', test_taskGridVars['task_3'], 1, N);
    test_taskResults['test-task-3'] = CheckShape_test(3, test_taskGridVars);
    keyPresses_test['test-task-3'].push('down');
  } else if (document.getElementById('test-task-4').style.display === 'block') {
    moveDownInf('test-task-4', test_taskGridVars['task_4'], 1, N);
    test_taskResults['test-task-4'] = CheckShape_test(4, test_taskGridVars);
    keyPresses_test['test-task-4'].push('down');
  } else if (document.getElementById('test-task-5').style.display === 'block') {
    moveDownInf('test-task-5', test_taskGridVars['task_5'], 1, N);
    test_taskResults['test-task-5'] = CheckShape_test(5, test_taskGridVars);
    keyPresses_test['test-task-5'].push('down');
  }
  break;
case 'ArrowLeft':
  if (document.getElementById('test-task-1').style.display === 'block') {
    moveLeftInf('test-task-1', test_taskGridVars['task_1'], 1, N);
    test_taskResults['test-task-1'] = CheckShape_test(1, test_taskGridVars);
    keyPresses_test['test-task-1'].push('left');
  } else if (document.getElementById('test-task-2').style.display === 'block') {
    moveLeftInf('test-task-2', test_taskGridVars['task_2'], 1, N);
    test_taskResults['test-task-2'] = CheckShape_test(2, test_taskGridVars);
    keyPresses_test['test-task-2'].push('left');
  } else if (document.getElementById('test-task-3').style.display === 'block') {
    moveLeftInf('test-task-3', test_taskGridVars['task_3'], 1, N);
    test_taskResults['test-task-3'] = CheckShape_test(3, test_taskGridVars);
    keyPresses_test['test-task-3'].push('left');
  } else if (document.getElementById('test-task-4').style.display === 'block') {
    moveLeftInf('test-task-4', test_taskGridVars['task_4'], 1, N);
    test_taskResults['test-task-4'] = CheckShape_test(4, test_taskGridVars);
    keyPresses_test['test-task-4'].push('left');
  } else if (document.getElementById('test-task-5').style.display === 'block') {
    moveLeftInf('test-task-5', test_taskGridVars['task_5'], 1, N);
    test_taskResults['test-task-5'] = CheckShape_test(5, test_taskGridVars);
    keyPresses_test['test-task-5'].push('left');
  }
  break;
case 'ArrowRight':
  if (document.getElementById('test-task-1').style.display === 'block') {
    moveRightInf('test-task-1', test_taskGridVars['task_1'], 1, N);
    test_taskResults['test-task-1'] = CheckShape_test(1, test_taskGridVars);
    keyPresses_test['test-task-1'].push('right');
  } else if (document.getElementById('test-task-2').style.display === 'block') {
    moveRightInf('test-task-2', test_taskGridVars['task_2'], 1, N);
    test_taskResults['test-task-2'] = CheckShape_test(2, test_taskGridVars);
    keyPresses_test['test-task-2'].push('right');
  } else if (document.getElementById('test-task-3').style.display === 'block') {
    moveRightInf('test-task-3', test_taskGridVars['task_3'], 1, N);
    test_taskResults['test-task-3'] = CheckShape_test(3, test_taskGridVars);
    keyPresses_test['test-task-3'].push('right');
  } else if (document.getElementById('test-task-4').style.display === 'block') {
    moveRightInf('test-task-4', test_taskGridVars['task_4'], 1, N);
    test_taskResults['test-task-4'] = CheckShape_test(4, test_taskGridVars);
    keyPresses_test['test-task-4'].push('right');
  } else if (document.getElementById('test-task-5').style.display === 'block') {
    moveRightInf('test-task-5', test_taskGridVars['task_5'], 1, N);
    test_taskResults['test-task-5'] = CheckShape_test(5, test_taskGridVars);
    keyPresses_test['test-task-5'].push('right');
  }
  break;
}
});

/** Debrief and save */
const doneBtn = document.getElementById('done-btn');
const debriefForm = document.getElementById('postquiz');

debriefForm.onchange = () => {
  isFilled('postquiz')? doneBtn.disabled = false: null;
}
doneBtn.onclick = () => {
  let inputs = debriefForm.elements;
  Object.keys(inputs).forEach(id => subjectData[inputs[id].name] = inputs[id].value);

  // Clean up free responses
  /*subjectData['feedback'] = removeSpecial(subjectData['feedback']);*/

  const end_time = new Date();
  let token = generateToken(8);

  /*subjectData['condition'] = cond;*/
  subjectData['condition'] = group;
  subjectData['taskOrder'] = taskOrder;

  //subjectData['date'] = formatDates(end_time, 'date'); 
  /*console.log(subjectData['date']);*/
  subjectData['time'] = formatDates(end_time, 'time');
  subjectData['exercise_duration'] = exercise_end_time - exercise_start_time;
  subjectData['training_duration'] = training_end_time - training_start_time;
  subjectData['training_task1_duration'] = training_task1_end_time - training_start_time;
  subjectData['training_task2_duration'] = training_task2_end_time - training_task1_end_time;
  subjectData['training_task3_duration'] = training_end_time - training_task2_end_time;
  subjectData['control_taskR_duration'] = control_taskR_end_time - training_end_time;
  subjectData['control_taskF_duration'] =control_taskF_end_time - control_taskR_end_time
  subjectData['task1_duration'] = task1_end_time - task_start_time;
  subjectData['task2_duration'] = task2_end_time - task1_end_time;
  subjectData['task3_duration'] = task3_end_time - task2_end_time;
  subjectData['task4_duration'] = task4_end_time - task3_end_time;
  subjectData['interval_duration'] = task_start_time - control_taskF_end_time;
  subjectData['total_experiment_duration'] = task4_end_time - exercise_start_time;
  


  //record keyPresses for each task
  let keyPresses_training = {};
  for (let key in keyPresses) {
    if (key.startsWith('task_')) {
      keyPresses_training[key] = keyPresses[key].slice();
    }
  }
  //filter out keyPresses for training tasks, only keep 'l', 'r', 'f'
  let keyPresses_training_filtered = {};
  for (let key in keyPresses) {
    if (key.startsWith('task_')) {
      keyPresses_training_filtered[key] = keyPresses[key].filter(press => press === 'l' || press === 'r' || press === 'f' || press === 'clear');
    }
  }
  // filter out keyPresses for test tasks, only keep 'l', 'r', 'f'
  let keyPresses_test_filtered = {};
  for (let key in keyPresses_test) {
    if (key.startsWith('test-task-')) {
      keyPresses_test_filtered[key] = keyPresses_test[key].filter(press => press === 'l' || press === 'r' || press === 'f');
    }
  }
  subjectData['keyPresses_training'] = keyPresses_training;
  subjectData['keyPresses_training_filtered'] = keyPresses_training_filtered;
  subjectData['keyPresses_test'] = keyPresses_test;
  subjectData['keyPresses_test_filtered'] = keyPresses_test_filtered;

  
  subjectData['test_taskResults'] = test_taskResults; //true or false

  //记录正确task的数目
  let ncorrect = Object.values(test_taskResults).filter(value => value === true).length;
  subjectData['ncorrect'] = ncorrect; //number of correct tasks

//计算每个test task 的关键步骤数
let critical_steps = {};
for (let key in keyPresses_test_filtered) {
  critical_steps[key] = keyPresses_test_filtered[key].length;
}
console.log(critical_steps);
subjectData['critical_steps'] = critical_steps;


//记录用最少步数完成的任务数  
let ncorrect_bonus = 0;

for (let key in test_taskResults) {
  if (test_taskResults[key] === true && critical_steps[key] !== undefined) {
    if (
      (key === 'test-task-1' && critical_steps[key] === 5) ||
      (key === 'test-task-2' && critical_steps[key] === 5) ||
      (key === 'test-task-3' && critical_steps[key] === 6) ||
      (key === 'test-task-4' && critical_steps[key] === 5)
    ) {
      ncorrect_bonus++;
    }
  }
}
subjectData['ncorrect_bonus'] = ncorrect_bonus; //number of correct bonus tasks


//计算按键次数
let keyPressCount_test = {};

for (let task in keyPresses_test) {
  keyPressCount_test[task] = {};
  keyPresses_test[task].forEach(key => {
    if (key in keyPressCount_test[task]) {
      keyPressCount_test[task][key]++;
    } else {
      keyPressCount_test[task][key] = 1;
    }
  });
}
subjectData['keyPressCount'] = keyPressCount_test;

subjectData['token'] = token; //生成一个8位数的包含大写字母和数字的随机令牌

let results_str = JSON.stringify(subjectData);
console.log(results_str); 





// Send results_str to the server
/*jQuery.ajax({
  url: 'data_pilot.php',
  type: 'POST',
  data: {results: results_str},
  success: function(data) {
    console.log('Sent data to database');
    alert('Sent data to database');
  },
  error:function(xhr, status, error)
  {
    //Just print out what comes back if it doesn't work
    console.log(xhr, status, error);
  }
})*/


//save_data();

// save_data_with_retry(results_str, 3, 2000);

 //showCompletion('C12721UB', nCorrect);
//showCompletion(token, nCorrect);

}
