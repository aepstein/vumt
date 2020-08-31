import React from 'react';
import { useHistory } from 'react-router-dom'
import {
    Button,
    ButtonGroup,
    Container,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import { deleteDistrict } from '../../actions/districtActions';

export default function DistrictsList({districts}) {
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation('district')

    const onDeleteClick = (id) => {
        dispatch(deleteDistrict(id))
    }

    return <div>
        <Container>
            <Link to="/districts/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addDistrict')}</Button>
            </Link>
            <ListGroup className="districts-list">
                {districts.map(({ _id, name }) => (
                    <ListGroupItem key={_id}>
                        <ButtonGroup>
                            <Button
                                color="info"
                                size="sm"
                                onClick={() => history.push('/districts/' + _id)}
                            >{t('commonForms:detail')}</Button>
                            <Button
                                color="warn"
                                size="sm"
                                onClick={() => history.push('/districts/' + _id + '/edit')}
                            >{t('commonForms:edit')}</Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => onDeleteClick(_id)}
                            >{t('commonForms:remove')}</Button>
                        </ButtonGroup>
                        <span className="district-name">{name}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Container>
    </div>
}
