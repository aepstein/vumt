import {useState,useCallback} from 'react'
import tz from 'timezone/loaded'

/* Splits a zoned date time into date and time elements for user front-end
 * After invocation, changes must be made via returned modifyDate/modifyTime functions
 * until the component is destroyed
 */
export default function useZonedDateTime(timezone,dt,setDt) {
    const [ date, setDate ] = useState(dt ? tz(dt,timezone,'%Y-%m-%d') : '' )
    const [ time, setTime ] = useState(dt ? tz(dt,timezone,'%H:%M') : '')

    const modifyDate = useCallback((newDate) => {
        if (date !== newDate) {
            setDate(newDate)
            if (newDate && time) setDt(new Date(tz(`${newDate} ${time}`,timezone)))
        }
    },[time,date,setDate,timezone,setDt])
    const modifyTime = useCallback((newTime) => {
        if (time !== newTime) {
            setTime(newTime)
            if (date && newTime) setDt(new Date(tz(`${date} ${newTime}`,timezone)))
        }
    },[time,date,setTime,timezone,setDt])

    return [date,modifyDate,time,modifyTime]
}