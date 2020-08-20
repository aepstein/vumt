import {useState, useEffect} from 'react'
import tz from 'timezone/loaded'

export default function useZonedDateTime(dt,setDt) {
    const [ timezone, setTimezone ] = useState('America/New_York')
    const [ date, setDate ] = useState('')
    useEffect(() => {
        if (!dt) return
        setDate(tz(dt,timezone,'%Y-%m-%d'))
    },[dt,timezone,setDate])
    const [ time, setTime ] = useState('')
    useEffect(() => {
        if (!dt) return
        setTime(tz(dt,timezone,'%H:%M'))
    },[dt,timezone,setTime])
    useEffect(() => {
        if (date && time) {
            setDt(new Date(tz(`${date} ${time}`,timezone)))
        }
        else {
            setDt('')
        }
    },[date,time,timezone,setDt])
    return [timezone,setTimezone,date,setDate,time,setTime]
}