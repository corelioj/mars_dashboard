const store = Immutable.Map({
    user: Immutable.Map({ name: 'John', lastName: 'Doe' }),
    //apod: '',
    roversInfo: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    const newStore = store.set('roversInfo', newState)

    render(root, newStore)

}

const render = async(root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {

    const roversInfoData = state.get('roversInfo')
    const roverName = state.get('rovers').toArray()
    const roversInfoArray = []

    roverName.map((name) => {
        const object = {}
        object.name = name
        object.info = roversInfoData
        roversInfoArray.push(object)
    })


    console.log(state.toJS())

    return `
        <header></header>
        <main>
            ${Greeting(state.getIn(['user', 'name']), state.getIn(['user', 'lastName']))}
            
            <section>
            
            ${roversInfoArray.map((data) => ImagesFromRover(data))}

            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name, lastName) => {
    if (name && lastName) {
        return `
            <h1>Welcome, ${name} ${lastName}!</h1>
        `
    } else if (name) {
        `
            <h1>Welcome, ${name} ${lastName}!</h1>
        `
    } else {
        return `
    <h1>Hello!</h1>
`
    }

}

// Example of a pure function that renders infomation requested from the backend
/* const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    let photoDate = 0
    if (apod) {
        photoDate = new Date(apod.apod.date)
    }

    if (!apod || apod.apod.date === today.getDate()) {
        getImageOfTheDay(store)
    }

    if (apod) {
        // check if the photo of the day is actually type video!
        if (apod.media_type === "video") {

            return (`
            <p>See today's featured video <a href="${apod.apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
        } else {

            return (`
            <img src="${apod.apod.url}" height="350px"  />
            <p>${apod.apod.explanation}</p>
        `)
        }
    }

} */

const ImagesFromRover = (roverInfo) => {

    // If image does not already exist, or it is not from today -- request it again
    let photoArraySize = null
    let randomPhotoArrayPosition = null
    let randomPhoto = null
    let roverLandingDate = null
    let roverLaunchDate = null
    let roverStatus = null
    let roverName = null

    console.log('Rover info: ', roverInfo)


    if (!roverInfo.info) {
        getImageOfRovers(roverInfo)
    } else {
        photoArraySize = roverInfo.info.imagesRover.latest_photos.length
        randomPhotoArrayPosition = Math.floor(photoArraySize * Math.random())
        randomPhoto = roverInfo.info.imagesRover.latest_photos[randomPhotoArrayPosition].img_src
        roverLandingDate = roverInfo.info.imagesRover.latest_photos[randomPhotoArrayPosition].rover.landing_date
        roverLaunchDate = roverInfo.info.imagesRover.latest_photos[randomPhotoArrayPosition].rover.launch_date
        roverStatus = roverInfo.info.imagesRover.latest_photos[randomPhotoArrayPosition].rover.status.toUpperCase()
        roverName = roverInfo.name.toUpperCase()
    }

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
/* const getImageOfTheDay = (state) => {

    const data = fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then((apod) => updateStore(store, apod))

    return data
} */

const getImageOfRovers = (state) => {
    console.log('getImage name: ', state.name)

    const data = fetch(`http://localhost:3000/roversInfo/${state.name}`)
        .then(res => res.json())
        .then(roversInfo => updateStore(store, roversInfo))

    return data
}