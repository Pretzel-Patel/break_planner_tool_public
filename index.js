"use strict";


/*
    CODE TO RUN ON PAGE LOAD
*/

/*
    Popular start and end times
*/
const STARTS = [600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800];
const ENDS   = [1100,1200,1300,1400,1500,1600,1700,1725,1800,1900,1925,2000,2100,2125];


/*
    Changeable settings
*/
let addDelay = 0;           // Delay when (+) button is pressed. increase this if (+) button is going pale.
                            // Remove this if it isn't ever needed


/*
    Tutorial and test data is recorded here. Tutorial needs improvement
*/
let exampleStaff = ["","Hi!", "Enter names here.", "Click the time icons", "to select start and end time.", 
        "Or type in a custom time.", "Click the refresh button", "to change breakdown of shifts.", "Remove the below person:", 
        "Andrew", "When you have finished entering shifts,", "press the save button.", "Save under a label.", 
        "You can click recall to", "see which labels are in use.", "After it is saved,", "click submit", "and wait 6 seconds.", 
        "Ignore what's below", "Drag me around", "Drag long breaks with top bubble", "A long break", "Click print when done",
        "Use 'test' button to practice"];
let exampleShifts = [[],[1000,1900],[1500,2125],[900,1800],[1400,2125],[920,1350],[1300,2125],[1200,1800],[1300,2125],[900,1700],
        [1300,2050],[900,1700],[1600,2125],[900,1825],[900,1825],[900,1825],[1250,1800],[1200,2125],[1200,1600],[600,1000],
        [600,1000],[650,1325],[700,1550],[750,1600]];
let exampleRoles = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let exampleBreakChanges = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let testStaff = ["","Vimaal","Preet","Elijah","Lochie","Cathleen","Tahnee","Carla","Marty","Emily","Josh","Finley","Kevin",
        "Eliza","Keeley","Takara","Carol","Mia","Katrina","Amber","Kaitlynn","Shehan","Maddie","Ahlam"];
let testShifts = [[],[650,1500],[1500,2125],[900,1300],[1300,1800],[1400,2125],[900,1600],[1600,2125],[1000,1400],[1400,2125],
        [900,1400],[1400,2050],[900,1700],[1600,2125],[900,1300],[1300,1825],[900,1725],[900,1825],[650,1200],[1200,2125],
        [600,1450],[1400,2125],[900,1700],[750,1650]];
let testRoles = [0,0,1,1,1,2,2,3,3,4,4,5,6,6,7,8,8,9,5,4,4,8,9,0];
let testBreakChanges = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

/*
    Load previously saved shifts so user doesnt lose progress.
*/
let SAVED_KEY = "SAVED_STAFF_AND_SHIFTS_KEY";
let savedStaff = [];
let savedShifts = [];
let savedRoles = [];
let savedBreakChanges = [];
let LABEL_KEYS = [];


/*
    Adds the first empty row to the table
    Fills the LABEL_KEYS variable with previously stored keys
*/
add(staffList.numStaff);
disableFirst();

if (checkLocalStorageExists("Labels"))
{
    // let data = JSON.parse(getDataLocalStorage("Labels"));
    let data = getDataLocalStorage("Labels");
    if (data !== null && data !== "" && typeof data === "object")
    {
        LABEL_KEYS = data;
    }
}


/*
    Code for various dialog boxes
        dialog1: Recall Dialog Box
        dialog2: Save Dialog Box
        dialog3: Subit Dialog Box
*/
// Dialog 1
let dialog1 = document.querySelector('.dialog1');
if (!dialog1.showModal) {
    dialogPolyfill.registerDialog(dialog1);
}
function openRecallDialog() 
{
    updateRecallList();
    dialog1.showModal();
}
dialog1.querySelector('.close').addEventListener('click', function () {
    dialog1.close();
});
// Dialog 2
let dialog2 = document.querySelector('.dialog2');
if (!dialog2.showModal) {
    dialogPolyfill.registerDialog(dialog2);
}
function openSaveDialog() 
{
    dialog2.showModal();
}
dialog2.querySelector('.close').addEventListener('click', function () {
    dialog2.close();
});
// Dialog 3
let dialog3 = document.querySelector('.dialog3');
if (!dialog3.showModal) {
    dialogPolyfill.registerDialog(dialog3);
}
function openSubmitDialog() 
{
    dialog3.showModal();
}
dialog3.querySelector('.close').addEventListener('click', function () {
    dialog3.close();
});
// Dialog 4: Feedback
let dialog4 = document.querySelector('.dialog4');
if (!dialog4.showModal) {
    dialogPolyfill.registerDialog(dialog4);
}
function openFeedbackDialog() 
{
    dialog4.showModal();
}
dialog4.querySelector('.close').addEventListener('click', function () {
    document.getElementById("feedbackName").value = "";
    document.getElementById("feedback").value = "";
    dialog4.close();
});

/*
    The three updateXXXX functions take the name or time input and update the staffList class instance.
    .allMyBreaks method recalculates the staff member's breaks.
*/
function updateName(staffNum) 
{
    staffList.staffList[staffNum-1].name = document.getElementById(`name${staffNum}`).value;
    staffList.staffList[staffNum-1].allMyBreaks();
}

function updateStart(staffNum) 
{
    staffList.staffList[staffNum-1].start = document.getElementById(`start${staffNum}`).value;
    staffList.staffList[staffNum-1].allMyBreaks();
    displayBreakIcons(staffNum);
}

function updateEnd(staffNum) 
{
    staffList.staffList[staffNum-1].end = document.getElementById(`end${staffNum}`).value;
    staffList.staffList[staffNum-1].allMyBreaks();
    displayBreakIcons(staffNum);
}

/*
    If the user selects a time from the dropdown list, the following code is run
*/
function selectStart(staffNum,timeNum)
{
    document.getElementById(`start${staffNum}`).value = numToTime(timeNum);
    updateStart(staffNum);
    loadStafflist();
}

function selectEnd(staffNum,timeNum)
{
    document.getElementById(`end${staffNum}`).value = numToTime(timeNum);
    updateEnd(staffNum);
}

/*
    The following function removes a staff member from the table and also from the staffList class instance.
    Entire table is reloaded.
*/
function remove(staffNum)
{
    staffList.staffList.splice(staffNum-1,1);
    loadStafflist();
}


/*
    The refresh function is triggered by the refresh button. This reorder the breaks if such a reordering exists.
*/
function refresh(staffNum)
{
    staffList.staffList[staffNum-1].change();
    displayBreakIcons(staffNum);
}


/*
    The roles button is changed with these two functions
        changeRole(num):    Invokes changeMyRole method in class instance
        displayRole(num):   Changes button on actual webpage
*/
function changeRole(num)
{
    staffList.staffList[num-1].changeMyRole();
    displayRole(num);
}

function displayRole(num)
{
    document.getElementById(`role${num}`).innerText = staffList.staffList[num-1].role;
}


/*
    The move function swaps two staff member's positions in the table.
*/
function move(staffNum,direction)
{
    if (staffNum>1 && direction==='up')
    {
        let temp = staffList.staffList[staffNum-1];
        staffList.staffList[staffNum-1] = staffList.staffList[staffNum-2];
        staffList.staffList[staffNum-2] = temp;
        loadStafflist();
    }
    else if (staffNum<staffList.numStaff && direction==='down')
    {
        let temp = staffList.staffList[staffNum-1];
        staffList.staffList[staffNum-1] = staffList.staffList[staffNum];
        staffList.staffList[staffNum] = temp;
        loadStafflist();
    }
}


/*
    The clearAll function sneakily just reloads the page. Certainly an area for improvement.
*/
function clearAll()
{
    location.reload();
}


/*
    The save function is run when the confirm button in the save dialog is pressed.
        1. Checks that the label provided isn't already in use.
        2. Adds the label to the list of labels.
        3. Iteratively collects the staff data
        4. Stores the staff data
        5. Closes the dialog
*/
function save()
{   
    let label = document.getElementById("labelInput").value;
    if (LABEL_KEYS.findIndex((elem) => elem === label) === -1)
    {
        LABEL_KEYS.push(label);
        // updateLocalStorage("Labels", JSON.stringify(LABEL_KEYS));
        updateLocalStorage("Labels", LABEL_KEYS);
        savedStaff = [""];
        savedShifts = [[]];
        savedRoles = [0];
        savedBreakChanges = [0]
        for (let i=1; i<=staffList.staffList.length; i++)
        {
            if (staffList.staffList[i-1].name !== null)
            {
                savedStaff.push(staffList.staffList[i-1].name);
                savedShifts.push([staffList.staffList[i-1].startNum,staffList.staffList[i-1].endNum]);
                savedRoles.push(staffList.staffList[i-1].roleNum);
                savedBreakChanges.push(staffList.staffList[i-1].breakChanges)
            }
            else
            {
                console.log("Staff ignored. This isn't meant to happen");
            }
        }
        // let data = JSON.stringify([savedStaff,savedShifts,savedRoles,savedBreakChanges]);
        let data = [savedStaff,savedShifts,savedRoles,savedBreakChanges];
        updateLocalStorage(SAVED_KEY+label, data);
        alert('Success!');
        dialog2.close();
    }
    else 
    {
        alert("That label is already being used")
    }
    
}

/*
    The recall function is run when a label is chosen from the list in the recal dialog box.
        1. Dialog box is closed 
        2. Data from local storage is recalled
        3. Data is fed into the load function
*/
function recall(label)
{
    dialog1.close();
    savedStaff = []
    savedShifts = []
    savedRoles = []
    savedBreakChanges = []
    if (checkLocalStorageExists(SAVED_KEY+label))
    {
        // let data = JSON.parse(getDataLocalStorage(SAVED_KEY+label));
        let data = getDataLocalStorage(SAVED_KEY+label);
        if (data !== "empty")
        {
            savedStaff = data[0];
            savedShifts = data[1];
            savedRoles = data[2];
            savedBreakChanges = data[3];
            load(savedStaff, savedShifts, savedRoles, savedBreakChanges);
        }
    }
}


/*
    When the recall dialog is opened, this function updates the table to show all saved labels.
*/  
function updateRecallList()
{
    let recallListRef = "";
    for (let i=0; i<LABEL_KEYS.length; i++)
    {
        recallListRef += `  <li class="mdl-list__item" onclick="recall('${LABEL_KEYS[i]}')"> 
                                <span class="mdl-list__item-primary-content">
                                    ${LABEL_KEYS[i]}
                                </span>
                                <a class="mdl-list__item-secondary-action">
                                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect remove"
                                        onclick="removeRecall('${LABEL_KEYS[i]}')">
                                        <i class="material-icons">remove</i>
                                    </button>
                                </a>
                            </li>`;
    }
    document.getElementById("recallList").innerHTML = recallListRef;
}

/*
    When the (-) icon is pressed in the recall dialog, this removeRecall function is run.
    The saved staff data is deleted from local storage and the label is removed from the list and from the table.
*/
function removeRecall(label)
{
    localStorage.removeItem(SAVED_KEY+label);
    let index = LABEL_KEYS.findIndex((elem)=>elem===label);
    LABEL_KEYS.splice(index,1);
    // updateLocalStorage("Labels", JSON.stringify(LABEL_KEYS));
    updateLocalStorage("Labels", LABEL_KEYS);
    setTimeout(openRecallDialog,10)
}

function disableFirst()
{
    if (staffList.numStaff===1)
    {
        document.getElementById("remove1").disabled = true;
    }
    else
    {
        document.getElementById("remove1").disabled = false;
    }
}


function publish(masterBreaks)
{
    updateLocalStorage("MASTER_BREAKS", masterBreaks);
    window.open(`result.html`)
}

function isBreaksLeft()
{
    let nextStaff = staffList.findMinPseudo();
    if (nextStaff !== null)
    { 
        return true;
    }
    else
    {
        return false;
    }
}

function submit()
{
    sendShiftData()
    let allBreaks = [];
    for (let i=1; i<=staffList.staffList.length; i++)
    {
        if (staffList.staffList[i-1].name !== null)
        {
            allBreaks.push(staffList.staffList[i-1].allMyBreaksList)
        }
        else
        {
            console.log("Staff ignored")
        }
    }
    // console.log(allBreaks.flat())
    const allBreaksFlat = allBreaks.flat()
    console.log(allBreaksFlat)
    // console.log(allBreaksFlat)
    let masterBreaks = []
    
    

    // 2nd method to find suitable random permutation
    let bestScore = 100000;
    let loopStart = Date.now();
    let n=0;
    while (true)
    {
        n++;
        let list  = JSON.parse(JSON.stringify(allBreaksFlat));
        // console.log(list)
        let allBreaksPerturbed = randomPerturb(list)
        let randomScore = (allBreaksPerturbed[1].reduce((acc,curr)=>acc+Math.abs(curr)))/30;
        let tempMasterBreaks = allBreaksToMasterBreaks(allBreaksPerturbed[0], allBreaksPerturbed[1])
        for (let i = 0; i<tempMasterBreaks[0].length; i++)
        {
            let count = tempMasterBreaks[1][i].length;
            if (i>0)
            {
                for (let j=0; j<tempMasterBreaks[1][i-1].length; j++)
                {
                    if (tempMasterBreaks[1][i-1][j] === 50)
                    {
                        count++;
                    }
                }
            }
            switch (count)
            {
                case 0: 
                    randomScore += 10;
                    break;
                case 1: 
                    randomScore += 0;
                    break;
                case 2: 
                    randomScore += 0;
                    break;
                case 3: 
                    randomScore += 20;
                    break;
                case 4: 
                    randomScore += 1000;
                    break;
                default:
                    randomScore += 1000;
            }
            if (count >= 4)
            {
                randomScore = 100000
                break;
            }
        }
        
        if (randomScore < bestScore)
        {
            bestScore = randomScore;
            masterBreaks = tempMasterBreaks;
        }
        if ((Date.now()-loopStart) > 1000*testTime && bestScore !== 100000)
        {
            break;
        }
    }
    console.log(n);
    publish(masterBreaks)
}

/*
    Submits the feedback
*/
function submitFeedback()
{
    // Finds and stored feedback and name
    let feedbackName = document.getElementById("feedbackName").value;
    console.log(feedbackName);
    let feedback = document.getElementById("feedback").value;
    console.log(feedback);
    let allFeedback = [[null,null,null]];
    if (checkLocalStorageExists(FEEDBACK_KEY))
    {
        allFeedback = getDataLocalStorage(FEEDBACK_KEY);
    }
    // Appends new entry to current list of feedback entries
    allFeedback.push([feedbackName,feedback,new Date().toLocaleString()]);
    updateLocalStorage(FEEDBACK_KEY, allFeedback);
    // Resets the input boxes to blank
    document.getElementById("feedbackName").value = "";
    document.getElementById("feedback").value = "";
    alert("Your feedback was recorded, thank you!")
    // Closes Feedback dialog
    dialog4.close()
}


/*
    Add a row to input table
*/
function add(num) {
    if (num===staffList.numStaff)
    {
        staffList.addStaff(new Worker(num+1));
    }
    num+=1
    let table = document.getElementById("inputTable");
    table.removeChild(table.lastElementChild);
    // Adding autofill
    let options = "";
    for (let i=0; i<TEAM.length; i++)
    {
        options += `<option value="${TEAM[i]}">`;
    }

    let STARTS_LIST = "";
    let ENDS_LIST = "";

    for (let i=1; i<STARTS.length; i++)
    {
        STARTS_LIST += `<li class="mdl-menu__item" onclick="selectStart(${num},${STARTS[i]})">${numToAmPmTime(STARTS[i])}</li>`
    }

    for (let i=1; i<ENDS.length; i++)
    {
        if ((staffList.staffList[num-1].startNum+300 <= ENDS[i] && staffList.staffList[num-1].startNum+1100 >= ENDS[i])|| staffList.staffList[num-1].startNum===null)
        {
            ENDS_LIST += `<li class="mdl-menu__item" onclick="selectEnd(${num},${ENDS[i]})">${numToAmPmTime(ENDS[i])}</li>`
    
        }
    }



    let row = document.createElement("TR");
    row.id = `staff${num}`;
    row.innerHTML = `
    <td class="mdl-data-table__cell--non-numeric">
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" list="names" type="text"
                id="name${num}" onchange="updateName(${num})">
            <datalist id="names">
                ${options}
            </datalist>
        </div>
    </td>
    <td>
        <div class="mdl-textfield mdl-js-textfield" style="width:80%;">
            <input class="mdl-textfield__input" type="time" id="start${num}" onchange="updateStart(${num})">
        </div>&nbsp&nbsp
        
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green remove"
            id="starts-menu${num}">
            <i class="material-icons">alarm_add</i>
        </button>
        
        <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
            for="starts-menu${num}">
            ${STARTS_LIST}
        </ul>
    </td>
    <td>
        <div class="mdl-textfield mdl-js-textfield" style="width:80%;">
            <input class="mdl-textfield__input" type="time" id="end${num}" onchange="updateEnd(${num})">
        </div>&nbsp&nbsp


        <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green remove" id="ends-menu${num}" data-upgraded=",MaterialButton,MaterialRipple">
            <i class="material-icons">alarm_add</i>
        <span class="mdl-button__ripple-container"><span class="mdl-ripple"></span></span></button>
        
        
        <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
            for="ends-menu${num}">
            ${ENDS_LIST}
        </ul>
    </td>
    <td>

        
        <div class="mdl-grid" style="text-align: center">
            <div class="mdl-cell mdl-cell--2-col" id="change${num}">
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks"
                    onclick = "refresh(${num})">
                    <i class="material-icons">autorenew</i>
                </button>
            </div>
            <div class="mdl-cell mdl-cell--3-col" id="breaks${num}">
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    15
                </button>
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    30
                </button>
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    15
                </button>
            </div>
            <div class="mdl-cell mdl-cell--3-col">
                <button
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect bunnings-green white-text roles" 
                    onclick="changeRole(${num});" id="role${num}">${staffList.staffList[num-1].role}
                </button>
            </div>

            <div class="mdl-cell mdl-cell--2-col">
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green remove"
                    onclick="move(${num},'up')">
                    <i class="material-icons">north</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green remove"
                    onclick="move(${num},'down')">
                    <i class="material-icons">south</i>
                </button>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect remove" 
                    onclick="remove(${num})" id="remove${num}">
                    <i class="material-icons">remove</i>
                </button>
            </div>
        </div>
    </td>`       // Append the text to <p>
    table.appendChild(row);  
    


    let rowB = document.createElement("TR");
    rowB.innerHTML = `<td style="text-align: left;">
                        <button
                            class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect"
                            onclick="setTimeout(add, addDelay, staffList.numStaff);">
                            <i class="material-icons">add</i>
                        </button>
                    </td>
                    <td>
                        <!--
                            <button
                                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect bunnings-green white-text" 
                                onclick="load(exampleStaff,exampleShifts,exampleRoles,exampleBreakChanges)">
                                Tutorial
                            </button>
                        -->
                    </td>
                    <td>
                        <!--
                            <button
                                class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect bunnings-green white-text" 
                                onclick="load(testStaff,testShifts,testRoles,testBreakChanges)">
                                Test
                            </button>
                        -->
                    </td>
                    <td>
                        <button
                            class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect bunnings-green white-text rectangle" onclick="clearAll()">
                            Clear
                        </button>
                        <button
                            class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect bunnings-green white-text rectangle" onclick="openSaveDialog()">
                            Save
                        </button>
                        <button
                            class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect bunnings-green white-text rectangle" onclick="openRecallDialog()">
                            Recall
                        </button>
                        <button
                            class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect bunnings-green white-text rectangle" onclick="openSubmitDialog()">
                            Submit
                        </button>
                    </td>`;       // Append the text to <p>
    table.appendChild(rowB);
    disableFirst();
    componentHandler.upgradeAllRegistered();
    
}

// second test Sunday 13 December
function load2(testStaff, testShifts, testRoles, testBreakChanges)
{
    document.getElementById("inputTable").innerHTML = "<tr></tr>";
    staffList = new StaffList();
    add(staffList.numStaff);
    document.getElementById(`name${1}`).value = testStaff[1];
    document.getElementById(`start${1}`).value = numToTime(testShifts[1][0]);
    document.getElementById(`end${1}`).value = numToTime(testShifts[1][1]);
    updateName(1); 
    updateEnd(1);
    updateStart(1);
    staffList.staffList[0].roleNum = testRoles[1]
    displayRole(1);
    for (let j=0; j<testBreakChanges[1]; j++)
    {
        refresh(1)
    }
    for (let i=2; i<testStaff.length; i++)
    {
        add(staffList.numStaff)
        document.getElementById(`name${i}`).value = testStaff[i];
        document.getElementById(`start${i}`).value = numToTime(testShifts[i][0]);
        document.getElementById(`end${i}`).value = numToTime(testShifts[i][1]);
        updateName(i); 
        updateEnd(i);
        updateStart(i);
        staffList.staffList[i-1].roleNum = testRoles[i];
        displayRole(i)
        for (let j=0; j<testBreakChanges[i]; j++)
        {
            refresh(i)
        }
    }
    disableFirst();
}

function load(testStaff, testShifts, testRoles, testBreakChanges)
{
    document.getElementById("inputTable").innerHTML = "<tr></tr>";
    staffList = new StaffList();
    staffList.addStaff(new Worker(1));
    staffList.staffList[0].name = testStaff[1];
    staffList.staffList[0].start = numToTime(testShifts[1][0])
    staffList.staffList[0].end = numToTime(testShifts[1][1])
    staffList.staffList[0].allMyBreaks();
    staffList.staffList[0].roleNum = testRoles[1]

    for (let j=0; j<testBreakChanges[1]; j++)
    {
        refresh(1)
    }
    for (let i=2; i<testStaff.length; i++)
    {
        staffList.addStaff(new Worker(i));
        staffList.staffList[i-1].name = testStaff[i];
        staffList.staffList[i-1].start = numToTime(testShifts[i][0])
        staffList.staffList[i-1].end = numToTime(testShifts[i][1])
        staffList.staffList[i-1].allMyBreaks();
        staffList.staffList[i-1].roleNum = testRoles[i]
    
        for (let j=0; j<testBreakChanges[i]; j++)
        {
            refresh(i)
        }
    }
    loadStafflist()
}


function loadStafflist()
{
    document.getElementById("inputTable").innerHTML = "<tr></tr>";
    for (let i=1; i<=staffList.numStaff; i++)
    {
        add(i-1)
        document.getElementById(`name${i}`).value = staffList.staffList[i-1].name;
        document.getElementById(`start${i}`).value = staffList.staffList[i-1].start;
        document.getElementById(`end${i}`).value = staffList.staffList[i-1].end;
        displayBreakIcons(i)
    }
    disableFirst();
}

function displayBreakIcons(staffNum)
{
    let shiftLength = staffList.staffList[staffNum-1].shiftLength;
    if ((typeof shiftLength === "number") && (document.getElementById(`breaks${staffNum}`) !== null) )
    {
        document.getElementById(`breaks${staffNum}`).innerHTML = "";
        if (shiftLength >= 0 && shiftLength < 300)
        {
            document.getElementById(`breaks${staffNum}`).innerHTML += `
                <button
                    class="mdl-button mdl-js-button mdl-js-ripple-effect bunnings-red">
                    Too short
                </button>`
            document.getElementById(`change${staffNum}`).innerHTML = 
                `<button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks"
                    onclick = "refresh(${staffNum})" disabled style="color: white; opacity: 0.5;">
                    <i class="material-icons">autorenew</i>
                </button>`
        }
        else if (shiftLength >= 300 && shiftLength < 400)
        {
            document.getElementById(`change${staffNum}`).innerHTML = 
                `<button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks"
                    onclick = "refresh(${staffNum})" disabled style="color: white; opacity: 0.5;">
                    <i class="material-icons">autorenew</i>
                </button>`
        }
        else if (shiftLength >= 400 && shiftLength <= 1100)
        {
            let allMyBreaks = staffList.staffList[staffNum-1].allMyBreaksList;
            for (let i in allMyBreaks)
            {
                if (allMyBreaks[i][1]===25)
                {
                    document.getElementById(`breaks${staffNum}`).innerHTML += `
                        <button
                            class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                            15
                        </button>`
                }
                else if (allMyBreaks[i][1]===50)
                {
                    document.getElementById(`breaks${staffNum}`).innerHTML += `
                        <button
                            class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                            30
                        </button>`
                }
            }
            if (shiftLength >= 600 && shiftLength <= 1100)
            {
                document.getElementById(`change${staffNum}`).innerHTML = 
                `<button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks"
                    onclick = "refresh(${staffNum})">
                    <i class="material-icons">autorenew</i>
                </button>`;
            }
            else
            {
                document.getElementById(`change${staffNum}`).innerHTML = 
                `<button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks"
                    onclick = "refresh(${staffNum})" disabled style="color: white; opacity: 0.5;">
                    <i class="material-icons">autorenew</i>
                </button>`
            }
        }
    }
}



function sendShiftData()
{
    let shiftData = [['Name', 'Shift', 'Breaks','Role']]
    for (let i=1; i<=staffList.staffList.length; i++)
    {
        if (staffList.staffList[i-1].name !== null)
        {
            let staff = staffList.staffList[i-1];
            let breaks = staff.allMyBreaksList;
            let breaksString = ""
            for (let j=0; j<breaks.length; j++)
            {
                let breakTime = "";
                if (breaks[j][1]===25)
                {
                    breakTime = " 15"
                }
                else if (breaks[j][1]===50)
                {
                    breakTime = " 30"
                }
                breaksString += breakTime;
            }
            breaksString = breaksString.substr(1);
            let start = numToAmPmTime(timeToNum(staff.start));
            let end = numToAmPmTime(timeToNum(staff.end));
            start = start.substr(0,start.length-3);
            end = end.substr(0,end.length-3);
            if (start.substr(-2)==="00")
            {
                start = start.substring(0,start.length-3)
            }
            if (end.substr(-2)==="00")
            {
                end = end.substring(0,end.length-3)
            }
            shiftData.push([staff.name,start+" - "+end,breaksString,staff.roleNum])
        }
        else
        {
            console.log("Staff ignored")
        }
        
    }
    // updateLocalStorage(SHIFT_DATA_KEY, JSON.stringify(shiftData));
    updateLocalStorage(SHIFT_DATA_KEY, shiftData);
}



// Archaic


function submitOld()
{
    for (let i=1; i<=staffList.staffList.length; i++)
    {
        updateName(i); 
        updateShift(i);
        updateEnd(i);
        updateStart(i);
    }
    timeNow = timeToNum(START_TIME);
    let totalBreakTime = staffList.totalBreakTime;
    let totalAvailableTime = END_TIME_NUM - timeNow;
    if (totalAvailableTime < totalBreakTime)
    {
        doublingNeeded = Math.ceil((totalBreakTime - totalAvailableTime) / 15);
    }
    // update and reset shit here??
    while (isBreaksLeft())
    {
        addBreak();
    }
    console.log(breaksList);
    publish()
}





function randomPerturb(input)
{
    let list = input.slice();
    let permuteVector = []
    // console.log(list)
    for (let i=0; i<list.length; i++)
    {
        // let perturb = (Math.floor(Math.random()*3-1)) * list[i][1];      pushes 30 min breaks by 30 mins
        let perturb = (Math.floor(Math.random()*3-1)) * 25;
        permuteVector.push(perturb);
        if ((list[i][0]+perturb)>=START_TIME_NUM && (list[i][0]+perturb)<END_TIME_NUM)
        {
            list[i][0] += perturb;
        }
        else
        {
            // console.log("Error or weird break in random perturb function")
        }
    }
    // console.log(list)
    return [list, permuteVector];

}


function allBreaksToMasterBreaks(allBreaks, permuteVector)
{
    let masterBreaks = [[],[],[],[]] // Time, Lengths, Names, Perturbs
    for (let time = timeToNum(START_TIME); time <= END_TIME_NUM; time += 25)
    {
        let n = masterBreaks[0].length;
        masterBreaks[0][n] = time;
        masterBreaks[1][n] = [];
        masterBreaks[2][n] = [];
        masterBreaks[3][n] = [];
        for (let j=0; j<allBreaks.length; j++)
        {
            
            if (allBreaks[j][0] === time)
            {
                masterBreaks[1][n].push(allBreaks[j][1])
                masterBreaks[2][n].push(allBreaks[j][2])
                masterBreaks[3][n].push(permuteVector[j])
            }
            else if (allBreaks[j][0] < timeToNum(START_TIME) && time === timeToNum(START_TIME))
            {
                masterBreaks[1][n].push(allBreaks[j][1])
                masterBreaks[2][n].push(allBreaks[j][2])
                masterBreaks[3][n].push(permuteVector[j])
            }
        }
    }
    return masterBreaks;
}


/*
    ARCHAIC CODE
    No longer needed but preserved for historic purposes

let _15AtTimeNow = false;
let _30AtTimeNow = false;
let doublingNeeded = 0;
breaksList = [[],[],[],[]];

function publishOld()
{
    
    updateLocalStorage("BREAKS_LIST", breaksList);
    window.location = `result.html`;
}

function addBreak()
{
    let nextStaff = staffList.findMinPseudo();
    if (isBreaksLeft())
    { 
        if (nextStaff.eligibleTime <= timeNow)
        {
            let id = nextStaff.id;  // change to id
            let nextBreak = (staffList.staffList[id-1].breaksLeft.splice(0,1))[0];
            staffList.staffList[id-1].numBreaksLeft -= 1;
            staffList.staffList[id-1].pseudoStartNum = timeNow + nextBreak;
            breaksList[0].push(nextBreak);
            breaksList[1].push(id);
            breaksList[2].push(timeNow);
            breaksList[3].push(staffList.staffList[id-1].name);
            if (doublingNeeded > 0 && timeNow >= timeToNum(DOUBLING_START_TIME) && _15AtTimeNow === false && _30AtTimeNow === false)
            {
                doublingNeeded -= nextBreak / 25;
                if (nextBreak === 50)
                {
                    _30AtTimeNow === true;
                }
                else if (nextBreak === 25)
                {
                    _15AtTimeNow === true;
                }
            }
            else if (_15AtTimeNow)
            {
                if (nextBreak = 50)
                {
                    timeNow += 25;
                }
                else if (nextBreak = 25)
                {
                    timeNow += 25;
                    _15AtTimeNow = false;
                }
            }
            else if (_30AtTimeNow)
            {
                if (nextBreak = 50)
                {
                    timeNow += 50;
                    _30AtTimeNow = false;
                }
                else if (nextBreak = 25)
                {
                    timeNow += 25;
                    _15AtTimeNow = true;
                    _30AtTimeNow = false;
                }
            }
            else 
            {
                timeNow += nextBreak;
            }
            return true;
        }
        else
        {
            timeNow += 25;

        }
    }
    else
    {
        return false;
    }
} 



// Old first test function

function test1()
{
    
    console.log([testStaff,testShifts])
    document.getElementById(`name${1}`).value = testStaff[1];
        document.getElementById(`start${1}`).value = numToTime(testShifts[1][0]);
        document.getElementById(`end${1}`).value = numToTime(testShifts[1][1]);
    for (let i=2; i<testStaff.length; i++)
    {
        add()
        document.getElementById(`name${i}`).value = testStaff[i];
        document.getElementById(`start${i}`).value = numToTime(testShifts[i][0]);
        document.getElementById(`end${i}`).value = numToTime(testShifts[i][1]);
    }
}



ORIGINAL METHOD USED TO FIND A SUITABLE PERMUTATION
    // START Finding a suitable random perturbation
    let success = false
    while (!success)
    {
        let list  = JSON.parse(JSON.stringify(allBreaksFlat));
        console.log(list)
        let allBreaksPerturbed = randomPerturb(list)
        // timeNow = timeToNum(START_TIME);
        masterBreaks = allBreaksToMasterBreaks(allBreaksPerturbed[0]) // Time,  Lengths, Names,
        success = true;
        for (let i = 0; i<masterBreaks[0].length; i++)
        {
            let count = masterBreaks[1][i].length;
            if (i>0)
            {
                for (let j=0; j<masterBreaks[1][i-1].length; j++)
                {
                    if (masterBreaks[1][i-1][j] === 50)
                    {
                        count++;
                    }
                }
            }
            
            if (count >= 3 && masterBreaks[0][i]<DOUBLE_START_TIME_NUM)
            {
                success = false;
                break
            }
            else if (count >= 4)
            {
                success = false;
                break
            }
        }
    }
    END finding suitable random permutation 
    
    table.innerHTML += `<tr>
        <td class="mdl-data-table__cell--non-numeric" style="width:20%">
            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" list="names" type="text"
                    id="name${staffList.numStaff}" onchange="updateName(${staffList.numStaff})">
                <datalist id="names">
                    <option value="Vimaal">
                    <option value="Eric">
                    <option value="Amber">
                    <option value="Shehan">
                    <option value="Christo">
                </datalist>
            </div>
        </td>
        <td class="mdl-data-table__cell--non-numeric">
            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" list="browsers" type="text"
                    id="shift${staffList.numStaff}" onchange="updateShift(${staffList.numStaff})">
                <datalist id="browsers">
                    <option value="CPA">
                    <option value="Service Desk">
                    <option value="Register">
                    <option value="Cafe">
                    <option value="BSCO">
                </datalist>
            </div>
        </td>
        <td>
            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="time" id="start${staffList.numStaff}" onchange="updateStart(${staffList.numStaff})">
            </div>
        </td>
        <td>
            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="time" id="end${staffList.numStaff}" onchange="updateEnd(${staffList.numStaff})">
            </div>
        </td>
    </tr>`;




FROM DISPLAYBREAKICONS FUNCTION
        /*
        else if (shiftLength >= 400 && shiftLength <= 600)
        {
            document.getElementById(`breaks${staffNum}`).innerHTML += `
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    15
                </button>`
        }
        else if (shiftLength > 600 && shiftLength <= 700)
        {
            document.getElementById(`breaks${staffNum}`).innerHTML += `
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    30
                </button>
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    15
                </button>`
        }
        else if (shiftLength >= 700 && shiftLength <= 1100)
        {
            document.getElementById(`breaks${staffNum}`).innerHTML += `
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    15
                </button>
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    30
                </button>
                <button
                    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect bunnings-green breaks">
                    15
                </button>`
        }
        */



