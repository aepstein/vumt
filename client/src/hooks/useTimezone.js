import {useState} from 'react'

export default function useTimezone(timezone) {
    return useState(timezone ? timezone : 'America/New_York')
}