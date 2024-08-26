/***** VARIABLE ASSIGNMENT ******/
// DOM variables
const form = document.getElementById('user-form');
const expenseDesc = document.getElementById('name');
const date = document.getElementById('date');
const amountSpent = document.getElementById('amount');
const tableBody = document.querySelector('.table-body');
const alert = document.querySelector('.alert');
const clearBtn = document.querySelector('.clear-btn');
const addItemBtn = document.querySelector('.add-item-btn');
const placeHolderRow = document.getElementById("placeholder-row");

// Other variables
let editFlag = false;
let editID;
let editedValue = "";
let editedDate = "";
let editedCost = "" ;


/****** EVENT LISTNERS *****/
// form
form.addEventListener("submit", addExpense);

// ensure date is not set in the future 
date.addEventListener('change',dateValidation)

// clear expense button
clearBtn.addEventListener("click", clearAllExpenseEntries)




/***** FUNCTIONS *******/
// add expense function
function addExpense(e){
    // prevent from submitting
    e.preventDefault();
    
    //get form input values
    let itemValue = expenseDesc.value;
    let itemDate = date.value;
    let itemCost = amountSpent.value
   
    //converting hrs to 12hrs format
    let NewDate = new Date();
    // Function to get the hour in 12-hour format
    let getHoursIn12Format = function(date) {
        return date.getHours() % 12 || 12;
    };

    let hrs = getHoursIn12Format(NewDate);
    let mins = NewDate.getMinutes(); 

    // Ensuring that hours and minutes are double-digit strings
    hrs = hrs < 10 ? `0${hrs}` : `${hrs}`;
    mins = mins < 10 ? `0${mins}` : `${mins}`;


    // checking conditions
    if(itemValue && itemDate && itemCost && !editFlag){
            // remove placeholder row
            placeHolderRow.remove();
            // creating table elements
            const tableRow = document.createElement('tr');
            tableRow.classList.add('table-row');
            //create id attribute
            const id = NewDate.getTime()
            const attr = document.createAttribute('data-row-id');
            attr.value = id;
            tableRow.setAttributeNode(attr);
        
            //assign entry value to the table row 
            tableRow.innerHTML = `<th scope="row">${itemValue}</th>
            <td>${itemDate}</td>
            <td>NGN ${itemCost}</td>
            <td>${hrs}:${mins} <span class="suffix"></span></td>
            <td>
                 <span>
                <!-- delete entry btn -->
                    <button type="button" class="btn btns btn-sm  del-btn">
                        <i class="fa-solid fa-trash-can del-icon"></i>
                    </button>
                    <button type="button" class=" btn btns btn-sm  edit-btn">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </span>
            </td>`;
        // append new row to table
        tableBody.appendChild(tableRow);
         // adding PM or AM
         const timeSuffix = document.querySelectorAll('.suffix')
        //  console.log(timeSuffix);
         timeSuffix.forEach(suffix=>{
            suffix.textContent = NewDate.getHours() > 12 ? 'PM':'AM';
         })
        // DOM variable assignment Delete and edit buttons
        const delBtn = document.querySelectorAll('.del-btn');
        const editBtn = document.querySelectorAll('.edit-btn');
        //delete expense
        delBtn.forEach(btn=>{
            btn.addEventListener("click",deleteEntry);
        })
        //edit expense
        editBtn.forEach(btn=>{
            btn.addEventListener("click",editEntry);
        })
        // editBtn.addEventListener("click",editEntry);
        //display alert
        displayAlert('expense added to the list','success');
        // show clear items btn
        if(tableBody.childElementCount > 0){
            clearBtn.classList.add('show-btn');
        }
        // reset to default
            resetToDefault();
    }else if(itemValue && itemDate && itemCost && editFlag){
        // editEntry()
        editedValue.textContent = expenseDesc.value;
        // editedDate.textContent = date.value;
        editedCost.textContent = amountSpent.value;

        //display alert
        displayAlert("entry has been modified","waring");

        //reset to default
        resetToDefault();

        
    }
    else{
        displayAlert('invalid entry! can not submit empty fields','danger');
        resetToDefault();
    }
}


// reset to default function
function resetToDefault(){
    // set edit flag and editID back to default
    editFlag=false;
    editID = "";
    // reset form values to empty string
    expenseDesc.value ="";
    date.value ="";
    amountSpent.value ="";
    // update submit button
    addItemBtn.classList.remove("btn-primary")
    addItemBtn.classList.add("btn-success");
    addItemBtn.textContent="Add Item";
    
}


//display alert function 
function displayAlert(text,action){
    alert.textContent = `${text}`;
    alert.classList.add(`alert-${action}`);
    
    //alert time out
    setTimeout(()=>{
    alert.textContent= '';
    alert.classList.remove(`alert-${action}`);
    },2000)
}


// delete entry function
function deleteEntry(e){
    // transverse the DOM
    let currEntry = e.target;
        for(let i=0; i<4; i++){
            currEntry = currEntry.parentElement;
        }
    // remove entry 
        currEntry.remove();
    // remove clear button
    if(tableBody.childElementCount === 0){
        clearBtn.classList.remove('show-btn');
    }
    // display alert
    displayAlert("entry has been deleted","danger")
    // reset to default
    resetToDefault();  
}


//edit entry function
function editEntry(e){
    console.log('editing entry');
    // change edit flag
    editFlag = true;
    // get edit id
    editID = e.target;
    for(let i=0; i<4; i++){
        editID = editID.parentElement;
    }
    // update submit button
    addItemBtn.classList.remove("btn-success")
    addItemBtn.classList.add("btn-primary");
    addItemBtn.textContent="edit entry";

    expenseDesc.value = editedValue.textContent;
    // date.value = new Date(editedDate.textContent);
    amountSpent.value = editedCost.textContent; 
}


// clear all expense entries function
function clearAllExpenseEntries(){
    // tableBody.replaceChildren('');
    // select all elements with table-row class
    const elements = document.querySelectorAll(".table-row");
    //remove the row if there is any 
    if(elements.length > 0){
        elements.forEach(row=>{
            row.remove();
        })
    }
    //display alert
    displayAlert("all entries have been cleared", "warning");
    //hide the clear button
    if(tableBody.childElementCount === 0){
        clearBtn.classList.remove('show-btn');
    }
    // reset to default
    resetToDefault();
}


// date validation function
function dateValidation(){
    // get current date
    let currentDate = new Date();
    //get user inputed date
    let timeStamp = new Date(date.value).getTime();
    // check if userdate is older than current date
    // if older reset to default
    if(timeStamp > currentDate.getTime()){
        displayAlert('can not set a future date for entries','warning');
        resetToDefault();
    }
}