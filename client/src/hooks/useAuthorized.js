import { useCallback } from 'react'
import { useSelector } from 'react-redux'

/* Returns function which determines whether user is authorized based on certain tests specified in params
 * @params roles: array of global roles authorized to perform an action
 *         user: user authorized to perform the action (e.g. owner of the object of the action)
 */
export default function useAuthorized() {
    const userId = useSelector(state => state.auth.user._id)
    const global = useSelector(state => state.auth.user.roles)
    const authorized = useCallback((params) => {
        const {roles,user} = params
        if (roles && roles.filter((r) => global.includes(r)).length > 0 ) {
            return true
        }
        if (user && (user === userId || user._id === userId)) {
            return true
        }
        return false
    },[userId,global])
    return authorized
}