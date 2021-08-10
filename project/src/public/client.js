const store = Immutable.Map({
    user: { name: '', lastName: '' },
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    curiosity: '',
    opportunity: '',
    spirit: '',
})

const buttonNameOk = document.querySelector('#btnOk');
const buttonNameCancel = document.querySelector('#btnCancel');


buttonNameOk.addEventListener('click', () => {
    getFormData()
    removeForm()
    render(root, store)
})


buttonNameCancel.addEventListener('click', () => {
    removeForm()
    render(root, store)
})

const getFormData = function() {
    const form = document.querySelector('#nameInput');
    const elements = Array.from(form.elements)
    const values = elements.map(data => data.value)

    const newStore = store.setIn(['user', 'name'], values[0])
    const newStore1 = newStore.setIn(['user', 'lastName'], values[1])
    console.log(newStore1.toJS())
    updateStore(store, newStore1);

}


function removeForm() {
    const element = document.querySelector('#form-input');
    const form = document.querySelector('#nameInput');
    element.removeChild(form);
}


// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    const newStore = store.merge(store, newState);
    store = Object.assign(store, newStore)
    console.log('Store: ', store.toJS())
}

const render = async(root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {

    const roverName = state.get('rovers')

    return `
        <header></header>
        <main>
            ${Greeting(state.getIn(['user', 'name']), state.getIn(['user', 'lastName']))}
            
            <section>
            
            ${roverName.map((data) => ImagesFromRover(data, state))}

            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    getRoversInfoApi(store)
        /* render(root, store) */


})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name, lastName) => {
    if (name && lastName) {
        return `
            <h2>Welcome, ${name} ${lastName}!</h2>
        `
    } else if (name) {
        `
            <h2>Welcome, ${name} ${lastName}!</h2>
        `
    } else {
        return `
    <h2>Hello!</h2>
`
    }

}

const ImagesFromRover = (roverInfo, state) => {

    console.log('ImagesFromRover', roverInfo, state.toJS())

    const roverNameLowerCase = roverInfo.toLowerCase()
    let selectRover

    switch (roverNameLowerCase) {
        case 'curiosity':
            selectRover = state.get('curiosity')
            console.log('select Rover: ', selectRover)
            break;

        case 'opportunity':
            selectRover = state.get('opportunity')
            console.log('select Rover: ', selectRover)
            break;

        case 'spirit':
            selectRover = state.get('spirit')
            console.log('select Rover: ', selectRover)
            break;

        default:
            break;
    }

    const photoArraySize = selectRover.roverInfo.latest_photos.length
    const randomPhotoArrayPosition = Math.floor(photoArraySize * Math.random())
    const randomPhoto = selectRover.roverInfo.latest_photos[randomPhotoArrayPosition].img_src
    const roverLandingDate = selectRover.roverInfo.latest_photos[randomPhotoArrayPosition].rover.landing_date
    const roverLaunchDate = selectRover.roverInfo.latest_photos[randomPhotoArrayPosition].rover.launch_date
    const roverStatus = selectRover.roverInfo.latest_photos[randomPhotoArrayPosition].rover.status.toUpperCase()
    const roverName = roverInfo.toUpperCase()

    return `
                    <h3>${roverName}</h3>
                    <img src="${randomPhoto}" height="350px"  />
                    <p>Landing Date: ${roverLandingDate}</p>
                    <p>Launch Date: ${roverLaunchDate}</p>
                    <p>Rover Stauts: ${roverStatus}</p>
               `
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