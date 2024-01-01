const return_result_gpa = (result) => {
    if (result === 'A' || result ==='A+') {
        return 4.00;
    } else if (result === 'A-') {
        return 3.70;
    }else if (result === 'B+'){
        return 3.30;
    }else if (result === 'B'){
        return 3.00;
    }else if (result === 'B-'){
        return 2.70;
    }else if (result === 'C+'){
        return 2.30;
    }else if (result === 'C'){
        return 2.00;
    }else if(result === 'C-'){
        return 1.70;
    }else if(result === 'D+'){
        return 1.30;
    }else if (result === 'D'){
        return 1.00;
    }else if (result === 'E' || result === 'F'){
        return 0;
    }else{
        return -1;
    }
}
const calculate_gpa = () => {
    result_records = Array.from(document.getElementsByTagName("tr"))
    if (result_records.length > 0){
        let total_credits = 0
        let prod_credit_results = 0
        result_records.forEach((row) => {
            credit = parseInt(row.innerText.split("\t")[3])
            result = return_result_gpa(row.innerText.split("\t")[4])
            included_in_gpa = row.innerText.split("\t")[5]
            is_included_in_gpa = true
            if(!isNaN(included_in_gpa)){
                checkbox = row.querySelectorAll('input')
                is_included_in_gpa = checkbox[0].checked
            }
            if (credit === 0 || isNaN(credit) || result === -1 || !is_included_in_gpa) {
                return;
            }
            total_credits += credit
            prod_credit_results += credit * result
        });
        GPA = prod_credit_results/total_credits
        GPA = GPA.toFixed(4)
        gpa_element = document.getElementById('gpa')
        if(gpa_element){
            gpa_element.textContent = `GPA : ${GPA}`;
        }else{
            alert(`GPA : ${GPA}`);
        }
    }
}


const get_tables = () => {
    return Array.from(document.getElementsByTagName("table"))
}


const modify_page = (tables) => {

    GPA = null

    var gpah5Element = document.createElement('h5');
    var gpastrongElement = document.createElement('strong');
    gpastrongElement.id = 'gpa'
    gpastrongElement.textContent = `GPA : ${GPA}`;
    gpah5Element.appendChild(gpastrongElement)


    var primaryTag = document.getElementById('primary');
    let gpaInsertLocation = 4

    if (primaryTag) {
        if (primaryTag.children.length >= gpaInsertLocation) {
            primaryTag.insertBefore(gpah5Element, primaryTag.children[gpaInsertLocation]);
            gpah5Element.className = primaryTag.children[gpaInsertLocation].className
        } else {
            console.error("The div doesn't have enough children.");
        }
    } else {
        alert(`GPA : ${GPA}`);
    }

    if (tables.length > 2){
        for(i = 2; i < tables.length; i++){
            rows = tables[i].querySelectorAll('tr')
            rows.forEach((row) => {
                credit = row.innerText.split("\t")[3]
                if (credit.toLowerCase() === 'credits'){
                    th = row.querySelectorAll('th')[0]
                    var checkboxCell = document.createElement('th');
                    checkboxCell.className = th.className
                    checkboxCell.textContent = 'Included in GPA'
                    row.appendChild(checkboxCell);
                }else{
                    var checkboxDiv = document.createElement('div')
                    checkboxDiv.className = "form-check form-switch"
                    td = row.querySelectorAll('td')[0]
                    var checkboxCell = document.createElement('td');
                    checkboxCell.className = td.className
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = true;
                    checkbox.addEventListener('change', function () {
                        calculate_gpa()
                    });
                    checkbox.className = "form-check-input"
                    checkboxDiv.appendChild(checkbox)
                    checkboxCell.appendChild(checkboxDiv);
                    row.appendChild(checkboxCell);
            
                }
            });
        }
    }
    
}


const check_if_correct_page = () =>{
    tables = get_tables()
    if (tables.length > 0){
        modify_page(tables)
        calculate_gpa()
    }
}
check_if_correct_page()

