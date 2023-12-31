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
        result_records.forEach((x) => {
            credit = parseInt(x.innerText.split("\t")[3])
            result = return_result_gpa(x.innerText.split("\t")[4])
            if (credit === 0 || isNaN(credit) || result === -1 ) {
                return;
            }
            total_credits += credit
            prod_credit_results += credit * result
        });
        GPA = prod_credit_results/total_credits
        GPA = GPA.toFixed(4)
        // Create a new h1 element
        var gpah5Element = document.createElement('h5');
        var gpastrongElement = document.createElement('strong');
        gpastrongElement.textContent = `GPA : ${GPA}`;
        gpah5Element.appendChild(gpastrongElement)

        // Get the parent div by its id
        var primaryTag = document.getElementById('primary');
        let gpaInsertLocation = 4

        // Check if the div exists
        if (primaryTag) {
            // Check if the div already has at least 3 children
            if (primaryTag.children.length >= gpaInsertLocation) {
                // Insert the h1 element as the 4th child
                primaryTag.insertBefore(gpah5Element, primaryTag.children[gpaInsertLocation]);
            } else {
                console.error("The div doesn't have enough children.");
            }
        } else {
            alert(`GPA : ${GPA}`);
        }
    }
}
calculate_gpa()
