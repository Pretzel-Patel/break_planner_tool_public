
function addResultRow(time, name1, name2, name3, name4, perturbs, indices, needsToBeDragged)
{
    let allowDropEvent = [];
    if (name1 === null)
    {
        name1 = "";
        allowDropEvent[0] = `ondragover="allowDrop(event)"`;
    }
    if (name2 === null)
    {
        name2 = "";
        allowDropEvent[1] = `ondragover="allowDrop(event)"`;
    }
    if (name3 === null)
    {
        name3 = "";
        allowDropEvent[2] = `ondragover="allowDrop(event)"`;
    }
    if (name4 === null)
    {
        name4 = "";
        allowDropEvent[3] = `ondragover="allowDrop(event)"`;
    }
    rowData.push([numToTime(time),name1,name2,name3])
    let colors = []
    for (i=0; i<4; i++)
    {
        if (perturbs[i]<0)
        {
            colors[i] = "green";
        }
        else if (perturbs[i]>0)
        {
            colors[i] = "red";
        }
        else 
        {
            colors[i] = "black";
        }
    }
    let table = document.getElementById("resultTable");
    let row = document.createElement("TR");
    row.innerHTML = `<td class="mdl-data-table__cell--non-numeric">${numToTime(time)}</td>
                    <td id="block${time}1" class="mdl-data-table__cell--non-numeric"
                        style="color:${colors[0]}" ondrop="drop(event)" ${allowDropEvent[0]}>
                            <div class="nameBox" draggable="${needsToBeDragged[0]}" id="drag${time}1${indices[0]}" 
                                ondragstart="drag(event)">${name1}</div></td>
                    <td id="block${time}2" class="mdl-data-table__cell--non-numeric"
                        style="color:${colors[1]}" ondrop="drop(event)" ${allowDropEvent[1]}>
                            <div class="nameBox" draggable="${needsToBeDragged[1]}" id="drag${time}2${indices[1]}" 
                                ondragstart="drag(event)">${name2}</div></td>
                    <td id="block${time}3" class="mdl-data-table__cell--non-numeric"
                        style="color:${colors[2]}" ondrop="drop(event)" ${allowDropEvent[2]}>
                            <div class="nameBox" draggable="${needsToBeDragged[2]}" id="drag${time}3${indices[2]}" 
                                ondragstart="drag(event)">${name3}</div></td>
                    <td id="block${time}4" class="mdl-data-table__cell--non-numeric"
                        style="color:${colors[3]}" ondrop="drop(event)" ${allowDropEvent[3]}>
                            <div class="nameBox" draggable="${needsToBeDragged[3]}" id="drag${time}4${indices[3]}" 
                                ondragstart="drag(event)" style="">${name4}</div></td>`
    table.appendChild(row);
}

function displayPlan()
{
    let masterBreaks = [];
    rowData = [['Break Time', 'Name','Name','Name']];
    if (checkLocalStorageExists("MASTER_BREAKS"))
    {
        masterBreaks = getDataLocalStorage("MASTER_BREAKS");
    }

    // Emptying table
    document.getElementById("resultTable").innerHTML = "";
    // Adding result rows
    for (let i = 0; i<masterBreaks[0].length; i++)
    {
        let time = i*25 + timeToNum(START_TIME);
        let name1 = null;
        let name2 = null;
        let name3 = null;
        let name4 = null;
        let perturbs = [0,0,0,0];
        let indices = [null,null,null,null];
        let needsToBeDragged = [false, false, false, false];
        for (let j in masterBreaks[1][i])
        {
            if (name1 === null)
            {
                name1 = masterBreaks[2][i][j];
                perturbs[0] = masterBreaks[3][i][j]
                indices[0] = j;
                needsToBeDragged[0] = true;
            }
            else if (name2 === null)
            {
                name2 = masterBreaks[2][i][j];
                perturbs[1] = masterBreaks[3][i][j]
                indices[1] = j;
                needsToBeDragged[1] = true;
            }
            else if (name3 === null)
            {
                name3 = masterBreaks[2][i][j];
                perturbs[2] = masterBreaks[3][i][j]
                indices[2] = j;
                needsToBeDragged[2] = true;
            }
            else if (name4 === null)
            {
                name4 = masterBreaks[2][i][j];
                perturbs[3] = masterBreaks[3][i][j]
                indices[3] = j;
                needsToBeDragged[3] = true;
            }
            // else if (breaksList[2][i] === time-25 && breaksList[0][i] === 50)
            // {
            //     if (name1 === null)
            //     {
            //         name1 = breaksList[3][i];
            //     }
            //     else if (name2 === null)
            //     {
            //         name2 = breaksList[3][i];
            //     }
            //     else
            //     {
            //         console.log("error in displayPlan() function")
            //     }
            // }
            else
            {
                console.log("error in displayPlan() function - probably too many peeps")
            }
        }
        if (i>0)
        {
            for (let j in masterBreaks[1][i-1])
            {
                if (masterBreaks[1][i-1][j] === 50)
                {
                    if (name1 === null)
                    {
                        name1 = masterBreaks[2][i-1][j];
                        perturbs[0] = masterBreaks[3][i-1][j];
                        indices[0] = j;
                    }
                    else if (name2 === null)
                    {
                        name2 = masterBreaks[2][i-1][j];
                        perturbs[1] = masterBreaks[3][i-1][j];
                        indices[1] = j;
                    }
                    else if (name3 === null)
                    {
                        name3 = masterBreaks[2][i-1][j];
                        perturbs[2] = masterBreaks[3][i-1][j]
                        indices[2] = j;
                    }
                    else if (name4 === null)
                    {
                        name4 = masterBreaks[2][i-1][j];
                        perturbs[3] = masterBreaks[3][i-1][j]
                        indices[3] = j;
                    }
                }
            }
        }
        
        addResultRow(time, name1, name2, name3, name4, perturbs, indices, needsToBeDragged);
    }
    let dragSources = document.querySelectorAll('[draggable="true"]');
    dragSources.forEach(dragSource => {
        dragSource.addEventListener("dragstart", dragStart);
        dragSource.addEventListener("dragend", dragEnd);
    });
}

let rowData = [['Break Time', 'Name','Name','Name']];
timeNow = timeToNum(START_TIME);
console.log(breaksList)
displayPlan()


// Functions for drag and drop stuff
function allowDrop(event)
{
    event.preventDefault()
}

function drag(event)
{
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event)
{
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data))
    let newStart = Number(event.target.id.substring(5,event.target.id.length-1))
    let oldStart = Number(data.substring(4, data.length-2))
    let innerIndex = data.substring(data.length-1) // j value from previous function
    let masterBreaks = [];
    if (checkLocalStorageExists("MASTER_BREAKS"))
    {
        masterBreaks = getDataLocalStorage("MASTER_BREAKS");
    }
    let oldTimeIndex = (oldStart - START_TIME_NUM)/25;
    let newTimeIndex = (newStart - START_TIME_NUM)/25;

    // Pushing and removing break simultaneously
    masterBreaks[1][newTimeIndex].push(masterBreaks[1][oldTimeIndex].splice(innerIndex,1)[0])
    masterBreaks[2][newTimeIndex].push(masterBreaks[2][oldTimeIndex].splice(innerIndex,1)[0])
    masterBreaks[3][newTimeIndex].push(newStart - oldStart + masterBreaks[3][oldTimeIndex].splice(innerIndex,1)[0])
    updateLocalStorage("MASTER_BREAKS", masterBreaks);
    displayPlan()
}



function dragStart(e) {
    this.classList.add("dragging");
    e.dataTransfer.setData("text/plain", e.target.id);
    sourceContainerId = this.parentElement.id;
}

function dragEnd(e) {
    this.classList.remove("dragging");
}


let dialog1 = document.querySelector('.dialog1');
let showDialogButton1 = document.querySelector('#confirm');
if (!dialog1.showModal) {
    dialogPolyfill.registerDialog(dialog1);
}
showDialogButton1.addEventListener('click', function () {
    dialog1.showModal();
});
dialog1.querySelector('.close').addEventListener('click', function () {
    dialog1.close();
});

function receiveShiftData()
{
    // return JSON.parse(getDataLocalStorage(SHIFT_DATA_KEY))
    return getDataLocalStorage(SHIFT_DATA_KEY)
}

function reorderShiftData(data)
{
    let refinedShiftData = [['Name', 'Shift', 'Breaks']]
    for (let i=0; i<ROLES.length; i++)
    {
        if ((data.findIndex(elem => elem[3]===i))!==-1)
        {
            refinedShiftData.push([{text:(getRole(i)), colSpan: 3, alignment: 'center', margin: [0,0,127,0], bold:true,fillColor: '#A4A4A4'},{},{}]);
            for (let j=1; j<data.length; j++)
            {
                if (data[j][3]===i)
                {
                    refinedShiftData.push(data[j].splice(0,3));
                }
            }
        }
    }
    return refinedShiftData;
}
function createPDF()
{
    let shiftData = reorderShiftData(receiveShiftData());
    for (let i=shiftData.length; i<rowData.length; i++)
    {
        shiftData.push(["","",""])
    }
    let doc =  {
        content: [
            {
                alignment: 'justify',
                columns: [                  
                    {                          
                        text:"Support Daily Run Sheet",
                        style:"header"    
                    },
                    {
                        text: "Date: "+getDate(),
                        style:"header"
                    }
                ]
            },
            {
                alignment: 'justify',
                columns: [                  
                    {
                        width: '45%',
                        style: 'table',
                        table: {
                            heights:9.4,
                            widths: [55,55,55],
                            body: shiftData
                        }
                    },
                    {
                        width: '55%',
                        style: 'table',
                        table:{
                            heights: 9.4,
                            widths: [50,'*','*','*'],
                            body: rowData
                            
                        }
                    }
                ]
            }
            
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            table: {
                margin: [0, 0, 20, 0],
                fontSize: 8,
                alignment: 'center'
            }
        }
        
    }

    pdfMake.createPdf(doc).download()
}
