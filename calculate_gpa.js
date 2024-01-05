const get_gpv = (result) => {
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
    }else if (result === 'C+' || result === 'A+ : C+' || result === 'A : C+' || result === 'A- : C+' || result === 'B+ : C+' || result === 'B : C+' || result === 'B- : C+'  || result === 'C+ : C+'){
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
            result = get_gpv(row.innerText.split("\t")[4])
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
        gpa_class = get_class(GPA)
        GPA = GPA.toFixed(4)
        gpa_element = document.getElementById('gpa')
        gpa_class_element = document.getElementById('gpa_class')
        if(gpa_element){
            gpa_element.textContent = `GPA : ${GPA}`;
            if(gpa_class !== undefined) gpa_class_element.textContent = `Class : ${gpa_class}`
            else gpa_class_element.textContent = ''
        }else{
            alert(`GPA : ${GPA}\nClass : ${gpa_class}`);
        }
    }
}


const get_class = (GPA) => {
    if (GPA >= 3.7){
        return 'First Class'
    }else if(GPA >= 3.3){
        return 'Second Class (Upper Division)'
    }else if (GPA >= 3){
        return 'Second Class (Lower Division)'
    }else{
        return
    }
}


const get_tables = () => {
    return Array.from(document.getElementsByTagName("table"))
}


const modify_page = (tables) => {

    GPA = null
    gpa_class = null

    var gpah5Element = document.createElement('h5');
    var gpastrongElement = document.createElement('strong');
    gpastrongElement.id = 'gpa'
    gpastrongElement.textContent = `GPA : ${GPA}`;
    gpah5Element.appendChild(gpastrongElement)

    var gpa_class_h5Element = document.createElement('h5');
    var gpa_class_strongElement = document.createElement('strong');
    gpa_class_strongElement.id = 'gpa_class'
    gpa_class_strongElement.textContent = `Class : ${gpa_class}`;
    gpa_class_h5Element.appendChild(gpa_class_strongElement)


    var primaryTag = document.getElementById('primary');
    let gpaInsertLocation = 4

    if (primaryTag) {
        if (primaryTag.children.length >= gpaInsertLocation) {
            primaryTag.insertBefore(gpah5Element, primaryTag.children[gpaInsertLocation]);
            primaryTag.insertBefore(gpa_class_h5Element, primaryTag.children[gpaInsertLocation+1]);
            gpah5Element.className = primaryTag.children[gpaInsertLocation].className
            gpa_class_h5Element.className = primaryTag.children[gpaInsertLocation].className
        } else {
            console.error("The div doesn't have enough children.");
        }
    } else {
        alert(`GPA : ${GPA}`);
    }

    repeat_subject_list = []

    
    for(i = 0; i < tables.length; i++){
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
                checkbox.className = "form-check-input bg-danger border-danger"
                checkboxDiv.appendChild(checkbox)
                checkboxCell.appendChild(checkboxDiv);
                row.appendChild(checkboxCell);
        
            }
        });
    }
    
}


const handle_repeat_subjects = (tables) => {
    for(i = 0; i < tables.length; i++){
        rows = tables[i].querySelectorAll('tr')
        for(j = 0; j < rows.length; j++){
            row_j = rows[j]
            row_j_innerText = row_j.innerText.split("\t")
            subject_name_j = row_j_innerText[0].toLowerCase().trim()
            subject_year_j = parseInt(row_j_innerText[1].toLowerCase().trim().slice(1, -1));
            result_j = row_j_innerText[4]
            if(row_j === 'subject') continue
            for(k = j + 1; k < rows.length; k++){
                row_k = rows[k]
                row_k_innerText = row_k.innerText.split("\t")
                subject_name_k = row_k_innerText[0].toLowerCase().trim()
                    if (subject_name_j === subject_name_k) {
                        subject_year_k = parseInt(row_k_innerText[1].toLowerCase().trim().slice(1, -1));
                        result_k = row_k_innerText[4]
                        if (subject_year_j < subject_year_k && get_gpv(result_j) <= get_gpv(result_k)) {
                            included_in_gpa = row_j_innerText[5]
                            if(!isNaN(included_in_gpa)){
                                checkbox_j = row_j.querySelectorAll('input')
                                checkbox_j[0].checked = false
                                checkbox_j[0].disabled = true
                            }
                            row_k.querySelectorAll('td')[4].textContent = row_k.querySelectorAll('td')[4].textContent + ' : C+'
                        }else {
                            included_in_gpa = row_k_innerText[5]
                            if(!isNaN(included_in_gpa)){
                                checkbox_k = row_k.querySelectorAll('input')
                                checkbox_k[0].checked = false
                                checkbox_k[0].disabled = true
                            }
                        }
                    }
            }
        }
    }
}


const check_if_correct_page = () =>{
    tables = get_tables()
    if (tables.length > 0){
        modify_page(tables)
        handle_repeat_subjects(tables)
        calculate_gpa()
    }
}


check_if_correct_page()

