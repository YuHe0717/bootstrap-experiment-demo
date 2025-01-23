
/* Div functions */

//showing or revealing hidden elements
function showNext(id, display = "flex", center = true) {
  let div = document.getElementById(id);
  div.style.display = display;
  if (center) {
    div.scrollIntoView(center);
  }
}
function reveal(id) {
  let div = document.getElementById(id);
  div.style.opacity = 1;
}
function hide(id) {
  let div = document.getElementById(id);
  div.style.display = "none";
}

//switch between different sections or tasks on a web page by hiding the current section and showing the next one.
function switchTask(idToHide, idToShow, style) {
  hide(idToHide);
  showNext(idToShow, style)
}


// SVG elements: SVG elements provide a powerful and flexible way to create scalable and interactive graphics on the web
function createCustomElement (type = 'div', className = '', id = '') {
  let element = (["svg", "polygon"].indexOf(type) < 0) ?
    document.createElement(type) :
    document.createElementNS("http://www.w3.org/2000/svg", type);
  if (className.length > 0) element.setAttribute("class", className);
  if (id.length > 0) element.setAttribute("id", id);
  return element;
}

function createText(h = "h1", text = 'hello') {
  let element = document.createElement(h);
  let tx = document.createTextNode(text);
  element.append(tx);
  return(element)
}

//It uses setAttribute() method to set the attribute on the element el.

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function createBtn (btnId, text = "Button", on = true, className = "task-button") {
  let btn = createCustomElement("button", className, btnId);
  btn.disabled = !on;
  (text.length > 0) ? btn.append(document.createTextNode(text)): null;
  return(btn)
}


/* Form functions */
function isFilled (formID) {
  let notFilled = false;
  const nulls = [ '', '--', '', '--', '', '--' ];
  const form = document.getElementById(formID);
  const inputs = form.elements;
  (Object.keys(inputs)).forEach((input, idx) => {
    let field = inputs[input];
    notFilled = (notFilled || (field.value === nulls[idx]));
  });
  return (!notFilled)
}


function disableFormInputs (formId) {
  const form = document.getElementById(formId);
  const inputs = form.elements;
  (Object.keys(inputs)).forEach((input) => inputs[input].disabled = true);
}

function findAllIndex(element, array) {
  let indices = [];
  let idx = array.indexOf(element);
  while (idx != -1) {
    indices.push(idx);
    idx = array.indexOf(element, idx + 1);
  }
  return(indices);
}
function compIsFilled (nChecks) {
  let radios = document.getElementsByTagName('input');
  let checked = 0;
  for (let i = 0; i < radios.length; i++) {
      checked += radios[i].checked;
  }
  return (checked == nChecks)
}





/* Grid generator */

//n: the size of the grid
//showCenter: A boolean flag indicating whether to mark the center cell of the grid with a value of 1.
//prefix: An optional prefix to be added to each variable's ID.
/*Inside the function
It initializes an empty object varList to store the grid variables.
For each cell, it calculates a unique ID using the makeUnit function, passing the row index i, column index j, and optional prefix.
 */
function makeGridVars(n, showCenter = true, prefix='') {
  let varList = {};
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let cId = makeUnit(i, j, prefix);
      if (showCenter && i==Math.floor(n/2) && j==Math.floor(n/2)) {
        varList[cId] = 1;
      } else {
        varList[cId] = 0;
      }
    }
  }
  return varList
}


/*
function makeGridTarget(n, opt, prefix) {
  let varList = makeGridVars(n, false, prefix);
  let [ centerX, centerY ] = [ Math.floor(n/2), Math.floor(n/2) ];
  switch(opt) {
    case 'rotate1':
      varList[makeUnit(centerX, centerY+1, prefix)] = 1;
      varList[makeUnit(centerX, centerY, prefix)] = 1;
      varList[makeUnit(centerX-1, centerY, prefix)] = 1;
      varList[makeUnit(centerX-2, centerY, prefix)] = 1;
      break;
    case 'rotate2':
      varList[makeUnit(centerX, centerY+1, prefix)] = 1;
      varList[makeUnit(centerX, centerY+2, prefix)] = 1;
      varList[makeUnit(centerX, centerY, prefix)] = 1;
      varList[makeUnit(centerX+1, centerY, prefix)] = 1;
      break;
    case 'rotate3':
      varList[makeUnit(centerX, centerY-1, prefix)] = 1;
      varList[makeUnit(centerX, centerY, prefix)] = 1;
      varList[makeUnit(centerX-1, centerY, prefix)] = 1;
      varList[makeUnit(centerX-2, centerY, prefix)] = 1;
      break;
    case 'flip1':
      varList[makeUnit(centerX, centerY-1, prefix)] = 1;
      varList[makeUnit(centerX, centerY, prefix)] = 1;
      varList[makeUnit(centerX-1, centerY, prefix)] = 1;
      varList[makeUnit(centerX-2, centerY, prefix)] = 1;
      break;
    case 'flip2':
      varList[makeUnit(centerX, centerY, prefix)] = 1;
      varList[makeUnit(centerX, centerY-1, prefix)] = 1;
      varList[makeUnit(centerX, centerY+1, prefix)] = 1;
      varList[makeUnit(centerX, centerY-2, prefix)] = 1;
      varList[makeUnit(centerX, centerY+2, prefix)] = 1;
      varList[makeUnit(centerX, centerY+3, prefix)] = 1;
      break;
    case 'flip3':
      varList[makeUnit(centerX, centerY, prefix)] = 1;
      varList[makeUnit(centerX-1, centerY, prefix)] = 1;
      varList[makeUnit(centerX+1, centerY, prefix)] = 1;
      varList[makeUnit(centerX-2, centerY, prefix)] = 1;
      varList[makeUnit(centerX+2, centerY, prefix)] = 1;
      varList[makeUnit(centerX-3, centerY, prefix)] = 1;
      break;
  }
  return varList;
}
*/



/* Key-maker button functions */

/*function recordClick(div, tabVars) {
  const cellId = div.id.split('-')[3];
  tabVars[cellId] += 1;
  div.style.backgroundColor = (tabVars[cellId] % 2 == 1) ? 'black' : 'white';
}
*/

/*function setInitClick(div, divPostId, tabVarThis, tabVarPost) {
  const cellId = div.id.split('-')[3];
  tabVarThis[cellId] += 1;
  tabVarPost[cellId] += 1;
  div.style.backgroundColor = (tabVarThis[cellId] % 2 == 1) ? 'black' : 'white';
  const repCellId = divPostId + '-' + cellId;
  document.getElementById(repCellId).style.backgroundColor = (tabVarPost[cellId] % 2 == 1) ? 'black' : 'white';
}
*/

function getX(tabId, prefix='') {
  if (prefix.length > 0) {
    console.log(tabId);
  } else {
    return parseInt(tabId.slice(1).split('-')[0])
  }
}
function getY(tabId) {
  return parseInt(tabId.slice(1).split('-')[1])
}
function matchLimit(x, limit) {
  return (x < 0)? x + limit: x % limit;
}
function makeUnit(x, y, prefix='') {
  return `${prefix}c${x}-${y}`;
}

//Checks if the value (val) of the current cell is odd (indicating it is selected). why?
//Object.entries(obj) —— 返回一个包含该对象所有 [key, value] 键值对的数组。
 

function getCurrentBlocks (tabVars) {
  const selected = []
  for (const [tab, val] of Object.entries(tabVars)) {
    (val % 2 ==1) ? selected.push(tab) : null;
  }
  return selected;
 
}
/*
function getTaskcheckid(tabVars) {
  const taskcheckid = [];
  for (const [tab, val] of Object.entries(tabVars)) {
    (val % 2 === 1) ? taskcheckid.push(tab) : null;
  }
  const Taskcheckid = {};
  taskcheckid.forEach(item => {
    const [row, col] = item.slice(1).split('-').map(Number); // 去掉括号并拆分为数字
    Taskcheckid[`(${row},${col})`] = 1;
  });
  return Taskcheckid;
}*/

/*
function getTaskcheckid(tabVars) {
  const taskcheckid = [];
  for (const [tab, val] of Object.entries(tabVars)) {
      if (val % 2 === 1) {
          taskcheckid.push(tab);
      }
  }
  const Taskcheckid = {};
  taskcheckid.forEach(item => {
      const [row, col] = item.slice(1, -1).split(',').map(Number); // 去掉括号并拆分为数字
      Taskcheckid[`(${row},${col})`] = 1;
  });
  return Taskcheckid;
}
*/

/*
function getTaskcheckid(tabVars) {
  const taskcheckid = [];
  console.log("tabVars:", tabVars); // 输出tabVars以检查其内容
  for (const [tab, val] of Object.entries(tabVars)) {
      if (val % 2 === 1) {
          taskcheckid.push(tab);
      }
  }
  const Taskcheckid = {};
  taskcheckid.forEach(item => {
      const [row, col] = item.slice(1, -1).split(',').map(Number); // 去掉括号并拆分为数字
      Taskcheckid[`(${row},${col})`] = 1;
  });
  console.log("Taskcheckid:", Taskcheckid); // 输出Taskcheckid以检查其内容
  return Taskcheckid;
}
*/

function getTaskcheckid(tabVars) {
  const taskcheckid = [];
 

  for (const [task, vars] of Object.entries(tabVars)) {
      for (const [tab, val] of Object.entries(vars)) {
          
          if (val % 2 === 1) { // 如果是奇数
              taskcheckid.push(tab);
          }
      }
  }

  const Taskcheckid = {};
  taskcheckid.forEach(item => {
      const [row, col] = item.slice(1).split('-').map(Number); // 去掉括号并拆分为数字
      Taskcheckid[`${row}_${col}`] = 1;
  });

  return Taskcheckid;
} //task2-3会保留task1的数据


/*function getTaskcheckid(tabVars, taskNumber) {
  const taskcheckid = [];


  const vars = tabVars[`task_${taskNumber}`];
  for (const [tab, val] of Object.entries(vars)) {
   
      if (val % 2 === 1) { // 如果是奇数
          taskcheckid.push(tab);
      }
  }

  const Taskcheckid = {};
  taskcheckid.forEach(item => {
      const [row, col] = item.slice(1).split('-').map(Number); // 去掉括号并拆分为数字
      Taskcheckid[`(${row},${col})`] = 1;
  });

  console.log("Taskcheckid:", Taskcheckid); // 输出Taskcheckid以检查其内容
  return Taskcheckid;
}*/



/*function getTaskcheckid(tabVars, taskNumber) {
  // 检查tabVars是否包含所有的任务
  if (!tabVars[`task_${taskNumber}`]) {
  
    return {};
  }

  const taskcheckid = [];

  const vars = tabVars[`task_${taskNumber}`];
  for (const [tab, val] of Object.entries(vars)) {
    
      if (val % 2 === 1) { // 如果是奇数
          taskcheckid.push(tab);
      }
  }
  const Taskcheckid = {};
  taskcheckid.forEach(item => {
      const [row, col] = item.slice(1).split('-').map(Number); // 去掉括号并拆分为数字
      Taskcheckid[`(${row},${col})`] = 1;
  });

  console.log("Taskcheckid:", Taskcheckid); // 输出Taskcheckid以检查其内容
  return Taskcheckid;
}*/



//This line of code is a conditional (ternary) operator. It checks if the length of the divPrefix string is greater than 0. 
//If it is, it constructs a new string elId by concatenating divPrefix, a hyphen, and blockId. 
//If the length of divPrefix is not greater than 0 (i.e., it's empty), it assigns elId the value of blockId directly.
function fillBlock (divPrefix, tabVars, blockId) {
  let elId = (divPrefix.length > 0) ? `${divPrefix}-${blockId}`: blockId;
  let blockEl = document.getElementById(elId);
  blockEl.style.backgroundColor = 'black';
  tabVars[blockId] += 1;
}
function clearBlock (divPrefix, tabVars, blockId) {
  let blockEl = document.getElementById(`${divPrefix}-${blockId}`);
  blockEl.style.backgroundColor = 'white';
  tabVars[blockId] += 1;
}
// Add function to fill the central block
function fillCenterBlock(prefix, grid) {
  let centerBlockId = makeUnit(Math.floor(N / 2), Math.floor(N / 2), prefix + '-');
  fillBlock(prefix, grid, centerBlockId);
  grid[centerBlockId] = 1;
}

function moveDownInf(divPrefix, tabVars, n, limit) {
  let curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    let newIds = [];
    curIds.forEach(el => newIds.push(makeUnit(matchLimit(getX(el)+n, limit), getY(el))));
    curIds.filter(el => newIds.indexOf(el) < 0).forEach(el=>clearBlock(divPrefix, tabVars, el));
    newIds.filter(el => curIds.indexOf(el) < 0).forEach(el=>fillBlock(divPrefix, tabVars, el));
  }
}
function moveUpInf(divPrefix, tabVars, n, limit) {
  let curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    let newIds = [];
    curIds.forEach(el => newIds.push(makeUnit(matchLimit(getX(el)-n, limit), getY(el))));
    curIds.filter(el => newIds.indexOf(el) < 0).forEach(el=>clearBlock(divPrefix, tabVars, el));
    newIds.filter(el => curIds.indexOf(el) < 0).forEach(el=>fillBlock(divPrefix, tabVars, el));
  }
}
function moveRightInf(divPrefix, tabVars, n, limit) {
  let curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    let newIds = [];
    curIds.forEach(el => newIds.push(makeUnit(getX(el), matchLimit(getY(el)+n, limit))));
    curIds.filter(el => newIds.indexOf(el) < 0).forEach(el=>clearBlock(divPrefix, tabVars, el));
    newIds.filter(el => curIds.indexOf(el) < 0).forEach(el=>fillBlock(divPrefix, tabVars, el));
  }
}
function moveLeftInf(divPrefix, tabVars, n, limit) {
  let curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    let newIds = [];
    curIds.forEach(el => newIds.push(makeUnit(getX(el), matchLimit(getY(el)-n, limit))));
    curIds.filter(el => newIds.indexOf(el) < 0).forEach(el=>clearBlock(divPrefix, tabVars, el));
    newIds.filter(el => curIds.indexOf(el) < 0).forEach(el=>fillBlock(divPrefix, tabVars, el));
  }
}


/*function rotateRightCenter(divPrefix, tabVars, limit) {
  const curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    let [ firstCell, lastCell ] = [ curIds[0], curIds.slice(-1)[0] ];
    let [ fX, fY, lX, lY ] = [ getX(firstCell), getY(firstCell), getX(lastCell), getY(lastCell) ];
    let [ startX, endX ] = (fX < lX)? [ fX, lX ]: [ lX, fX ];
    let [ startY, endY ] = (fY < lY)? [ fY, lY ]: [ lY, fY ];

    let centerX = ((endX - startX) > 0) ? startX + Math.ceil((endX - startX)/2) : startX;
    let centerY = ((endY - startY) > 0) ? startY + Math.floor((endY - startY)/2) : startY;
    console.log(centerX, centerY);

    let newCoords = [];
    curIds.forEach(el => {
      let [ relX, relY ] = [ getX(el)-centerX, getY(el)-centerY ];
      let [ newX, newY ] = [ centerX + relY, centerY-relX ];
      newCoords.push(makeUnit(matchLimit(newX, limit), matchLimit(newY, limit)));
    })
    curIds.forEach(el => clearBlock(divPrefix, tabVars, el));
    newCoords.forEach(el => fillBlock(divPrefix, tabVars, el));
  }

}
*/


//change the rotate function
function rotateRightCenter2(divPrefix, tabVars, limit) {
  const curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    // Find the center coordinates of the grid
    const centerX = Math.floor(N / 2);
    const centerY = Math.floor(N / 2);

    let newCoords = [];
    curIds.forEach(el => {
      let [relX, relY] = [getX(el) - centerX, getY(el) - centerY];
      let [newX, newY] = [centerX + relY, centerY - relX];
      newCoords.push(makeUnit(matchLimit(newX, limit), matchLimit(newY, limit)));
    });

    // Clear existing blocks and fill with new rotated blocks
    curIds.forEach(el => clearBlock(divPrefix, tabVars, el));
    newCoords.forEach(el => fillBlock(divPrefix, tabVars, el));
  }
}

//add flip functions
/*function flipUpDown(divPrefix, tabVars, limit) {
  const curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    const midlineX = Math.floor(N / 2);
  
    let newCoords = [];
    curIds.forEach(el => {
      let [newX, newY] = [2*midlineX-getX(el), getY(el)];
      newCoords.push(makeUnit(matchLimit(newX, limit), matchLimit(newY, limit)));
    });

    // Clear existing blocks and fill with new rotated blocks
    curIds.forEach(el => clearBlock(divPrefix, tabVars, el));
    newCoords.forEach(el => fillBlock(divPrefix, tabVars, el));
  }
}
*/


function flipLeftRight(divPrefix, tabVars, limit) {
  const curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    const midlineY = Math.floor(N / 2);
    
    let newCoords = [];
    curIds.forEach(el => {
      let [newX, newY] = [getX(el), 2*midlineY-getY(el)];
      newCoords.push(makeUnit(matchLimit(newX, limit), matchLimit(newY, limit)));
    });

    // Clear existing blocks and fill with new fliped blocks
    curIds.forEach(el => clearBlock(divPrefix, tabVars, el));
    newCoords.forEach(el => fillBlock(divPrefix, tabVars, el));
  }
}



/*function rotateRight(divPrefix, tabVars, limit) {
  const curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    const centre = curIds.slice(-1)[0];

    let newCoords = [];
    curIds.forEach(el => {
      let [ relX, relY ] = [ getX(el)-getX(centre), getY(el)-getY(centre) ];
      let [ newX, newY ] = [ getX(centre) + relY, getY(centre)-relX ];
      newCoords.push(makeUnit(newX, newY));
    })*/
  


// check limits
    let isGood = 1;
    let newXs = newCoords.map(el=>getX(el));
    let newYs = newCoords.map(el=>getY(el));
    isGood = isGood & (Math.min(...newXs)>=0) & (Math.max(...newXs)<limit);
    isGood = isGood & (Math.min(...newYs)>=0) & (Math.max(...newYs)<limit);

    if (isGood) {
      curIds.forEach(el => clearBlock(divPrefix, tabVars, el));
      newCoords.forEach(el => fillBlock(divPrefix, tabVars, el));
  }
  

/*
function moveRight(divPrefix, tabVars, limit) {
  let curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    let curYs = curIds.map(el=>getY(el));
    if (Math.max(...curYs)+1 < limit) {
      let newIds = [];
      curIds.forEach(el => newIds.push(makeUnit(getX(el), getY(el)+1)));

      const toRemove = curIds.filter(el => newIds.indexOf(el) < 0);
      const toFill = newIds.filter(el => curIds.indexOf(el) < 0);

      toRemove.forEach(el=>clearBlock(divPrefix, tabVars, el));
      toFill.forEach(el=>fillBlock(divPrefix, tabVars, el));
    }
  }

}
function moveLeft(divPrefix, tabVars) {
  let curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    let curYs = curIds.map(el=>getY(el));
    if (Math.min(...curYs)-1 >= 0) {
      let newIds = [];
      curIds.forEach(el => newIds.push(makeUnit(getX(el), getY(el)-1)));

      const toRemove = curIds.filter(el => newIds.indexOf(el) < 0);
      const toFill = newIds.filter(el => curIds.indexOf(el) < 0);

      toRemove.forEach(el=>clearBlock(divPrefix, tabVars, el));
      toFill.forEach(el=>fillBlock(divPrefix, tabVars, el));
    }
  }
}
function moveDown(divPrefix, tabVars, n, limit) {
  let curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    const lastBlock = curIds.slice(-1)[0];

    if (getX(lastBlock)+n < limit) {
      let newIds = [];
      curIds.forEach(el => newIds.push(makeUnit(getX(el)+n, getY(el))));

      const toRemove = curIds.filter(el => newIds.indexOf(el) < 0);
      const toFill = newIds.filter(el => curIds.indexOf(el) < 0);

      toRemove.forEach(el=>clearBlock(divPrefix, tabVars, el));
      toFill.forEach(el=>fillBlock(divPrefix, tabVars, el));
    }
  }
}
function moveUp(divPrefix, tabVars, n) {
  let curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    const firstBlock = curIds[0];
    if (getX(firstBlock)-n >= 0) {
      let newIds = [];
      curIds.forEach(el => newIds.push(makeUnit(getX(el)-n, getY(el))));

      const toRemove = curIds.filter(el => newIds.indexOf(el) < 0);
      const toFill = newIds.filter(el => curIds.indexOf(el) < 0);

      toRemove.forEach(el=>clearBlock(divPrefix, tabVars, el));
      toFill.forEach(el=>fillBlock(divPrefix, tabVars, el));
    }

  }
}
function growRight(divPrefix, tabVars, n, limit) {
  const curIds = getCurrentBlocks(tabVars);
  const lastBlock = curIds.slice(-1)[0];
  const [ lastX, lastY ] = [ getX(lastBlock), getY(lastBlock) ];

  if (lastY+n < limit) {
    for (let i = 1; i < n+1; i++) {
      fillBlock(divPrefix, tabVars, makeUnit(lastX, lastY+1));
    }
  }
}
*/


function removeLastRow(divPrefix, tabVars) {
  const curIds = getCurrentBlocks(tabVars);
  if (curIds.length > 0) {
    const lastBlock =  curIds.slice(-1)[0];

    curIds.forEach(el => {
      let curX = parseInt(el[1]);
      (curX == getX(lastBlock))? clearBlock(divPrefix, tabVars, el): null;
    })
  }
}

function resetGrid(divPrefix, tabVars, limit, keepCenter = true) {
  for (let i = 0; i < limit; i++) {
    for (let j = 0; j < limit; j++) {
      let blockId = makeUnit(i, j);
      if (keepCenter && i==Math.floor(limit/2) && j==Math.floor(limit/2)) {
        fillBlock(divPrefix, tabVars, blockId);
        tabVars[blockId] = 1;
      } else {
        clearBlock(divPrefix, tabVars, blockId);
        tabVars[blockId] = 0;
      }
    }
  }
}
//divPrefix: The prefix used for the IDs of the grid cells.
//tabVars: An object representing the state of each cell in the grid.
//tabLen: The size of the grid.

/*function addTshape(divPrefix, tabVars, tabLen) {
  const [ cX, cY ] = [ Math.floor(tabLen/2), Math.floor(tabLen/2) ];
  const newTriIds = [ makeUnit(cX, cY), makeUnit(cX+1, cY), makeUnit(cX, cY-1), makeUnit(cX, cY+1) ];

  newTriIds.forEach(id => {
    if (tabVars[id]%2==0) {
      fillBlock(divPrefix, tabVars, id);
    }
  })
}
*/


function addLshape(divPrefix, tabVars, tabLen) {
  const [ cX, cY ] = [ Math.floor(tabLen/2), Math.floor(tabLen/2) ];
  const newTriIds = [ makeUnit(cX, cY+1), makeUnit(cX, cY), makeUnit(cX-1, cY), makeUnit(cX-2, cY) ];

  newTriIds.forEach(id => {
    if (tabVars[id]%2==0) {
      fillBlock(divPrefix, tabVars, id);
    }
  })
}

/*
function addBox(divPrefix, tabVars, tabLen) {
  const [ cX, cY ] = [ Math.floor(tabLen/2), Math.floor(tabLen/2) ];
  const newTriIds = [ makeUnit(cX, cY) ];

  newTriIds.forEach(id=> {
    if (tabVars[id]%2==0) {
      fillBlock(divPrefix, tabVars, id);
    }
  })
}

function addZshape(divPrefix, tabVars, tabLen) {
  const [ cX, cY ] = [ Math.floor(tabLen/2), Math.floor(tabLen/2) ];
  const newTriIds = [ makeUnit(cX, cY), makeUnit(cX, cY-1), makeUnit(cX-1, cY), makeUnit(cX-1, cY+1) ];

  newTriIds.forEach(id => {
    if (tabVars[id]%2==0) {
      fillBlock(divPrefix, tabVars, id);
    }
  })
}


function addStick(divPrefix, tabVars, tabLen) {
  const [ cX, cY ] = [ Math.floor(tabLen/2), Math.floor(tabLen/2) ];
  const newTriIds = [ makeUnit(cX, cY), makeUnit(cX, cY-1), makeUnit(cX, cY+1), makeUnit(cX, cY+2) ];

  newTriIds.forEach(id => {
    if (tabVars[id]%2==0) {
      fillBlock(divPrefix, tabVars, id);
    }
  })
}
*/




/*function showTaskLimit(limit = 0) {
  if (limit == 0) {
    return 'No limit on button clicks.'
  } else if (limit == 1) {
    return 'Extra bonus if you use only 1 button click.'
  } else {
    return `Extra bonus if you use up to ${limit} button clicks.`
  }
}
*/


/*function drawTarget(divEl, prefix, gridVar) {
  for (let i = 0; i < N; i++) {
    let tcCodeList = divEl.insertRow();
    for (let j = 0; j < N; j++) {
      let tcell = tcCodeList.insertCell();
      let cellId = makeUnit(i, j, prefix);
      tcell.id = cellId;
      tcell.style.backgroundColor = (gridVar[cellId] > 0)? 'black': '#fafafa';
    }
  }
  return divEl
}
*/










/* Bebrief form */
function removeSpecial (text) {
  text = text.replace(/[&\/\\#,$~%"\[\]{}@^_|`']/gi, '');
  text = text.replace(/(\r\n|\n|\r|\t)/gm, " ")
  return text
}
function showPostCheckPage (isPass) {
  const pageDiv = isPass? 'pass' : 'retry';
  document.getElementById('check-btn').style.display = 'none';
  document.getElementById(pageDiv).style.display = 'flex';
}
function showCompletion(code, nCorrect) {
  hide("debrief");
  showNext("completed", 'block');
  let bonusVal = nCorrect * 1.0;
  bonusVal = Math.round(bonusVal*100)/100;
  let t = document.createTextNode(code);
  let co = createText('p', 'We will check how many tasks you solved successfully and pay you the bonus in five working days.')
  // let co = createText('p', `You completed ${nCorrect} tasks successfully!
  // You will get ${bonusVal} pounds bonus on top of your base pay.`)
  // let returnLink = createCustomElement('p', '', '')
  // returnLink.innerHTML = `Click <a href='https://app.prolific.co/submissions/complete?cc=${code}'>here</a> to redirect to Prolific.`
  document.getElementById('completion-code').append(t);
  document.getElementById('completed').append(co);
  // document.getElementById('completed').append(returnLink);
}
function generateToken (length) {
  let tokens = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i ++) {
      tokens += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return tokens;
}
function formatDates (date, option = 'date') {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate() + 1).padStart(2, '0');
  let hour = String(date.getHours()+ 1).padStart(2, '0');
  let min = String(date.getMinutes() + 1).padStart(2, '0');
  let sec = String(date.getSeconds() + 1).padStart(2, '0');
  dateParts = (option === 'date') ? [ year, month, day ] : [ hour, min, sec ];
  return dateParts.join('_');
}


function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}


//neil datasave function
/*function save_data()
{
    var now = new Date();

    results = {steps:123, errors:'abc', cache:[1,2,3]};
    results_str = JSON.stringify(results);

    jQuery.ajax({
        url: './save_data.php',
        type:'POST',
        data:{results:results_str},
        success:function(data)
        {
            console.log('Sent data to database');
            alert('Nailed it in: ' + actions.length + ' actions, with ' + spillage + ' mistakes!');
        },
        error:function(xhr, status, error)
        {
            //Just print out what comes back if it doesn't work
            console.log(xhr, status, error);
        }
    })
}*/

// function redirectToProlific() {
//   window.location.href = 'https://app.prolific.com/submissions/complete?cc=C11KDV6C';
// }

// function save_data()
// {
//     var now = new Date();   
//     var results_str = JSON.stringify(subjectData);

//     // Modified AJAX call as per your request
//     jQuery.ajax({
//         url: 'data_pilot.php', // Changed URL to 'data_pilot.php'
//         type: 'POST',
//         data: {results: results_str},
//         success: function(data) {
//             console.log('Sent data to database');
//         },
//         error: function(xhr, status, error) {
//             // Just print out what comes back if it doesn't work
//             console.log(xhr, status, error);
//         }
//     });
// }

// function save_data()
// {
//   var now = new Date();   
//   var results_str = JSON.stringify(subjectData);

// jQuery.ajax({
//   url: 'data_pilot.php',
//   type: 'POST',
//   data: {results: results_str},
//   success: function(data) {
//       console.log('Sent data to database');
//       alert('Sent data to database');
//   },
//   error: function(xhr, status, error) {
//       // Log detailed error information
//       console.log('Error details:', {
//           status: status,
//           error: error,
//           response: xhr.responseText
//       });
//       alert('Failed to send data to database.');
//   }
// });
// }

// function save_data_with_retry(results_str, maxRetries, delay) {
//   let attempts = 0;
//   var now = new Date();   
//   var results_str = JSON.stringify(subjectData);

//   function sendRequest() {
//       jQuery.ajax({
//           url: 'data_save.php',
//           type: 'POST',
//           data: { results: results_str },
//           success: function(data) {
//               /**console.log('Sent data to database');*/
//               alert('You will redirect to Prolific in a few seconds.');
//               redirectToProlific(); // Redirect to Prolific after successful data save
//           },
//           error: function(xhr, status, error) {
//               console.log('Error details:', {
//                   status: status,
//                   error: error,
//                   response: xhr.responseText
//               });
//               if (attempts < maxRetries) {
//                   attempts++;
//                   console.log(`Retrying... Attempt ${attempts} of ${maxRetries}`);
//                   setTimeout(sendRequest, delay);
//               } else {
//                   alert('Due to your current network issues, we failed to send your data to the database after multiple attempts. Please try again later.');
//               }
//           }
//       });
//   }

//   sendRequest();
// }

