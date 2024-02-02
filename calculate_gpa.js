gpaTableId = 'gpaTable'
class Subject{
    constructor(credit, result, checkbox, year, semester){
        this.credit = credit
        this.result = result
        this.checkbox = checkbox
        this.year = year
        this.semester = semester
    }
}
let Subjects = new Map()
const gradePointValue = new Map([
    ['A+', 4.00],
    ['A', 4.00],
    ['A-', 3.70],
    ['B+',3.30],
    ['B', 3.00],
    ['B-', 2.70],
    ['C+', 2.30],
    ['C', 2.00],
    ['C-', 1.70],
    ['D+', 1.30],
    ['D', 1.00],
    ['E', 0],
    ['F', 0],
    ['CM', -1],
    ['MC', -2],
]);
class Row{
    constructor(row){
        this.row = row
        this.SubjectName = row.innerText.split("\t")[0].toLowerCase().trim()
        this.year = parseInt(row.innerText.split("\t")[1].toLowerCase().trim().slice(1, -1));
        this.semester = parseInt(row.innerText.split("\t")[2].toLowerCase().trim().slice(1, -1));
        this.credit = row.innerText.split("\t")[3].toLowerCase()
        this.result = row.innerText.split("\t")[4]
        this.checkbox = row.querySelectorAll('input')[0]
        this.th = row.querySelectorAll('th')[0]
        this.td = row.querySelectorAll('td')[0]
    }
}


const get_gpv = (result) => {
    if(!gradePointValue.has(result)){
        return -1
    }
    return gradePointValue.get(result)
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


const examineResults = (tables) => {
    Subjects.clear()
    for(i = 0; i < tables.length; i++){
        const rows = tables[i].querySelectorAll('tr')
        rows.forEach((row) => {
            row = new Row(row)
            if (row.credit !== 'credits'){
                checkbox = row.checkbox
                year = i + 1
                semester = row.semester
                const subject = new Subject(row.credit, row.result, checkbox, year, semester)
                if(Subjects.has(row.SubjectName)){
                    const subjectOld = Subjects.get(row.SubjectName)
                    // Here the foreach loop will give the 1st repeat before the 2nd repeat,
                    // So we don't have to check for the year.
                    
                    if(get_gpv(subjectOld.result) < get_gpv(subject.result)){
                        subjectOld.checkbox.checked = false
                        subjectOld.checkbox.disabled = true
                        if(get_gpv(subjectOld.result) !== get_gpv('MC')){
                            if(get_gpv(subject.result) > get_gpv('C+')){
                                subject.result = 'C+'
                            }    
                        }
                    }else{
                        subject.checkbox.checked = false
                        subject.checkbox.disabled = true
                        subject.result = subjectOld.result
                    }
                    
                }
                Subjects.set(row.SubjectName, subject)
            }
        })
    }
}


const calculate_gpa = (tables) => {
    examineResults(tables)
    let total_credits_map = new Map()
    let prod_credit_results_map = new Map()
    for(let subject of Subjects.values()){
        if(get_gpv(subject.result)<=0)continue
        if(!subject.checkbox.checked)continue
        if(subject.checkbox.disabled)continue
        key = `year ${subject.year} semester ${subject.semester}`
        if(total_credits_map.has(key)){
            total_credits_map.set(key, total_credits_map.get(key) + parseInt(subject.credit))
            prod_credit_results_map.set(key, prod_credit_results_map.get(key) + (parseInt(subject.credit)  * get_gpv(subject.result)))
        }else{
            total_credits_map.set(key, parseInt(subject.credit))
            prod_credit_results_map.set(key, parseInt(subject.credit)  * get_gpv(subject.result))
        }
    }
    let total_credits = 0
    let prod_credit_results = 0
    let gpaYearSemester = new Map()

    for(let [key, value] of total_credits_map.entries()){
        semesterGPA = prod_credit_results_map.get(key) / value
        gpaYearSemester.set(key, semesterGPA.toFixed(4))
        total_credits += value
        prod_credit_results += prod_credit_results_map.get(key)
    }
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

    gpa_table = document.getElementById(gpaTableId)

    gpa_table.innerHTML = `
        <thead>
        <tr>
        <th scope="col">Year</th>
        <th scope="col">Semester</th>
        <th scope="col">GPA</th>
        </tr>
        <tbody>
            ${Array.from(gpaYearSemester).map(([key, value]) => `<tr><td>${key.split(' ')[1]}</td><td>${key.split(' ')[3]}</td><td>${value}</td></tr>`).join('')}
        </tbody>
`;


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

    var gpa_table_topic = document.createElement('h5');
    var gpa_table_topic_strongElement = document.createElement('strong');
    gpa_table_topic_strongElement.id = 'gpatabletopic'
    gpa_table_topic_strongElement.textContent = 'YEAR-SEMESTER VS GPA';
    gpa_table_topic.appendChild(gpa_table_topic_strongElement)
    gpa_table_topic.style.paddingLeft = "40%"

    var gpa_table = document.createElement('table')
    gpa_table.id = gpaTableId
    gpa_table.className = "table table-dark table-hover table-bordered"

    var primaryTag = document.getElementById('primary');
    let gpaInsertLocation = 4

    if (primaryTag) {
        if (primaryTag.children.length >= gpaInsertLocation) {
            primaryTag.insertBefore(gpah5Element, primaryTag.children[gpaInsertLocation]);
            primaryTag.insertBefore(gpa_class_h5Element, primaryTag.children[gpaInsertLocation+1]);
            primaryTag.insertBefore(gpa_table_topic, primaryTag.children[gpaInsertLocation+2]);
            primaryTag.insertBefore(gpa_table, primaryTag.children[gpaInsertLocation+3]);
            gpah5Element.className = primaryTag.children[gpaInsertLocation].className
            gpa_class_h5Element.className = primaryTag.children[gpaInsertLocation].className
        } else {
            console.error("The div doesn't have enough children.");
        }
    } else {
        alert(`GPA : ${GPA}`);
    }
    
    for(i = 0; i < tables.length; i++){
        tables[i].className = "table table-dark table-hover table-bordered"
        rows = tables[i].querySelectorAll('tr')
        rows.forEach((row) => {
            row = new Row(row)
            if (row.credit === 'credits'){
                th = row.th
                var checkboxCell = document.createElement('th');
                checkboxCell.className = th.className
                checkboxCell.textContent = 'Included in GPA'
                row.row.appendChild(checkboxCell);
            }else{
                var checkboxDiv = document.createElement('div')
                checkboxDiv.className = "form-check form-switch"
                td = row.td
                var checkboxCell = document.createElement('td');
                checkboxCell.className = td.className
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.addEventListener('change', function () {
                    calculate_gpa(tables)
                });
                checkbox.className = "form-check-input bg-danger border-danger"
                checkboxDiv.appendChild(checkbox)
                checkboxCell.appendChild(checkboxDiv);
                row.row.appendChild(checkboxCell);
        
            }
        });
    }
    
}


const get_tables = () => {
    return Array.from(document.getElementsByTagName("table"))
}


const check_if_correct_page = () =>{
    tables = get_tables()
    if (tables.length > 0){
        modify_page(tables)
        calculate_gpa(tables)
    }
}


check_if_correct_page()