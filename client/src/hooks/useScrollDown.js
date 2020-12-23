import { useEffect } from 'react'

// Call onScrollDown when user scrolls to bottom of screen
export default function useScrollDown(onScrollDown) {
    useEffect(() => {
        const onMore = () => {
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                onScrollDown()
            }
        }
        window.addEventListener("scroll",onMore)
        return () => {
            window.removeEventListener("scroll",onMore)
        }
    },[onScrollDown])
}