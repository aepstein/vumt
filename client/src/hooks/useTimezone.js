import {useState} from 'react'

export default function useTimezone() {
    return useState('America/New_York')
}