import React from 'react';
import { Link } from 'react-router-dom';


export default function Inicio() {
    return (
        <div>
            <Link to='/home'>
                Empecemos
            </Link>
        </div>
    )
}