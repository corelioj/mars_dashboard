// Initial variables ----------------------------------------------------------------------
const store = Immutable.Map({
    user: { name: '', lastName: '' },
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    curiosity: '',
    opportunity: '',
    spirit: '',
})

const root = document.getElementById('root')
const buttonNameOk = document.querySelector('#btnOk');
const buttonNameCancel = document.querySelector('#btnCancel');

// listening for load event because page should load before any JS is called -------------
window.addEventListener('load', () => {
    getRoversInfoApi(store)
})

// Listener function to detect click on OK button after user fulfill the form ---------------
buttonNameOk.addEventListener('click', () => {
    getFormData()
    removeForm()
    render(root, store)
})

// function to get the data inserted by the user in form ------------------------------------
const getFormData = function() {
    const form = document.querySelector('#nameInput');
    const elements = Array.from(form.elements)
    const values = elements.map(data => data.value)

    const newStore = store.setIn(['user', 'name'], values[0])
    const newStore1 = newStore.setIn(['user', 'lastName'], values[1])

    updateStore(store, newStore1);

}

// function to remove the form from the screen -----------------------------------------------
const removeForm = () => {
    const main = document.querySelector('main');
    const form = document.querySelector('#form-input');
    main.removeChild(form);
}

// function to update the store data ---------------------------------------------------------
const updateStore = (store, newState) => {
    const newStore = store.merge(store, newState);
    store = Object.assign(store, newStore)
}

// function to render the code in the screen -------------------------------------------------
const render = async(root, state) => {
    root.innerHTML = App(state, Greeting, createHoverSelect)
    listenRoversBtn()
}

// Listening function to detect each hover selection button click ----------------------------
const listenRoversBtn = () => {
    const btnCuriosity = document.querySelector('#btnCuriosity');
    const btnOpportunity = document.querySelector('#btnOpportunity');
    const btnSpirit = document.querySelector('#btnSpirit');

    btnCuriosity.addEventListener("click", () => {
        const hoverInfosContainer = document.querySelector('#hoverInfosContainer')
        hoverInfosContainer.innerHTML = generateHoverInfos('Curiosity', store, GenerateFinalPhotoArray)
        return false;
    });

    btnOpportunity.addEventListener("click", () => {
        const hoverInfosContainer = document.querySelector('#hoverInfosContainer')
        hoverInfosContainer.innerHTML = generateHoverInfos('Opportunity', store, GenerateFinalPhotoArray)
        return false;
    });

    btnSpirit.addEventListener("click", () => {
        const hoverInfosContainer = document.querySelector('#hoverInfosContainer')
        hoverInfosContainer.innerHTML = generateHoverInfos('Spirit', store, GenerateFinalPhotoArray)
        return false;
    });
}

// function to select the name of each hover and pass this information for getting data in the store variable ---
const selectRoverSwitch = (roverNameLowerCase, state) => {
    switch (roverNameLowerCase) {
        case 'curiosity':
            return state.get('curiosity')

        case 'opportunity':
            return state.get('opportunity')

        case 'spirit':
            return state.get('spirit')

        default:
            break;
    }
}

//function to generate the array with the latest images URLs from hover selected ----------------
const GenerateFinalPhotoArray = (selectRover) => {

    const photoArray = selectRover.roverInfo.latest_photos
    const photoArraySize = photoArray.length
    const maxArraySize = 10
    let finalPhotos = []


    if (photoArraySize <= maxArraySize) {
        finalPhotos = photoArray.map((currentValue) => {
            return currentValue.img_src
        })
    } else {

        const randomMaxArraySize = new Array(maxArraySize).fill(1);

        finalPhotos = randomMaxArraySize.map((currentValue) => {
            const randomPhotoArrayPosition = Math.floor(photoArraySize * Math.random())
            const finalRandomArray = selectRover.roverInfo.latest_photos[randomPhotoArrayPosition].img_src

            return finalRandomArray
        })
    }

    return finalPhotos
}

// function to get the string and put to lowercase. (I did it to use in HOF)----------------------
const toLowerCase = (data) => {
    return data.toLowerCase()
}

// function to generate the Hovers infos calling the functions to make the Hover card and images carousel ----
const generateHoverInfos = (hoverName, state, callback) => {


    const roverNameLowerCase = toLowerCase(hoverName)



    // Higher-Order Function selectRover receive the function roverNameLowerCase() as argument
    const selectRover = selectRoverSwitch(toLowerCase(hoverName), state)

    const finalPhotoArray = callback(selectRover)

    const roverLandingDate = selectRover.roverInfo.latest_photos[0].rover.landing_date
    const roverLaunchDate = selectRover.roverInfo.latest_photos[0].rover.launch_date
    const roverStatus = selectRover.roverInfo.latest_photos[0].rover.status.toUpperCase()

    return `
            <div id="hoverCardContainer" class="container">
                <div class="card mx-auto" style="width: 18rem;">
                    <img src="/assets/pictures/${roverNameLowerCase}.jpg" class="card-img-top" alt="${roverNameLowerCase}.jpg">
                    <div class="card-body">
                        <h5 class="card-title">${hoverName}</h5>
                        <p class="card-text">Launch Date: ${roverLaunchDate}</p>
                        <p class="card-text">Landing Date: ${roverLandingDate}</p>
                        <p class="card-text">Rover Stauts: ${roverStatus}</p>
                    </div>
                </div>
            </div>
            <div id="hoverCarouselContainer" class="container">
                ${generateCarouselImages(finalPhotoArray)}
            </div>
            `
}

// function to generate the images carousel of each rover selected ---------------------
const generateCarouselImages = (PhotoArray) => {

    const carouselItem = PhotoArray.map((currentValue, index) => {
        if (index === 0) {
            return `
                    <div class="carousel-item active">
                        <img src="${currentValue}" class="d-block w-100" alt="...">
                    </div>
                    `
        } else {
            return `
                    <div class="carousel-item">
                        <img src="${currentValue}" class="d-block w-100" alt="...">
                    </div>
                    `
        }
    })

    return `
            <div id="carouselControls" class="carousel slide m-5" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${carouselItem}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button"                 data-bs-target="#carouselControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            `
}

// creates initial content----------------------------------------------------------
const App = (state, callbackGreeting, callbackcreateHoverSelect) => {

    const userName = state.getIn(['user', 'name'])
    const userLastName = state.getIn(['user', 'lastName'])

    return `
            ${callbackGreeting(userName, userLastName)}
            ${callbackcreateHoverSelect()}
        <footer></footer>
    `
}


// Creates the Hover select Buttons on screen--------------------------------------
const createHoverSelect = () => {

    return `
                    <section>
                        <div class="container">
                            <div class="row my-3">
                                <button type="button" id="btnCuriosity" class="btn btn-light btn-lg">Curiosity</button>
                            </div>
                            <div class="row my-3">
                                <button type="button" id="btnOpportunity" class="btn btn-light btn-lg btn-block">Opportunity</button>
                            </div>
                            <div class="row my-3">
                                <button type="button" id="btnSpirit" class="btn btn-light btn-lg btn-block">Spirit</button>
                            </div>
                        </div>
                    </section>
                    <section id="hoverInfosContainer" class="my-3"></section>
                    `

}

// Generates the greeting message from the name iserted by the user-------------------
const Greeting = (name, lastName) => {

    if (name || lastName) {
        return `
            <h2>Welcome, ${name} ${lastName}!</h2>
            <h3 class="my-3">Select a Hover to view some latest images from it!</h3>

        `
    } else {
        return `
    <h2>Hello!</h2>
    <h3 class="my-3">Select a Hover to view some latest images from it!</h3>
`
    }

}



// API call function ---------------------------------------------------------------
const getRoversInfoApi = async(store) => {

    //pull the API for all 3 rovers and store in it's respective value in store
    const roversArray = store.get('rovers')
    await roversArray.map(async(rover) => {
        try {
            const res = await fetch(`http://localhost:3000/roversInfo/${rover}`)
            const data = await res.json()
            const newStore = store.set(rover.toLowerCase(), data)
            updateStore(store, newStore);
        } catch (error) {
            console.error(error)
        }

    })
}