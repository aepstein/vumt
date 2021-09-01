import { useHistory, useRouteMatch } from 'react-router-dom'

export default function useNavigateToPeer(current) {
    const { path } = useRouteMatch()
    const history = useHistory()

    return (peer) => {
        history.push(path.replace(new RegExp(`^(.+)\\/${current}$`),`$1/${peer}`))
    }
}
