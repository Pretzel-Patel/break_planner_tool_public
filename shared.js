"use strict";

class Worker {
    constructor(id, name="", start="", end="") {
        this._name = name;
        this._start = start;
        this._end = end;
        this._id = id;
        this._pseudoStartNum = timeToNum(start)
        this._role = 0;
        this._breakChanges = 0;
    }
    get name() {
        return this._name;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    get shiftLength()
    {
        if (this._end !== "" && this._start !== "")
        {
            return (timeToNum(this._end)-timeToNum(this._start));
        }
        else 
        {
            return null;
        }
        
    }
    get eligibleTime() {
        let eligibleTime = null;
        let timeLeft = timeToNum(this._end) - Math.max(timeNow, this._pseudoStartNum);
        if (this._numBreaksLeft == 0)
        {
            eligibleTime = null;
        }
        else if (this._numBreaksLeft > 0)
        {
            let timeLeftInHours = Math.floor(timeLeft / 100);
            let timeSpacer = BREAKS_MATRIX[this._numBreaksLeft][timeLeftInHours];
            eligibleTime = this._pseudoStartNum + timeSpacer;
        }
        else{
            console.log("Number of breaks is invalid or negative")
        }
        /*
        this._important = false;
        if (timeLeft < 150)
        {
            this._important = true;
        }
        */
        return eligibleTime;
    }
    get allMyBreaksList()
    {
        return this._allMyBreaks;
    }
    get breaksLeft()
    {
        return this._breaksLeft;
    }
    get numBreaksLeft()
    {
        return this._numBreaksLeft;
    }
    get id()
    {
        return this._id;
    }
    get numBreaks()
    {
        return this._numBreaks;
    }
    get pseudoStartNum()
    {
        return this._pseudoStartNum;
    }
    get startNum()
    {
        return timeToNum(this._start);
    }
    get endNum()
    {
        return timeToNum(this._end);
    }
    get role()
    {
        return getRole(this._role);
    }
    get roleNum()
    {
        return this._role;
    }
    get breakChanges()
    {
        return this._breakChanges;
    }
    set name(newName) {
        this._name = newName;
        if (newName == "Andrew")
        {
            this._name = "Andr\u0259w";
        }
    }
    set start(newStart) {
        this._start = newStart;
        this._getBreaks(this._start,this._end);
    }
    set end(newEnd) {
        this._end = newEnd;
        this._getBreaks(this._start,this._end);
    }
    set breaksLeft(newBreaksLeft)
    {
        this._breaksLeft = newBreaksLeft;
    }
    set numBreaksLeft(newNumBreaksLeft)
    {
        this._numBreaksLeft = newNumBreaksLeft;
    }
    set pseudoStartNum(newPseudoStartNum)
    {
        this._pseudoStartNum = newPseudoStartNum;
    }
    set roleNum(newRoleNum)
    {
        this._role = newRoleNum;
    }
    _getBreaks(start, end){
        if (isValidTimeStr(start) && isValidTimeStr(end))
        {
            let shiftLength = timeToNum(end)-timeToNum(start);
            let numBreaks = 0;
            let breaks = [];
            if (typeof shiftLength == "number" && shiftLength >= 0)
            {
                if (shiftLength >= 0 && shiftLength < timeToNum(MIN_TIME_FOR_FIRST_15)){
                    numBreaks = 0;
                    breaks = [];
                }
                else if (shiftLength >= timeToNum(MIN_TIME_FOR_FIRST_15) && shiftLength < timeToNum(MIN_TIME_FOR_FIRST_30)){
                    numBreaks = 1;
                    breaks = [25];           // 1 x 15 minute break
                }
                else if (shiftLength >= timeToNum(MIN_TIME_FOR_FIRST_30) && shiftLength < timeToNum(MIN_TIME_FOR_SECOND_15))
                {
                    numBreaks = 2;
                    breaks = [50, 25];       // 1 x 15 minute break and 1 x 30 minute break
                }
                else if (shiftLength >= timeToNum(MIN_TIME_FOR_SECOND_15) && shiftLength <= 1100)
                {
                    numBreaks = 3;
                    breaks = [25, 50, 25];   // 2 x 15 minute break and 1 x 30 minute break
                }
                this._numBreaks = numBreaks;
                this._numBreaksLeft = numBreaks;
                this._breaksLeft = breaks;
                this._pseudoStartNum = timeToNum(start);
            }
        }
        else{
            console.log("Input error in _getBreaks method")
        }
    }
    allMyBreaks()
    {
        let shiftLength = timeToNum(this._end)-timeToNum(this._start);
        if (!isNaN(shiftLength))
        {
            let allMyBreaks = [];
            let startRoundedDown = Math.floor(timeToNum(this._start)/25)*25;
            if (shiftLength >=0 && shiftLength < 300)
            {
                console.log(`${this._name} has too short shift`)
            }
            else if (shiftLength >=300 && shiftLength < 400)
            {
            }
            else if (shiftLength >=400 && shiftLength <= 500)
            {
                allMyBreaks[0] = [startRoundedDown + Math.floor(shiftLength/50)*25,25,this._name]
            }
            else if (shiftLength > 500 && shiftLength < 700)
            {
                let index = Math.floor((shiftLength-500)/50)
                allMyBreaks[0] = [startRoundedDown + BREAKS_MATRIX_2[1][index][0],50,this._name]
                allMyBreaks[1] = [startRoundedDown + BREAKS_MATRIX_2[1][index][1],25,this._name]
            } 
            else if (shiftLength >=700 && shiftLength < 1100)
            {
                let index = Math.floor((shiftLength-700)/50) + 5;        // Q: What is the +5 for? A: BREAKS_MATRIX_2 has a double entry at 7
                allMyBreaks[0] = [startRoundedDown + BREAKS_MATRIX_2[1][index][0],25,this._name]
                allMyBreaks[1] = [startRoundedDown + BREAKS_MATRIX_2[1][index][1],50,this._name]
                allMyBreaks[2] = [startRoundedDown + BREAKS_MATRIX_2[1][index][2],25,this._name]
            } 
            else 
            {
                console.log("Shift invalid (possibly too long)")
            }
            this._breakChanges = 0;
            this._allMyBreaks = allMyBreaks;
            return allMyBreaks;
        }
    }
    change()
    {
        let shiftLength = this.shiftLength;
        let allMyBreaks = this._allMyBreaks;
        // if (shiftLength === 600) // exactly 600 hour shift so they can have optional 30min break
        // {
        //     if (allMyBreaks.length === 2 && allMyBreaks[0][1] === 25)
        //     {
        //         allMyBreaks.pop()
        //         allMyBreaks[0] = [timeToNum(this._start) + Math.floor(shiftLength/50)*25,25,this._name];
        //         this._breakChanges = 0;
        //     }
        //     else if (allMyBreaks.length === 2 && allMyBreaks[0][1] === 50)
        //     {
        //         let tempTime = allMyBreaks[0][1];
        //         allMyBreaks[0][1] = allMyBreaks[1][1];
        //         allMyBreaks[1][1] = tempTime;
        //         this._allMyBreaks = allMyBreaks;
        //         this._breakChanges = 2;
        //     }
        //     else if (allMyBreaks.length === 1)
        //     {
        //         let index = Math.floor((shiftLength-600)/50)
        //         allMyBreaks[0] = [timeToNum(this._start) + BREAKS_MATRIX_2[1][index][0],50,this._name]
        //         allMyBreaks[1] = [timeToNum(this._start) + BREAKS_MATRIX_2[1][index][1],25,this._name]
        //         this._breakChanges = 1;
        //     }
        //     this._allMyBreaks = allMyBreaks;
        // } 
        if (shiftLength > 500 && shiftLength < 700)
        {
            let tempTime = allMyBreaks[0][1];
            allMyBreaks[0][1] = allMyBreaks[1][1];
            allMyBreaks[1][1] = tempTime;
            this._allMyBreaks = allMyBreaks;
            this._breakChanges = 1-this._breakChanges;
        } 
        else if (shiftLength >= 700 && shiftLength <= 1100)
        {
            if (allMyBreaks.length === 3)    // Switch from 15+30+15 to 30+30
            {
                allMyBreaks.pop()
                let index = Math.floor((shiftLength-700)/50);
                allMyBreaks[0] = [timeToNum(this._start) + BREAKS_MATRIX_3[1][index][0],50,this._name]
                allMyBreaks[1] = [timeToNum(this._start) + BREAKS_MATRIX_3[1][index][1],50,this._name]
            }
            else if (allMyBreaks.length === 2) // Switch from 30+30 to 15+30+15
            {
                let index = Math.floor((shiftLength-700)/50) + 5;
                allMyBreaks[0] = [timeToNum(this._start) + BREAKS_MATRIX_2[1][index][0],25,this._name]
                allMyBreaks[1] = [timeToNum(this._start) + BREAKS_MATRIX_2[1][index][1],50,this._name]
                allMyBreaks[2] = [timeToNum(this._start) + BREAKS_MATRIX_2[1][index][2],25,this._name]
            }
            this._allMyBreaks = allMyBreaks;
            this._breakChanges = 1-this._breakChanges;
        }
    }
    changeMyRole()
    {
        if (this._role<ROLES.length-1)
        {
            this._role += 1;
        }
        else
        {
            this._role = 0;
        }
    }
}

class StaffList {
    constructor()
    {
        this._staffList = [];
    }
    get staffList()
    {
        return this._staffList;
    }
    get numStaff()
    {
        return this._staffList.length;;
    }
    get totalBreakTime()
    {
        let totalBreakTime = 0
        for (let i in this._staffList)
        {
            totalBreakTime += this._staffList[i].breaksLeft.reduce((acc,next)=>acc+next);
        }
        return totalBreakTime;
    }
    set staffList(newStaffList)
    {
        this._staffList = newStaffList;
    }
    addStaff(staff)
    {
        this._staffList.push(staff);
    }
    findMinPseudo()
    {
        let allStaff = this._staffList;
        let validStaff = allStaff.filter(staff => staff.eligibleTime !== null)
        if (validStaff.length > 0)
        {
            let nextStaff = validStaff.reduce(function (curr, next) {
                if(curr.eligibleTime > next.eligibleTime){return next} else{return curr}})
            return nextStaff;
        }
        else{
            return null;
        }
    }
}


/*
    User Settings
        Below settings can be adjusted to meet RBA or store requirements.
*/
const MIN_TIME_FOR_FIRST_15 = "04:00";
const MIN_TIME_FOR_FIRST_30 = "05:01";
const MIN_TIME_FOR_SECOND_15 = "07:00";
const START_TIME = "08:00"; 
const END_TIME = "20:00";
const DOUBLING_START_TIME = "11:30";
let TEAM = ["Annie","Ahlam","Georgia","Takara",
                "Tahnee","Monique","Carol","Mia",
                "Emily","Renee","Katrina","Carla","Lisa K",
                "Manpreet","Ashlea","Jasmine","Arushi",
                "Kerrie","Kyra","Marjorie","Logann","Mollie",
                "Sarah","Iris","Keeley","Martina","Alana G", "Alana K",
                "Talar", "Tamar","Charlie","Courtney","Ella",
                "Lisa S","Tara","Claire","Zoe","Amelia",
                "Olivia", "Cleo","Amalia","Deborah","Anya",


                "Harry","Marty","Josh","Finley",
                "Lochie","Vimaal","Eric","Preet","Ben",
                "Christo","Christian", "Matthew","Jono",
                "Hamesh","William", "Amaan", "Oscar",
                "Joshua","Kon"];
TEAM.sort()
const testTime = 6; // seconds
const ROLES = ["SD","CnC/Hire","Reg","Door","TS","BSCO","Nurs.","Breaks","Cafe","CPA","Extra"]

// After starting a shift of t hours length, what is the minimum time before a break should be allocated:
const BREAKS_MATRIX = [
    [ 0,  1,  2,   3,   4,   5,   6,   7,   8,   9,  10],      // Time in hours
    [25, 25, 75, 125, 175, 225, 275, 300, 350, 400, 450],      // With 1 break
    [25, 25, 50,  50, 100, 100, 150, 200, 250, 300, 325],      // With 2 breaks
    [25, 25, 50,  50,  50,  50, 100, 175, 200, 225, 250]       // With 3 breaks
];
// Break offset times for 15+30, 30+15, 15+30+15. 
const BREAKS_MATRIX_2 = [
    [500,550,600,650,700,700,750,800,850,900,950,1000,1050],
    [[175,300],[200,350],[200,450],[200,450],[200,475],[150,350,550],[150,375,575],[175,400,625],[200,425,650],[200,450,675],[200,475,725],[225,500,750],[225,525,800]]
]
// Break offset times for 30+30 
const BREAKS_MATRIX_3 = [
    [700,750,800,850,900,950,1000,1050],
    [[200,450],[225,475],[250,525],[250,550],[250,575],[275,625],[300,650],[300,675]]
]

// Initialising data
let staffList = new StaffList();
let breaksList = [[],[],[],[]];
let timeNow = 0;
const END_TIME_NUM = timeToNum(END_TIME);
const START_TIME_NUM = timeToNum(START_TIME);
const DOUBLE_START_TIME_NUM = timeToNum(DOUBLING_START_TIME);
const SHIFT_DATA_KEY = "Shift data key";
const FEEDBACK_KEY = "Feedback_key";

// Local storage functions
/*
    This function updates the value in local storage at key with the argument provided.
*/
function updateLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/*
    This function extracts and provides the data in local storage at the key
*/
function getDataLocalStorage(key) {
    let result = JSON.parse(localStorage.getItem(key));
    return result;
    
}

/*
    Checks to see if the value of local storage at the key USERS_KEY is meaningful (ie non-empty)
*/
function checkLocalStorageExists(key) {
    let dataLocalStorage = getDataLocalStorage(key);
    if (dataLocalStorage == "undefined" || dataLocalStorage == null || dataLocalStorage == []) {
        return false;
    }
    else {
        return true;
    }
}

/*
    Checks if time string is in format HH:MM
*/
function isValidTimeStr(timeStr)
{
    if (typeof timeStr === "string" && timeStr.length === 5)
    {
        return true;
    }
    else
    {
        return false;
    }
}
/*
    Pair of inverse functions converting between time in the format "14:30" to 1450
*/
function timeToNum(timeStr)
{
    if (isValidTimeStr(timeStr))
    {
        let hour = timeStr.substring(0,2);
        let min = timeStr.substring(3,5);
        let timeNum = 100*hour + 100*min/60;
        return timeNum;
    }
    else
    {
        return null;
    }
}


function numToTime(timeNum)
{
    if (timeNum===null)
    {
        return null;
    }
    else
    {
        let min = ("" + (100+60*(timeNum%100)/100)).substring(1,3);
        let hour = ("" + (100+ Math.floor(timeNum/100))).substring(1,3);
        let time = hour + ":" + min;
        return time;
    }

}

function numToAmPmTime(timeNum)
{
    let tag = " am";
    if (timeNum>=1200 && timeNum < 1300)
    {
        tag = " pm";
    }
    else if (timeNum>=1300 && timeNum <= 2400)
    {
        tag = " pm";
        timeNum -= 1200;
    }
    let min = ("" + (100+60*(timeNum%100)/100)).substring(1,3);
    let hour = ("" + (100+ Math.floor(timeNum/100))).substring(1,3);
    let time = hour + ":" + min + tag;
    if (time[0]=="0")
    {
        time = time.substring(1);
    }
    return time;
}

function getRole(num)
{
    if (typeof num === "number" && num>=0 && num<ROLES.length)
    {
        return ROLES[num];
    }
    else 
    {
        console.log("error in getRole function");
        return null;
    }
}

if (checkLocalStorageExists("BREAKS_LIST"))
{
    breaksList = getDataLocalStorage("BREAKS_LIST");
}



function getDate()
{
    let date = new Date();
    let months = ["January","February","March","April","May","June","July","August","September","November","December"];
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let today = days[date.getDay()]+" " + date.getDate()+ " " + months[date.getMonth()];
    return today
}
