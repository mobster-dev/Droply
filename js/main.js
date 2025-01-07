class Droply {
    constructor() {
        this.filters = {}
        this.zIndex = 1
    }

    async callbackFunction(objectOptions, args = []) {
        return Object.keys(objectOptions).reduce((acc, key) => {
            let option = objectOptions[key]
            
            if (typeof objectOptions[key] === 'string'){
                option = { label: objectOptions[key] }
            }else if (Array.isArray(objectOptions[key])){
                option = {};
                objectOptions[key].forEach((item, index) => {
                    option[`key_${index}`] = item
                })
            }

            console.log(" ")
            console.log("Convertidoo")
            console.log(option)
            
            let shouldInclude = true
    
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
        }, {})
    }

    async CreateDropdown(divId, objectOptions) {

        const dropdown = document.getElementById(divId)

        let placeholder = dropdown.dataset.droplyPlaceholder
        let get_options_func = dropdown.dataset.droplyGetOptionsCallback
        let child = dropdown.dataset.droplyChild?.split(',').map(item => item.trim()) || null

        let isMultiselect = dropdown.dataset.droplyMultiselect ? dropdown.dataset.droplyMultiselect === "true" : true

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
        }

        selectAllButton.addEventListener("click", toggleSelectAll)

        document.addEventListener("click", (event) => {
            if (event.target.offsetParent && !event.target.offsetParent.classList.contains('container')) {
                container.classList.remove("show")
            }else if (!event.target.offsetParent) {
                container.classList.remove("show")
            }
        })

        const options = await this.callbackFunction(objectOptions)
        const keys = Object.keys(options)

        let selectedValues = isMultiselect ? keys : keys.length > 0 ? [keys[0]] : []

        dropdownButton.innerHTML = `<div style="display:flex; justify-content: space-between; align-items: center;"> 
                                        <span>${placeholder}</span> 
                                        <div> 
                                            <span class="dropdown-selected-values">${selectedValues.length}</span>
                                            <span class="dropdown-arrow">v</span> 
                                        </div>
                                    </div>`

        this.filters[divId] = { placeholder, options, objectOptions, isMultiselect, selectedValues, child }

        this.renderItems(divId, dropdown)

        const filters_keys = Object.keys(this.filters)
        filters_keys.forEach(key => {
            if(this.filters[key].child && this.filters[key].child.includes(divId)){
                this.updateChild(this.filters[key])
            }
            
        })

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
            selectAllButton.remove()
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
                this.filters[child].selectedValues = Object.keys(this.filters[child].options)
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
}
