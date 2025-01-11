function teste(key, label, selectedValues){
    console.log(key, label, selectedValues)
}

document.addEventListener('DOMContentLoaded' , function(){

    // Posso passar como lista, onde os valores serao gerados automaticamente a partir do 0
    //const tipo = ["Carro", "Moto", "Caminhão", "Ônibus"] 

    // Posso passar como objeto, onde os valores sao previamente definidos
    const tipo = {
        "0": "Carro",
        "1": "Moto",
        "2": "Caminhão",
        "3": "Ônibus",
    }
    
    const marca = {
        "0": ["Toyota", ["0"]],
        "1": ["Honda", ["0", "1"] ],
        "2": ["Ford", ["0", "2"] ],
        "3": ["Chevrolet", ["0", "2"] ],
        "4": ["BMW", ["0"] ],
    }
    
    const automovel = {
        "0": { label: "Corolla", tipo: ["0"], marca: ["0"]}, 
        "1": { label: "Civic", tipo: ["0"], marca: ["1"]},
        "2": { label: "Ranger", tipo: ["2"],  marca: ["2"]},
        "3": { label: "S10", tipo: ["2"], marca: ["3"]},
        "4": { label: "X5", tipo: ["0"], marca: ["4"]},
        "5": { label: "Biz", tipo: ["1"], marca: ["1"]}, 
    }

    const droply = new Droply()
    droply.CreateDropdown('TipoEquipamentos', tipo, undefined, teste)
    droply.CreateDropdown('Frotas', marca)
    droply.CreateDropdown('Equipamentos', automovel)
    
    document.getElementById('teste').addEventListener('click', () => {
        console.log(droply.getNamedValues('Equipamentos'))
    })

})

