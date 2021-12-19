import React, { useState, useEffect } from 'react'
import '../css/style.less'

import { setLocalStorageItem, getLocalStorageItem, removeLocalStorageItem } from './utils/localStorage'

export const App = () => {

    const [feedingSide, setFeedingSide] = useState(null)
    const [feedingTime, setFeedingTime] = useState(null)
    const [feedingIntervalId, setFeedingIntervalId] = useState(null)
    const [feedingTimer, setFeedingTimer] = useState("")

    const [pooTime, setPooTime] = useState(null)
    const [pooIntervalId, setPooIntervalId] = useState(null)
    const [pooTimer, setPooTimer] = useState("")

    useEffect(() => {
        const lastFeedingTime = getLocalStorageItem('lastFeedingDate')
        const lastFeedingSide = JSON.parse(getLocalStorageItem('lastFeedingSide'))
        const lastPooTime = getLocalStorageItem('lastPooTime')

        if (lastFeedingTime) setFeedingTime(lastFeedingTime)
        if (lastFeedingSide) setFeedingSide(lastFeedingSide)
        if (lastPooTime) setPooTime(lastPooTime)

    }, [])

    useEffect(() => {
        if (feedingTime) {
            clearInterval(feedingIntervalId)
            setFeedingIntervalId(setInterval(() => calculTime(setFeedingTimer, feedingTime), 1000))
        }
    }, [feedingSide, feedingTime])

    useEffect(() => {
        if (pooTime) {
            clearInterval(pooIntervalId)
            setPooIntervalId(setInterval(() => calculTime(setPooTimer, pooTime), 1000))
        }
    }, [pooTime])

    function calculTime(timer, time) {
        const currentDate = Date.now()
        const elapsedTime = new Date(currentDate - time)

        const hours = elapsedTime.getUTCHours()
        const minutes = elapsedTime.getUTCMinutes()

        timer(`${hours}h:${minutes}m`);
    }

    function handleSideClicked(side) {
        //Set history to rollup
        setLocalStorageItem(JSON.parse(feedingTime), 'previousLastFeedingDate')
        setLocalStorageItem(feedingSide, 'previousLastFeedingSide')

        setLocalStorageItem(Date.now(), 'lastFeedingDate')
        setLocalStorageItem(side, 'lastFeedingSide')

        setFeedingTime(Date.now())
        setFeedingSide(side)
    }

    function handlePooClicked() {
        setLocalStorageItem(Date.now(), 'lastPooTime')
        setPooTime(Date.now())
    }

    function retrieveLastFeeding() {
        const lastFeedingTime = getLocalStorageItem('previousLastFeedingDate')
        const lastFeedingSide = JSON.parse(getLocalStorageItem('previousLastFeedingSide'))

        if (lastFeedingTime && lastFeedingSide) {

            setLocalStorageItem(JSON.parse(lastFeedingTime), 'lastFeedingDate')
            setLocalStorageItem(lastFeedingSide, 'lastFeedingSide')

            setFeedingTime(lastFeedingTime)
            setFeedingSide(lastFeedingSide)

            removeLocalStorageItem('previousLastFeedingDate')
            removeLocalStorageItem('previousLastFeedingSide')
        }
    }

    return (
        <main className='app-container'>
            <header>
                <p>Last feeding : <strong>{feedingSide}</strong></p>
                <time>🤱 {feedingTimer}</time>
                <button onClick={retrieveLastFeeding}>↩️ oops</button>
            </header>
            <aside><p onClick={() => handleSideClicked('left')}>left</p></aside>
            <aside><p onClick={() => handleSideClicked('right')}>right</p></aside>
            <footer onClick={handlePooClicked}>
                <time>💩 {pooTimer}</time>
                <p>Click here to declare a <strong>poo</strong></p>
            </footer>
        </main>
    )
}