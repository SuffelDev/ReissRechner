function openTab(index){
    for(let i = 0;i<4;i++){
        document.getElementById(("tab"+i)).className = "hidden"
        document.getElementById("button"+i).className = "unselectedTab"
    }
    document.getElementById("tab"+index).className = "shown"
    document.getElementById("button"+index).className = "selectedTab"
}