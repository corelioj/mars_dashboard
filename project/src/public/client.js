const store = Immutable.Map({
    user: Immutable.Map({ name: 'John', lastName: 'Doe' }),
    apod: '',
    roversInfo: [],
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    const newStore = store.set('apod', newState)

    render(root, newStore)

}

const render = async(root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {

    const apodData = state.get('apod')
    const roversInfoData = state.get('roversInfo')

    console.log(state.toJS())
    console.log(apodData)
    console.log(roversInfoData)

    return `
        <header></header>
        <main>
            ${Greeting(state.getIn(['user', 'name']), state.getIn(['user', 'lastName']))}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                
                
            </section>
            <section>
            <h3>Hovers</h3>
            ${ImagesFromRover(roversInfoData)}

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
    if (name) {
        return `
            <h1>Welcome, ${name} ${lastName}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
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

const ImagesFromRover = (roversInfo) => {

    // If image does not already exist, or it is not from today -- request it again


    const teste = getImageOfRovers(roversInfo)
    console.log(teste)
        /* const photoArraySize = roversInfo.roversInfo.imagesRover.latest_photos.length
        const randomPhotoArrayPosition = Math.floor(photoArraySize * Math.random())
        const randomPhoto = roversInfo.roversInfo.imagesRover.latest_photos[randomPhotoArrayPosition].img_src
        const roverLandingDate = roversInfo.roversInfo.imagesRover.latest_photos[randomPhotoArrayPosition].rover.landing_date
        const roverLaunchDate = roversInfo.roversInfo.imagesRover.latest_photos[randomPhotoArrayPosition].rover.launch_date
        const roverStatus = roversInfo.roversInfo.imagesRover.latest_photos[randomPhotoArrayPosition].rover.status.toUpperCase() */





    return 0
        /* (`
                   <img src="${randomPhoto}" height="350px"  />
                   <p>Landing Date: ${roverLandingDate}</p>
                   <p>Launch Date: ${roverLaunchDate}</p>
                   <p>Rover Stauts: ${roverStatus}</p>
               `) */

}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {

    const data = fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then((apod) => updateStore(store, apod))

    return data
}

const getImageOfRovers = (state) => {


    const data = fetch(`http://localhost:3000/roversInfo/curiosity`)
        .then(res => res.json())
        .then(roversInfo => updateStore(store, roversInfo))

    return data
}