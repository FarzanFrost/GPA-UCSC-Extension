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
        alert(`GPA : ${prod_credit_results/total_credits}`);
    }
}
calculate_gpa()
