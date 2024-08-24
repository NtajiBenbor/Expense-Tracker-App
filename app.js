/***** VARIABLE ASSIGNMENT ******/
// DOM variables
const form = document.getElementById('user-form');
const expenseDesc = document.getElementById('name');
const date = document.getElementById('date');
const amountSpent = document.getElementById('amount');
const tableBody = document.querySelector('.table-body');
const alert = document.querySelector('.alert');

// Other variables
let editFlag = false;
let editID;
let editValue ;


/****** EVENT LISTNERS *****/
// form
form.addEventListener("submit", addExpense);


/***** FUNCTIONS *******/
// add expense function
function addExpense(e){
    // prevent from submitting
    e.preventDefault();
    //get form input values
    let NewDate = new Date();
    let itemValue = expenseDesc.value;
    let itemDate = date.value;
    let itemCost = amountSpent.value
    //converting hrs to 12hrs format
    let hrs = function(NewDate){
        return NewDate.getHours()% 12 || 12;
    }

    // checking conditions
    if(itemValue && itemDate && itemCost){
            // creating table elements
            const tableRow = document.createElement('tr');
            tableRow.classList.add('table-row');
            //create id attribute
            const id = NewDate.getTime()
            const attr = document.createAttribute('data-rowID');
            attr.value = id;
            tableRow.setAttributeNode(attr);
  

            tableRow.innerHTML = `<th scope="row">${itemValue}</th>
            <td>${itemDate}</td>
            <td>NGN ${itemCost}</td>
            <td>${hrs(NewDate)}:${NewDate.getMinutes()}</td>
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
        //display alert
        displayAlert('expense added to the list','success');
        // rest to defaualt
            resetToDefault()
    }
}

// reset to default function

function resetToDefault(){
    expenseDesc.value ="";
    date.value ="";
    amountSpent.value ="";
}
//display alert function 
function displayAlert(text,action){
    alert.textContent = `${text}`;
    alert.classList.add(`alert-${action}`)
    
    //alert time out
    setTimeout(()=>{
    alert.textContent= '';
    alert.classList.remove(`alert-${action}`);
    },1500)
}