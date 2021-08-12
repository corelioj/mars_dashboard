// Initial variables

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

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    getRoversInfoApi(store)
})


buttonNameOk.addEventListener('click', () => {
    getFormData()
    removeForm()
    render(root, store)
})

const getFormData = function() {
    const form = document.querySelector('#nameInput');
    const elements = Array.from(form.elements)
    const values = elements.map(data => data.value)

    const newStore = store.setIn(['user', 'name'], values[0])
    const newStore1 = newStore.setIn(['user', 'lastName'], values[1])

    updateStore(store, newStore1);

}


const removeForm = () => {
    const main = document.querySelector('main');
    const form = document.querySelector('#form-input');
    main.removeChild(form);
}


const updateStore = (store, newState) => {
    const newStore = store.merge(store, newState);
    store = Object.assign(store, newStore)
}

const render = async(root, state) => {
    root.innerHTML = App(state)
    listenRoversBtn()
}

const listenRoversBtn = () => {
    const btnCuriosity = document.querySelector('#btnCuriosity');
    const btnOpportunity = document.querySelector('#btnOpportunity');
    const btnSpirit = document.querySelector('#btnSpirit');

    btnCuriosity.addEventListener("click", () => {
        const hoverInfosContainer = document.querySelector('#hoverInfosContainer')
        hoverInfosContainer.innerHTML = generateHoverInfos('Curiosity', store)
        return false;
    });

    btnOpportunity.addEventListener("click", () => {
        const hoverInfosContainer = document.querySelector('#hoverInfosContainer')
        hoverInfosContainer.innerHTML = generateHoverInfos('Opportunity', store)
        return false;
    });

    btnSpirit.addEventListener("click", () => {
        const hoverInfosContainer = document.querySelector('#hoverInfosContainer')
        hoverInfosContainer.innerHTML = generateHoverInfos('Spirit', store)
        return false;
    });
}

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

const generateHoverInfos = (hoverName, state) => {

    const roverNameLowerCase = hoverName.toLowerCase()

    const selectRover = selectRoverSwitch(roverNameLowerCase, state)


    const roverLandingDate = selectRover.roverInfo.latest_photos[0].rover.landing_date
    const roverLaunchDate = selectRover.roverInfo.latest_photos[0].rover.launch_date
    const roverStatus = selectRover.roverInfo.latest_photos[0].rover.status.toUpperCase()


    const photoArray = selectRover.roverInfo.latest_photos
    const photoArraySize = photoArray.length
    const maxArraySize = 10
    let finalPhotoArray = []


    if (photoArraySize <= maxArraySize) {
        finalPhotoArray = photoArray.map((currentValue) => {
            return currentValue.img_src
        })
    } else {

        const randomMaxArraySize = new Array(maxArraySize).fill(1);

        finalPhotoArray = randomMaxArraySize.map((currentValue) => {
            const randomPhotoArrayPosition = Math.floor(photoArraySize * Math.random())
            const finalRandomArray = selectRover.roverInfo.latest_photos[randomPhotoArrayPosition].img_src
                /* finalPhotoArray[index] = teste2 */

            return finalRandomArray
        })
    }


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

// create initial content
const App = (state) => {

    const userName = state.getIn(['user', 'name'])
    const userLastName = state.getIn(['user', 'lastName'])

    return `
    
            ${Greeting(userName, userLastName)}
            
            ${createHoverSelect()}

        <footer></footer>
    `
}

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

const createReloadButton = () => {
    const header = document.querySelector('header');
    const btn = document.createElement('button');
    btn.innerHTML = 'Let\'s do it again!';
    btn.addEventListener("click", () => {
        location.reload();
        return false;
    });
    header.appendChild(btn).classList.add('btnReload');
}

// ------------------------------------------------------  COMPONENTS


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

// ------------------------------------------------------  API CALLS

// Example API call
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