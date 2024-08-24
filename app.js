/***** VARIABLE ASSIGNMENT ******/

const form = document.getElementById('user-form');
const expenseDesc = document.getElementById('name');
const date = document.getElementById('date');
const amountSpent = document.getElementById('amount');
const tableBody = document.querySelector('.table-body');


/****** EVENT LISTNERS *****/
// form
form.addEventListener("submit", addExpense);


/***** FUNCTIONS *******/
// add expense function
function addExpense(e){
    e.preventDefault();
    let NewDate = new Date()
    // console.log(expenseDesc.value);
    // console.log(date.value);
    // console.log(amountSpent.value);
    let hrs = function(NewDate){
        return NewDate.getHours()% 12 || 12;
    }

    const tableRow = document.createElement('tr');
    tableRow.classList.add('table-row');

    tableRow.innerHTML = `<th scope="row">${expenseDesc.value}</th>
    <td>${date.value}</td>
    <td>NGN ${amountSpent.value}</td>
    <td>${hrs(NewDate)}:${NewDate.getMinutes()}  <span>
        <!-- delete entry btn -->
            <button type="button" class=" btn btn-sm  del-btn">
                <i class="fa-solid fa-trash-can del-icon"></i>
            </button>
        </span>
    </td>`;


    
    tableBody.append(tableRow);

// rest to defaualt
    resetToDefault()
}

// reset to default function

function resetToDefault(){
    expenseDesc.value ="";
    date.value ="";
    amountSpent.value ="";
}