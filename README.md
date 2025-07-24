# Droply 🎯

Uma biblioteca JavaScript moderna e elegante para criação de dropdowns customizáveis com recursos avançados de filtragem, temas e seleção múltipla.

## ✨ Características

- **🎨 Múltiplos Temas**: 6 temas pré-definidos (Glass Dark/Light, Modern Dark/Light, Galaxy, Default)
- **🔍 Busca Integrada**: Sistema de busca em tempo real nos itens
- **🔗 Filtros Dependentes**: Suporte a dropdowns hierárquicos com dependências entre filtros
- **📱 Responsivo**: Interface adaptável para diferentes tamanhos de tela
- **⚡ Performance**: Renderização otimizada e gerenciamento eficiente de estado
- **🛠️ Flexível**: Funciona com elementos `<div>` e `<select>` existentes
- **🎯 Callbacks**: Sistema de callbacks para eventos de seleção

## 🚀 Instalação

### Via CDN (Recomendado)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mobster-dev/Droply@v1.1.0/css/style.css">
<script src="https://cdn.jsdelivr.net/gh/mobster-dev/Droply@v1.1.0/js/main.js"></script>
```

### Download Local
1. Baixe os arquivos `css/style.css` e `js/main.js`
2. Inclua em seu projeto:
```html
<link rel="stylesheet" href="css/style.css">
<script src="js/main.js"></script>
```

## 📖 Uso Básico

### HTML
```html
<div id="meuDropdown" class="theme-modern-dark" data-droply-placeholder="Selecione uma opção"></div>
```

### JavaScript
```javascript
const droply = new Droply();

const opcoes = {
    "1": "Opção 1",
    "2": "Opção 2", 
    "3": "Opção 3"
};

droply.CreateDropdown({
    elementId: 'meuDropdown',
    objectOptions: opcoes
});
```

## 🎨 Temas Disponíveis

| Tema | Classe CSS | Descrição |
|------|------------|-----------|
| **Modern Light** | `theme-modern-light` | Tema claro moderno com gradiente sutil |
| **Modern Dark** | `theme-modern-dark` | Tema escuro moderno com gradiente |
| **Glass Light** | `theme-glass-light` | Efeito vidro claro com blur |
| **Glass Dark** | `theme-glass-dark` | Efeito vidro escuro com blur |
| **Galaxy** | `theme-galaxy` | Tema espacial com cores vibrantes |
| **Default** | _(sem classe)_ | Tema padrão limpo |

### Modificadores de Contexto
- `theme-on-light`: Para usar em fundos claros
- `theme-on-dark`: Para usar em fundos escuros

## 📋 Formatos de Dados Suportados

### 1. Array Simples
```javascript
const opcoes = ["Carro", "Motocicleta", "Caminhão"];
```

### 2. Objeto Chave-Valor
```javascript
const opcoes = {
    "0": "Toyota",
    "1": "Honda", 
    "2": "Ford"
};
```

### 3. Array com Dependências
```javascript
const marcas = {
    "0": ["Toyota", ["0"]], // [label, [tipos_permitidos]]
    "1": ["Honda", ["0", "1"]]
};
```

### 4. Objeto Complexo
```javascript
const veiculos = {
    "0": { 
        label: "Corolla", 
        tipo: ["0"], 
        marca: ["0"] 
    }
};
```

## 🔗 Filtros Dependentes

```javascript
const tipos = {
    "0": "Carro",
    "1": "Motocicleta"
};

const marcas = {
    "0": ["Toyota", ["0"]],      // Só aparece para carros
    "1": ["Honda", ["0", "1"]]   // Aparece para carros e motos
};

// Dropdown pai
droply.CreateDropdown({
    elementId: 'tipos',
    objectOptions: tipos
});

// Dropdown filho
droply.CreateDropdown({
    elementId: 'marcas',
    objectOptions: marcas
});
```

## 🛠️ API Completa

### CreateDropdown(config)

```javascript
droply.CreateDropdown({
    elementId: 'meuDropdown',           // ID do elemento (obrigatório)
    objectOptions: opcoes,              // Opções do dropdown
    filteredOptions: ['valor1'],        // Filtros iniciais
    OnItemClickCallback: function(key, label, selectedValues) {
        console.log('Selecionado:', key, label, selectedValues);
    }
});
```

### Métodos Úteis

```javascript
// Obter valores selecionados
const valores = droply.getValues('meuDropdown');

// Obter labels dos itens selecionados  
const nomes = droply.getNamedValues('meuDropdown');

// Obter quantidade de itens selecionados
const quantidade = droply.getCountedItens('meuDropdown');
```

## 🎯 Atributos HTML

| Atributo | Descrição | Exemplo |
|----------|-----------|---------|
| `data-droply-placeholder` | Texto do placeholder | `"Selecione uma opção"` |
| `data-droply-child` | IDs dos dropdowns filhos | `"dropdown1,dropdown2"` |
| `multiple` | Habilita seleção múltipla | `multiple` |
| `data-droply-level1` | Filtro de primeiro nível | `"0,1,2"` |

## 💡 Exemplos Avançados

### Dropdown com Tema Personalizado
```html
<style>
.meu-tema-customizado {
    --droply-background: linear-gradient(135deg, #ff6b6b, #ffd93d);
    --droply-foreground: #fff;
    --droply-selected-color: rgba(255,255,255,0.3);
}
</style>

<div id="customDropdown" class="meu-tema-customizado"></div>
```

### Integração com Select Existente
```html
<select id="selectExistente" multiple>
    <option value="1" data-droply-level1="0">Opção 1</option>
    <option value="2" data-droply-level1="1">Opção 2</option>
</select>

<script>
// Droply converte automaticamente o select
droply.CreateDropdown({ elementId: 'selectExistente' });
</script>
```

### Sistema de Callbacks
```javascript
droply.CreateDropdown({
    elementId: 'dropdown',
    objectOptions: opcoes,
    OnItemClickCallback: function(key, label, selectedValues) {
        // Atualizar interface
        document.getElementById('resultado').textContent = 
            `Selecionado: ${label} (${selectedValues.length} itens)`;
        
        // Enviar para servidor
        fetch('/api/filtrar', {
            method: 'POST',
            body: JSON.stringify({ filtros: selectedValues })
        });
    }
});
```

## 🎮 Demo Interativa

Confira o arquivo `example.html` para ver todos os recursos em ação, incluindo:
- Diferentes temas aplicados
- Filtros dependentes em ação
- Seleção múltipla vs. única
- Integração com elementos `<select>`

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔧 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
---

Feito por [mobster-dev](https://github.com/mobster-dev) 
