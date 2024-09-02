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
const totalSpent = document.querySelector(".total");

// Other variables
let editFlag = false;
let editID;
let editedValue = "";
let editedCost = "" ;
let pricesArray=[];
// let cost="";


/****** EVENT LISTNERS *****/
// form
form.addEventListener("submit", addExpense);

// ensure date is not set in the future 
date.addEventListener('change',dateValidation);

// clear expense button
clearBtn.addEventListener('click', clearAllExpenseEntries);

//genrate place holder row
window.addEventListener('DOMContentLoaded',()=>{
    let row = generatePlaceHolderRow()
    tableBody.appendChild(row)
});

//load DOM content
window.addEventListener('DOMContentLoaded', loadDOMContent)




/***** FUNCTIONS *******/
// add expense function
function addExpense(e){
    // prevent from submitting
    e.preventDefault();
    
    //get form input values
    let itemValue = expenseDesc.value;
    let itemDate = date.value;
    let itemCost = amountSpent.value;
    // cost = itemCost;
    const id = new Date().getTime().toString();
    
   
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

    let time = `${hrs}:${mins}`

    // checking conditions
    if(itemValue && itemDate && itemCost && !editFlag){

        // setting up and appending new entries to the table
        setupItems(id,itemValue,itemDate,itemCost,time);
        
         //set up total in local storage
         setTotalInLocalStorage(itemCost,id);

        
        //display alert
        displayAlert('expense added to the list','success');
        // show clear items btn
        if(tableBody.childElementCount > 0){
            clearBtn.classList.add('show-btn');
        }
       
        //update total
        getTotal()
          // add to local storage
          addEntryToLocaleStorage(id,itemValue,itemDate,itemCost,time)
        // reset to default
            resetToDefault();
      

    }else if(itemValue && itemCost && editFlag){
        // update values of edited entry 
        editedValue.textContent = expenseDesc.value;
        editedCost.textContent = amountSpent.value;

        //display alert
        displayAlert("entry has been modified","success");
        //edit localstorage
         editItemInLocalStorage(editID,itemValue,itemCost,time);
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
    addItemBtn.classList.remove("btn-primary");
    addItemBtn.classList.add("btn-success");
    addItemBtn.textContent="Add Item";
    //enable date input field
    date.removeAttribute("disabled");
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
    let element = e.currentTarget
    // transverse the DOM
    let currEntry = e.target;
        for(let i=0; i<4; i++){
            currEntry = currEntry.parentElement;
        }
    //delete id
    let id = currEntry.dataset.rowId;
    // delete selected price from prices array
    deletePriceInLocalStorage(element,id);
        // update total on the page
        getTotal()
   
    // delete selected entry 
    currEntry.remove();
    
  
    // remove clear button
    if(tableBody.childElementCount === 0){
        clearBtn.classList.remove('show-btn');
        // update total
        totalSpent.textContent = `NGN 0.00`;
        pricesArray.length=0;
        //generate place holder row
        let row = generatePlaceHolderRow();
        //show placeholder row
        tableBody.appendChild(row)
    }
    // display alert
    displayAlert("entry has been deleted","danger")

    // delete from local storage
    deleteItemInLocalStorage(id)
    // reset to default
    resetToDefault();  
    // console.log(currEntry.dataset.rowId)
}


//edit entry function
function editEntry(e){
    // change edit flag
    editFlag = true;
    // get edit id
    editID = e.target;
    for(let i=0; i<4; i++){
        editID = editID.parentElement;
    }
    editID = editID.dataset.rowId
    // update submit button
    addItemBtn.classList.remove("btn-success")
    addItemBtn.classList.add("btn-primary");
    addItemBtn.textContent="edit entry";
    
    // get expenseDesc value
    editedValue = e.currentTarget.parentElement.parentElement.
    previousElementSibling.previousElementSibling.
    previousElementSibling.previousElementSibling;

    // get amountSpent value
    editedCost= e.currentTarget.parentElement.parentElement.
    previousElementSibling.previousElementSibling;
    
    // update entry values
    expenseDesc.value = editedValue.textContent;
    amountSpent.value = editedCost.textContent; 
    //disable date input field
    date.setAttribute('disabled',true);
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
    //generate place holder row
    let row = generatePlaceHolderRow();
    // update total
    totalSpent.textContent = `NGN 0.00`;
    pricesArray.length=0;
    //hide the clear button
    if(tableBody.childElementCount === 0 ){
        clearBtn.classList.remove('show-btn');
        //show placeholder row
        tableBody.appendChild(row)
    }

    //clear local storage
    localStorage.clear()
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

// calculate expenses total function
function getTotal(){
    // dynamically asign the value based on the content of the prices array
    pricesArray = JSON.parse(localStorage.getItem("total"));
    // pricesArray = localStorage.getItem("total")? JSON.parse(localStorage.getItem("total")):[];
    // pricesArray.push(Number(itemValue.replace(/,/g, '')));
    let total = pricesArray.length === 1? pricesArray[0].itemCost:`0.00`;

    // reduce the prices array if its content are greater than one
    if(pricesArray.length > 1){
        let prices = pricesArray.map(item=> item.itemCost);
        
        // prices = prices.map(price=> Number(price));


        total = prices.reduce((sum,item)=>sum + item);
      
    }
    // update the value of total on the page
    totalSpent.textContent = `NGN ${total.toLocaleString()}`;
    localStorage.setItem("total",JSON.stringify(pricesArray));
}

// generate placeholder Row
function generatePlaceHolderRow(){
    const placeHolderRow = document.createElement('tr')
    placeHolderRow.setAttribute('id','placeholder-row')
    placeHolderRow.classList.add('table-row','p-rows');
    placeHolderRow.innerHTML = `
    <!-- placeholder row -->
    <tr class="table-row" id="placeholder-row">
        <th scope="row" class="placeholder-txt" >No expenses added yet!</th>
        <td></td>
        <td></td>
        <td colspan="1"></td>
        <td></td>
    </tr>
    `;
    return placeHolderRow
}







// ********** LOCAL STORAGE ***********

// add to local storage
function addEntryToLocaleStorage(id,itemValue,itemDate,itemCost,time){
    // create and entry object for each entry
    const entry = {
        id:id,
        itemValue:itemValue,
        itemDate:itemDate,
        itemCost:itemCost,
        time:time
    }
     // get entries from local storage
    const entryArray = getLocalStorageItems();
    // update the value of array with the newly created entry object
    entryArray.push(entry);
    // replace the previous array with the updated array,
    localStorage.setItem("entries",JSON.stringify(entryArray));
}

// Remove from local storage
function deleteItemInLocalStorage(id){
    // get entries from local storage
    let entries = getLocalStorageItems();
    //filter entries by id
    entries = entries.filter(item=>{
        if(item.id !== id){
            return item;       
        }
    })
    // replace the values of the entries array with the returned array in localStorage
    localStorage.setItem("entries",JSON.stringify(entries));
}

// edit from local storage
function editItemInLocalStorage(editID,itemValue,itemCost,time){
    // get entries from local storage
    let entries = getLocalStorageItems()
    // using the map method modify the item in the entries array that matches the editID 
    entries = entries.map(item=>{
        if(item.id === editID){
            // return the modified object to the array
           return {
            // using the spread operator to ensure that other properties in the object remain unchanged 
            ...item,
            // update the key values with the arguement passed into the function
            itemValue:itemValue,
            itemCost:itemCost,
            time:time
           }
           
        }
        // return the modified array item to the array
        return item
    })

    // replace the values of the entries array with the modified array in localStorage
    localStorage.setItem("entries",JSON.stringify(entries));
}


// getitem function
function getLocalStorageItems(){
    // using a tenary operator, dyanamically set the values of the entries key in local storage
        //*if local storage contains entries key, parse the values inside it it and then asign it as the value of entryArry
        //* if it doesnt then set the value of entryArray to and empty array
    return  localStorage.getItem("entries")? JSON.parse(localStorage.getItem("entries")):[];
}

//set total in local storage
function setTotalInLocalStorage(itemCost,id){
    let price = Number(itemCost.replace(/,/g, ''));
    let entryPrices = {
        itemCost:price,
        id:id
    }

    pricesArray.push(entryPrices);
    localStorage.setItem("total",JSON.stringify(pricesArray));
} 

// delete price from local storage
function deletePriceInLocalStorage(element,id){
     // get item price
     let item =  element.parentElement.parentElement.
     previousElementSibling.previousElementSibling;
     item = item.textContent.slice(3);
     //format from string to number
     item = Number(item.replace(/,/g,""));
       // get new array of prices after filtering  
         pricesArray = pricesArray.filter(entry=>{
         if( entry.itemCost !== item && entry.id !== id){
             return entry;
         }
     })
     // update the value of the prices array with the results of the filter
     // pricesArray = updatedPrices;
     localStorage.setItem("total",JSON.stringify(pricesArray));
}





// ***** SETUP FUNCTION**********
// setup items from localstorage when DOMContent is Loaded
function loadDOMContent(){
    // get entries from local storage
    let entries = getLocalStorageItems();
    // check if there are any entries in the local storage
    if(entries.length>0){
        // if there are entries the iterate over the array of objects 
        entries.forEach(entry=>{
            //append each entry object to the table.
            setupItems(entry.id,entry.itemValue,entry.itemDate,entry.itemCost,entry.time);
         })
        // show the clear list button if entries exist.
         clearBtn.classList.add('show-btn');
            //set up total         
             getTotal()
        }
    
   }


// setting up and appending new entries to the table
function setupItems(id,itemValue,itemDate,itemCost,time){
                // remove placeholder row
                const pRows=document.querySelectorAll('.p-rows');
                pRows.forEach(row=>{row.remove()});
                // placeHolderRow.classList.add('hide-placeholder');
                // creating table elements
                const tableRow = document.createElement('tr');
                tableRow.classList.add('table-row');
                //create id attribute
                const attr = document.createAttribute('data-row-id');
                attr.value = id;
                tableRow.setAttributeNode(attr);
            
                 
                //assign entry value to the table row 
                tableRow.innerHTML = `<th scope="row">${itemValue}</th>
                <td>${itemDate}</td>
                <td>NGN ${itemCost}</td>
                <td>${time} <span class="suffix"></span></td>
                <td>
                     <span>
                    <!-- delete entry btn -->
                        <button type="button" class="btn btns btn-sm  del-btn">
                            <i class="fa-solid fa-trash-can del-icon"></i>
                        </button>
                        <!-- edit entry btn -->
                        <button type="button" class=" btn btns btn-sm  edit-btn">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </span>
                </td>`;
        // append new row to table
        tableBody.appendChild(tableRow);
        // adding PM or AM
        const timeSuffix = document.querySelectorAll('.suffix');
        timeSuffix.forEach(suffix=>{
           suffix.textContent = new Date().getHours() > 12 ? 'PM':'AM';
        })
         // DOM variable assignment Delete and Edit buttons
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
}
