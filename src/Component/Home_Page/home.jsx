import React from 'react'
import './home.css'
import search from '../../assets/search.png'
import Modi from '../../assets/ModiMoney.png'

function Home () {
    return (
        <>
        <div className="home">
            
            <div className="homeImg">
                <img src={Modi} alt="Modi Sarkar" style={{position:'absolute' }} />
            </div>
            

            <div className="searchBar" >
                <input className='searching'
                type='text' placeholder='Search for products, services, or blog posts'></input>

                <button className='searchIcon'>
                    <img src={search} alt="search" />
                </button>
            </div>


            <div className="homeHello">
                <h1>Turn data into revolutionary financial products</h1>

                <p>Connect to real-time insights on the Plaid Network to create fast, safe, and smart financial experiences.</p>

                <div className="homeButton">
                    <button className="homeButton1">Talk to our Team</button>
                    <button className="homeButton2">Start Building</button>
                </div>
            </div>

            
        </div>
        </>
    )
}

export default Home;
