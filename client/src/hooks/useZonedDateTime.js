import {useState, useEffect} from 'react'
import tz from 'timezone/loaded'

export default function useZonedDateTime(timezone,dt,setDt) {
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
    return [date,setDate,time,setTime]
}