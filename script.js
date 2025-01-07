function getSysListaTiposAutomoveis(args=[]) {
    let id = args.length > 0 ? args[0] : []
    const registros = {
        "0": "Carro",
        "1": "Moto",
        "2": "Caminhão",
        "3": "Ônibus",
    };

    if (id.length > 0) {
        return Object.keys(registros).reduce((acc, key) => {
            if (id.includes(key)) {
                acc[key] = registros[key];
            }
            return acc;
        }, {});
    }

    return registros;
}

function getSysListaMarcas(args=[]) {
    let tipoId = args.length > 0 ? args[0] : []
    const registros = {
        "0": { name: "Toyota", tipo: ["0"] }, // Associado a Carro
        "1": { name: "Honda", tipo: ["0", "1"] }, // Associado a Carro e Moto
        "2": { name: "Ford", tipo: ["0", "2"] }, // Associado a Carro e Caminhão
        "3": { name: "Chevrolet", tipo: ["0", "2"] }, // Associado a Carro e Caminhão
        "4": { name: "BMW", tipo: ["0"] }, // Associado a Carro
    };

    if (tipoId.length > 0) {
        return Object.keys(registros).reduce((acc, key) => {
            const registro = registros[key];
            if (tipoId.some(id => registro.tipo.includes(id))) {
                acc[key] = registro.name;
            }
            return acc;
        }, {});
    }

    return Object.fromEntries(Object.entries(registros).map(([key, value]) => [key, value.name]));
}

function getSysListaModelos(args=[]) {
    let tipoId = args.length > 0 ? args[0] : []
    let marcaId = args.length > 1 ? args[1] : []
    const registros = {
        "0": { name: "Corolla", marca: ["0"], tipo: ["0"] }, 
        "1": { name: "Civic", marca: ["1"], tipo: ["0"] },
        "2": { name: "Ranger", marca: ["2"], tipo: ["2"] },
        "3": { name: "S10", marca: ["3"], tipo: ["2"] },
        "4": { name: "X5", marca: ["4"], tipo: ["0"] },
        "4": { name: "XJ", marca: ["1"], tipo: ["1"] }, 
    };

    if (marcaId.length > 0 && tipoId.length > 0) {
        return Object.keys(registros).reduce((acc, key) => {
            const registro = registros[key];
            // Verifica se o modelo está associado aos IDs de marca e tipo
            if (
                marcaId.some(id => registro.marca.includes(id)) &&
                tipoId.some(id => registro.tipo.includes(id))
            ) {
                acc[key] = registro.name;
            }
            return acc;
        }, {});
    }

    return Object.fromEntries(Object.entries(registros).map(([key, value]) => [key, value.name]));
}

function TESTE(droply) {
    console.log(droply.getValues('Equipamentos'))
}

window.getSysListaTiposAutomoveis = getSysListaTiposAutomoveis
window.getSysListaMarcas = getSysListaMarcas
window.getSysListaModelos = getSysListaModelos

document.addEventListener('DOMContentLoaded' , function(){
    
    const droply = new Droply();
    droply.CreateDropdown('TipoEquipamentos')
    droply.CreateDropdown('Frotas')
    droply.CreateDropdown('Equipamentos')

    document.getElementById('teste').addEventListener('click', () => {
        TESTE(droply)
    })

})

