
 function addToList(){
  let participants = getCurrentList()
  participants.list.push([document.getElementById("nameInput").value,getFormData()])
  localStorage.setItem(getListName(),JSON.stringify(participants))
  getCurrentList()
 }

 function getFormData(){
    let array = []
    for(let i = 1;i<=16;i++){
        array.push(document.getElementById("input"+i).value)
    }
    return array
 }

 function getCurrentList(){ //if the list does not exist, creates it. If it exists, return it as String
    let list = localStorage.getItem(getListName())

    if(list==null){ //list does not exist yet
        localStorage.setItem(getListName(),'{"list":[]}')
        let headers = getShowcase().children[0]
        getShowcase().innerHTML = ""
        document.getElementById("listStatusLabel").innerHTML = "list created"
        getShowcase().appendChild(headers)
        
    }else{
        let data = JSON.parse(list)
       let headers = getShowcase().children[0]
       document.getElementById("listStatusLabel").innerHTML = ""
       getShowcase().innerHTML = ""

       getShowcase().appendChild(headers)
       
        document.getElementById("firstPerson").innerHTML = ""
            for(let i = 0;i<data.list.length;i++){
            let row = document.createElement("tr")
            let name = document.createElement("td")
            name.innerHTML = data.list[i][0]
            row.appendChild(name)
            for(let j = 0;j<data.list[i][1].length;j++){
                let tableData = document.createElement("td")
                tableData.innerHTML = data.list[i][1][j]
                row.appendChild(tableData)
            }
            getShowcase().append(row)
            let option = document.createElement("option")
            option.innerHTML = data.list[i][0]
            option.value = data.list[i][0]
            document.getElementById("firstPerson").append(option)
            
        }
        document.getElementById("secondPerson").innerHTML =  document.getElementById("firstPerson").innerHTML
        return data
    }
    
 }
 function getListName(){
    let ln = document.getElementById("listname")
    return ln.value
 }
 function getShowcase(){
    return document.getElementById("listShowcase")
 }
 function removeItem(){
    let participants = getCurrentList()
    for(let i  = 0;i<participants.list.length;i++){

        if(participants.list[i][0]==document.getElementById("deleteName").value){
            participants.list.splice(i,1)
            i--
        }
    }
    localStorage.setItem(getListName(),JSON.stringify(participants))
    getCurrentList()
 }

 function deleteList(){
    localStorage.removeItem(getListName())
    let headers = getShowcase().children[0]
    document.getElementById("listStatusLabel").innerHTML = "list deleted"
    getShowcase().innerHTML = ""
    getShowcase().appendChild(headers)
    document.getElementById("listname").value = ""
    
 }

 function compareIndividuals(){
    let personA = document.getElementById("firstPerson").value
    let personB = document.getElementById("secondPerson").value
    let arrayA = getDataByName(personA)
    let arrayB = getDataByName(personB)
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if(arrayA==undefined||arrayB==undefined){
        document.getElementById("percentageResultLabel").innerHTML = "Error"
    }
    let difference = 0
    ctx.beginPath()
    ctx.moveTo(0,canvas.height/2)
    ctx.lineWidth = 4
    ctx.strokeStyle = '#2b4cb7'
    ctx.fillStyle = 'gray'
    for(let i = 0;i<arrayA.length;i++){
        ctx.fillRect(canvas.width/(arrayA.length)*i-1,0,2,canvas.height)
        let individualGap = Math.abs(arrayA[i]-arrayB[i]) //absolute of the difference between both value
        
        difference += individualGap   
        if(i==0){
            ctx.moveTo(canvas.width/(arrayA.length)*i,canvas.height/2*individualGap)
        }else{
            ctx.lineTo(canvas.width/(arrayA.length)*i,canvas.height/2*individualGap)
        }
        
        ctx.stroke()
        if(document.getElementById("showIndividualData").checked){
            ctx.fillStyle = "#a42452"
            ctx.fillRect(canvas.width/(arrayA.length)*i-8,(canvas.height/2)-arrayA[i]*canvas.height/2-8,16,16)
            ctx.fillStyle = "#22a08b"
            ctx.fillRect(canvas.width/(arrayA.length)*i-5,(canvas.height/2)-arrayB[i]*canvas.height/2-5,10,10)
            ctx.fillStyle = 'gray'
        }
        
    }
    // 100% / no difference would be 0, 0% / no matches would be 32
    document.getElementById("percentageResultLabel").innerHTML = (1.0-(difference/32))*100+"%"
 }

 function getDataByName(name){
    let list = localStorage.getItem(getListName())
    list = JSON.parse(list).list
    for(let i = 0;i<list.length;i++){
        if(list[i][0]==name){
            return list[i][1]
        }
    }
 }

 function getListLength(){
    let list = localStorage.getItem(getListName())
    list = JSON.parse(list).list
    return list.length
 }

 function displayMotivationPercent(){
   let list = localStorage.getItem(getListName())
   list = JSON.parse(list).list 
   let motivationTotal = []
   for(let i = 0;i<16;i++){
    motivationTotal.push(0)
   }
   for(let i = 0;i<list.length;i++){ //loop through ever object of name and result array
    let motivations = list[i][1]
    for(let j = 0;j<motivations.length;j++){
        motivationTotal[j] = motivationTotal[j]+parseFloat(motivations[j])
    }
   }
   //loop through all labels
   for(let i = 0;i<16;i++){
        document.getElementById("motivationPercent"+(i+1)).innerHTML = motivationTotal[i]/getListLength()
   }
   document.getElementById("averageCompatibilityList").innerHTML = ""
   let header = document.createElement("h2")
   header.innerHTML = "Durchschnittliche Abweichung"
   document.getElementById("averageCompatibilityList").appendChild(header)
   for(let i = 0;i<list.length;i++){
    let nameTitle = document.createElement("h3")
    nameTitle.className = "bigFormElement"
    nameTitle.innerHTML =  list[i][0]
    document.getElementById("averageCompatibilityList").appendChild(nameTitle)
    let differenceFromAverage = 0
    for(let j = 0;j<list[i][1].length;j++){
        console.log(list[i][1][j])
        console.log(motivationTotal[j]/getListLength())
        differenceFromAverage += Math.abs(list[i][1][j]-(motivationTotal[j]/getListLength()))
    }
    let difference = document.createElement("label")
    difference.className = "bigFormElement"
    difference.innerHTML = differenceFromAverage/16
    document.getElementById("averageCompatibilityList").appendChild(difference)
   }

 }
 function allCombinations(){
    let list = localStorage.getItem(getListName())
    list = JSON.parse(list).list
    let results = []
    for(let i = 0;i<list.length;i++){ //loop through every individual
        for(let j = i+1;j<list.length;j++){ //every combination
            let firstPersonMotivations = list[i][1]
            let secondPersonMotivations = list[j][1]
            let difference = 0
            for(let k = 0;k<firstPersonMotivations.length;k++){
                let individualGap = Math.abs(firstPersonMotivations[k]-secondPersonMotivations[k]) //absolute of the difference between both value
                difference += individualGap
            }
            let compatibility = (1.0-(difference/32))*100
            results.push([list[i][0],list[j][0],compatibility])
        }
    }
    results.sort(function(a,b){
        return b[2]-a[2]
    })
    document.getElementById("compatibilityList").innerHTML = ""
    for(let i = 0;results.length;i++){
        let node = document.createElement("li")
        node.className = "bigListElement"
        node.innerHTML = results[i][0]+" - "+results[i][1]+": "+results[i][2]+"%"
        document.getElementById("compatibilityList").appendChild(node)
    }
 }

