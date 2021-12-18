import React, { useState } from 'react'
import '../css/style.less'

export const App = () => {

    const [side, setSide] = useState(null)

    console.log('side clicked :', side)

    return (
        <main className='app-container'>
            <aside><p onClick={() => setSide('left')}>left</p></aside>
            <aside><p onClick={() => setSide('right')}>right</p></aside>
        </main>
    )
}