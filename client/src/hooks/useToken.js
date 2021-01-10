import { useSelector } from 'react-redux'
import prepareTokenConfig from '../lib/prepareTokenConfig'

export default function useToken() {
    const token = useSelector(state => state.auth.token)
    return prepareTokenConfig(token)
}