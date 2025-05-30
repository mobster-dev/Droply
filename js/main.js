class Droply {
    constructor() {
        this.filters = {}
        this.zIndex = 1
    }

    async callbackFunction(objectOptions, args = []) {
        
        if (Array.isArray(objectOptions)){
            let tempObject = objectOptions
            objectOptions = {}
            tempObject.forEach((item, index) => {
                objectOptions[index] = item
            })
        }
        
        return Object.keys(objectOptions).reduce((acc, key) => {
            let option = objectOptions[key]
            
            if (typeof objectOptions[key] === 'string'){
                option = { label: objectOptions[key] }
            }else if (Array.isArray(objectOptions[key])){
                option = {}
                objectOptions[key].forEach((item, index) => {
                    if (index === 0) {
                        option['label'] = item
                    }else {
                        option[`key_${index}`] = item
                    }
                    
                })
            }
            let shouldInclude = true
            
            if (Object.keys(option).length > 1) {
                
                args.forEach((values, index) => {
                    const campo = Object.keys(option)[index+1]
                    if (option[campo] && !values.some(val => option[campo].includes(val))) {
                        shouldInclude = false
                    }
                })
                
                if (shouldInclude) {               
                    acc[key] = option[Object.keys(option)[0]]
                }
                return acc
            } else {
                
                args.forEach((values, index) => {
                    const campo = Object.keys(option)[0]
                    if (option[campo] && !values.some(val => option[campo].includes(objectOptions[val]))) {
                        shouldInclude = false
                        
                    }
                })
                
                if (shouldInclude) {               
                    acc[key] = option[Object.keys(option)[0]]
                }
                return acc
            }
        }, {})
    }

    /**
     * Creates a dropdown with single or multiple selection, supporting filter dependencies.
     * @param {Object} droplyObject - Configuration object.
     * @param {string} droplyObject.elementId - The ID of the element (div or select) where the dropdown will be created.
     * @param {string[] | Object<string, string> | Object<string, [string, string[]]> | Object<string, {label: string, level1?: string[], levelN?: string[]}>} [droplyObject.objectOptions] -
     *     Dropdown options. Supported formats:
     *     - Array of strings: e.g. ["Car", "Motorcycle"]
     *     - Object of key:label pairs: e.g. { "0": "Car", "1": "Motorcycle" }
     *     - Object of key:object with label and optional filter keys: e.g. { "0": { label: "Corolla", type: ["0"], brand: ["2"] } }
     *     - Object of key:array: e.g. { "0": ["Corolla", ["0"], ["2"]] }
     * @param {string[] | Array<string[]>} [droplyObject.filteredOptions] -
     *     Optional filter values. Use array of strings for single filter, or array of arrays for multiple filters.
     * @param {function} [droplyObject.OnItemClickCallback] -
     *     Optional callback called when an item is clicked: (key, label, selectedValues) => void
     * @returns {Promise<any>} Resolves when the dropdown is created.
     */
    async CreateDropdown(droplyObject) {
        
        if (droplyObject === undefined){
            console.error("Droply: The parameter 'droplyObject' is required.")
            return
        }else if (droplyObject.elementId === undefined){
            console.error("Droply: The parameters 'elementId' not defined in the 'droplyObject'.")
            return
        }

        let divId = droplyObject.elementId
        let objectOptions = droplyObject.objectOptions || undefined
        let filteredOptions = droplyObject.filteredOptions || []
        let OnItemClickCallback = droplyObject.OnItemClickCallback || null

        let dropdown = document.getElementById(divId)

        if (dropdown === null) {
            console.error(`Droply: The element with ID '${divId}' does not exist.`)
            return
        }

        if (dropdown.tagName === 'SELECT'){
            const wrapper = document.createElement('div');
            [...dropdown.attributes].forEach(attr => {
                wrapper.setAttribute(attr.name, attr.value)
            })
            dropdown.style.display = 'none'
            dropdown.parentNode.insertBefore(wrapper, dropdown.nextSibling)

            if ((objectOptions === undefined || Object.keys(objectOptions).length === 0)) {
                if (dropdown.options.length > 0) {
                    objectOptions = {}
                    Array.from(dropdown.options).forEach((opt, index) => {
                        let optAttributes = opt.attributes
                        let optObject = {}
                        for (let i = 0; i < optAttributes.length; i++) {
                            optObject['label'] = opt.textContent
                            if (optAttributes[i].name.startsWith('data-droply')) {
                                optObject[optAttributes[i].name] = optAttributes[i].value.split(',').map(item => item.trim())
                            }
                        }
                        objectOptions[opt.value] = optObject
                    })
                }else {
                    console.error("Droply: The parameter 'objectOptions' is required when the dropdown is a select element and no options are defined.")
                    return
                }
            }else {
                dropdown.innerHTML = ''
                for (const [key, value] of Object.entries(objectOptions)) {
                    const option = document.createElement('option')
                    option.value = key
                    option.textContent = value instanceof Array ? value[0] : value instanceof Object ? value.label : value
                    dropdown.appendChild(option)
                }
            }
            
            dropdown = wrapper
            
        }

        let placeholder = dropdown.dataset.droplyPlaceholder || divId
        let child = dropdown.dataset.droplyChild?.split(',').map(item => item.trim()) || null

        let isMultiselect = dropdown.attributes.multiple ? true : false

        dropdown.id = 'dropdown-' + divId
        dropdown.style.display = 'block'
        dropdown.style.margin = '3px'
        dropdown.style.borderRadius = '5px'

        const dropdownButton = document.createElement('div')
        dropdownButton.className = 'dropdown-button'
        dropdownButton.id = 'dropdown-button-' + divId
        dropdownButton.innerHTML = `<div style="display:flex; justify-content: space-between; align-items: center;"> 
                                        <span>${placeholder}</span> 
                                        <div style="display: flex;align-items: center;"> 
                                            <span class="dropdown-selected-values">0</span>
                                            <span class="dropdown-arrow">v</span> 
                                        </div>
                                    </div>`

        dropdown.appendChild(dropdownButton)

        const container = document.createElement('div')
        container.className = 'container'
        container.id = 'container-' + divId

        const searchContainer = document.createElement('div')
        searchContainer.className = 'search-container'
        searchContainer.id = 'search-container-' + divId

        const selectAllButton = document.createElement('div')
        selectAllButton.className = 'select-all'
        selectAllButton.id = 'select-all-' + divId
        selectAllButton.textContent = 'All'

        const searchInput = document.createElement('input')
        searchInput.id = 'dropdown-search-' + divId
        searchInput.className = 'dropdown-search'
        searchInput.type = 'text'
        searchInput.placeholder = '🔎 Search'

        searchContainer.appendChild(selectAllButton)
        searchContainer.appendChild(searchInput)

        container.appendChild(searchContainer)

        const dropdownMenu = document.createElement('div')
        dropdownMenu.className = 'dropdown-menu'
        dropdownMenu.id = 'dropdown-menu-' + divId

        container.appendChild(dropdownMenu)

        dropdown.appendChild(container)

        searchInput.addEventListener("input", () => {
            this.renderItems(divId, dropdown, searchInput.value)
        })

        dropdownButton.addEventListener("click", (event) => {
            event.stopPropagation()
            container.classList.toggle("show")
            container.style.zIndex = ++this.zIndex
            container.style.width = dropdownButton.offsetWidth + 'px'
        })

        const toggleSelectAll = () => {
            const visibleItems = Array.from(dropdownMenu.getElementsByClassName("dropdown-item"))

            if (this.filters[divId].selectedValues.length === Object.keys(this.filters[divId].options).length) {
                visibleItems.forEach((item) => {
                    const key = item.getAttribute("data-key")
                    this.filters[divId].selectedValues = this.filters[divId].selectedValues.filter((value) => value !== key)
                    item.classList.remove("selected")
                })

                selectAllButton.classList.remove("selected")

            } else {
                this.filters[divId].selectedValues = visibleItems.map((item) => item.getAttribute("data-key"))
                visibleItems.forEach((item) => {
                    item.classList.add("selected")
                })

                selectAllButton.classList.add("selected")
            }

            this.updateChild(this.filters[divId])
            dropdownButton.innerHTML = `<div style="display:flex; justify-content: space-between; align-items: center;"> 
                                          <span>${placeholder}</span> 
                                            <div>  
                                                <span class="dropdown-selected-values">${this.filters[divId].selectedValues.length}</span>
                                                <span class="dropdown-arrow">v</span>
                                            </div>
                                        </div>`
            this.setOptionsOnSelect(divId, true)
        }

        selectAllButton.addEventListener("click", toggleSelectAll)

        document.addEventListener("click", (event) => {
            if (event.target.offsetParent && !event.target.offsetParent.classList.contains('container')) {
                container.classList.remove("show")
            }else if (!event.target.offsetParent) {
                container.classList.remove("show")
            }
        })
        
        if (!filteredOptions.every(element => Array.isArray(element))) {
            filteredOptions = [filteredOptions]
        }
        

        const options = await this.callbackFunction(objectOptions, filteredOptions)
        const keys = Object.keys(options)

        let selectedValues = isMultiselect ? keys : keys.length > 0 ? [keys[0]] : []

        dropdownButton.innerHTML = `<div style="display:flex; justify-content: space-between; align-items: center;"> 
                                        <span>${placeholder}</span> 
                                        <div> 
                                            <span class="dropdown-selected-values">${selectedValues.length}</span>
                                            <span class="dropdown-arrow">v</span> 
                                        </div>
                                    </div>`

        this.filters[divId] = { placeholder, options, objectOptions, isMultiselect, selectedValues, child, OnItemClickCallback}

        this.renderItems(divId, dropdown)

        const filters_keys = Object.keys(this.filters)
        filters_keys.forEach(key => {
            if(this.filters[key].child && this.filters[key].child.includes(divId)){
                this.updateChild(this.filters[key])
            }
            
        })

        this.setOptionsOnSelect(divId)

        return divId
    }

    renderItems(divId, dropdown, searchkeys = "") {
        const dropdownMenu = dropdown.querySelector(".dropdown-menu")
        const selectAllButton = dropdown.querySelector(".select-all")
        const dropdownButton = dropdown.querySelector(".dropdown-button")

        Array.from(dropdownMenu.querySelectorAll(".dropdown-item")).forEach((item) =>
            item.remove()
        )

        if (!this.filters[divId].isMultiselect) {
            selectAllButton.style.display = 'none'
        }

        const sortedOptions = Object.entries(this.filters[divId].options).sort((a, b) => {
            const labelA = a[1].toLowerCase()
            const labelB = b[1].toLowerCase()

            if (labelA < labelB) return -1
            if (labelA > labelB) return 1
            return 0
        })

        if (this.filters[divId].selectedValues.length >= sortedOptions.length && this.filters[divId].selectedValues.length != 0) {
            selectAllButton.classList.add("selected")
        } else {
            selectAllButton.classList.remove("selected")
        }

        dropdownButton.innerHTML = `<div style="display:flex; justify-content: space-between; align-items: center;"> 
                                        <span>${this.filters[divId].placeholder}</span> 
                                        <div> 
                                            <span class="dropdown-selected-values">${this.filters[divId].selectedValues.length}</span>
                                            <span class="dropdown-arrow">v</span> 
                                        </div>
                                    </div>`

        for (const [key, label] of Object.entries(this.filters[divId].options)) {
            if (label.toLowerCase().includes(searchkeys.toLowerCase())) {
                const item = document.createElement("div")
                item.classList.add("dropdown-item")
                item.textContent = label
                item.setAttribute("data-key", key)

                if (this.filters[divId].selectedValues.includes(key)) {
                    item.classList.add("selected")
                }

                item.addEventListener("click", (event) => {
                    event.stopPropagation()
                    if (this.filters[divId].isMultiselect) {
                        if (this.filters[divId].selectedValues.includes(key)) {
                            this.filters[divId].selectedValues = this.filters[divId].selectedValues.filter((v) =>v!== key)
                            item.classList.remove("selected")
                        } else {
                            this.filters[divId].selectedValues.push(key)
                            item.classList.add("selected")
                        }
                    } else {
                        this.filters[divId].selectedValues = [key]
                        Array.from(dropdownMenu.children).forEach((child) =>
                            child.classList.remove("selected")
                        )
                        item.classList.add("selected")
                    }

                    if (this.filters[divId].selectedValues.length >= sortedOptions.length) {
                        selectAllButton.classList.add("selected")
                    } else {
                        selectAllButton.classList.remove("selected")
                    }

                    dropdownButton.innerHTML = `<div style="display:flex; justify-content: space-between; align-items: center;"> 
                                                    <span>${this.filters[divId].placeholder}</span> 
                                                    <div> 
                                                        <span class="dropdown-selected-values">${this.filters[divId].selectedValues.length}</span>
                                                        <span class="dropdown-arrow">v</span> 
                                                    </div>
                                                </div>`

                    this.updateChild(this.filters[divId])

                    if (this.filters[divId].OnItemClickCallback) {
                        this.filters[divId].OnItemClickCallback(key, label, this.filters[divId].selectedValues)
                    }

                    this.setOptionsOnSelect(divId, true)
                })

                dropdownMenu.appendChild(item)
            }
        }

        this.updateChild(this.filters[divId])
    }

    async updateChild(filter) {
        
        if (filter.child && this.filters[filter.child[0]]) {
        
            for (let i = 0; i < filter.child.length; i++) {
                const child = filter.child[i]

                const childParents = Object.fromEntries(
                    Object.entries(this.filters).filter(([key, value]) => Array.isArray(value.child) && value.child.includes(child))
                )
                const childParentsValues = Object.entries(childParents).map(([key, value]) => value.selectedValues)

                this.filters[child].options = await this.callbackFunction(this.filters[child].objectOptions, childParentsValues)
                this.filters[child].selectedValues = this.filters[child].isMultiselect ? Object.keys(this.filters[child].options) : Object.keys(this.filters[child].options).length > 0 ? [Object.keys(this.filters[child].options)[0]] : []
                const dropdown = document.getElementById('dropdown-' + child)
                this.renderItems(child, dropdown)
            }
        }
    }

    getNamedValues(divId) {
        const selectedValues = this.filters[divId]?.selectedValues || []
        const options = this.filters[divId].options
        const filteredNames = Object.entries(options)
            .filter(([id]) => selectedValues.includes(id))
            .map(([, name]) => name)
        return filteredNames
    }

    getValues(divId) {
        const selectedValues = this.filters[divId]?.selectedValues || []
        return selectedValues
    }

    getCountedItens(divId) {
        return this.filters[divId]?.selectedValues.length || 0
    }

    setOptionsOnSelect(divId, onClickEvent = false) {
        const selectElement = document.getElementById(divId)
        if (selectElement && selectElement.tagName === 'SELECT') {
            const options = Array.from(selectElement.options)
            if (this.filters[divId].isMultiselect) {
                options.forEach(opt => {
                    opt.selected = this.filters[divId].selectedValues.includes(opt.value)
                })
            } else {
                selectElement.value = this.filters[divId].selectedValues[0] || ''
            }
        }
        if (onClickEvent) {
            selectElement.dispatchEvent(new Event('change'))
        }
    }
}
