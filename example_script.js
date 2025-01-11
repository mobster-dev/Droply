function teste(key, label, selectedValues){
    console.log(key, label, selectedValues)
}

document.addEventListener('DOMContentLoaded' , function(){

    // Posso passar como lista, onde os valores serao gerados automaticamente a partir do 0
    //const tipo = ["car", "Motocycle", "Truck", "Bus"] 

    // Posso passar como objeto, onde os valores sao previamente definidos
    const type = {
        "0": "Car",
        "1": "Motocycle",
        "2": "Truck",
        "3": "Bus",
    }
    
    const brand = {
        "0": ["Toyota", ["0"]],
        "1": ["Honda", ["0", "1"] ],
        "2": ["Ford", ["0", "2"] ],
        "3": ["Chevrolet", ["0", "2"] ],
        "4": ["BMW", ["0"] ],
    }
    
    const automobile = {
        "0": { label: "Corolla", tipo: ["0"], marca: ["0"]}, 
        "1": { label: "Civic", tipo: ["0"], marca: ["1"]},
        "2": { label: "F-4000", tipo: ["2"],  marca: ["2"]},
        "3": { label: "Silverado 2500HD", tipo: ["2"], marca: ["3"]},
        "4": { label: "X5", tipo: ["0"], marca: ["4"]},
        "5": { label: "Biz", tipo: ["1"], marca: ["1"]}, 
    }

    const droply = new Droply()
    droply.CreateDropdown('Type', type, undefined, teste)
    droply.CreateDropdown('Brand', brand)
    droply.CreateDropdown('Equipment', automobile)

})

