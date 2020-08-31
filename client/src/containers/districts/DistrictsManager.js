import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getDistricts, saveDistrict } from '../../actions/districtActions';
import { Spinner } from 'reactstrap'
import DistrictsList from '../../components/districts/DistrictsList'
import DistrictDetail from '../../components/districts/DistrictDetail'
import DistrictEditor from '../../components/districts/DistrictEditor'

const BLANK_DISTRICT = {
    name: ''
}

export default function DistrictsManager({action}) {
    const { defaultAction, districtId } = useParams()
    const districts = useSelector(state => state.district.districts, shallowEqual)
    const loading = useSelector(state => state.district.districtsLoading)
    const loaded = useSelector(state => state.district.districtsLoaded)
    const saving = useSelector(state => state.district.districtSaving)

    const [district,setDistrict] = useState(BLANK_DISTRICT)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onSave = (newProps) => {
        if (saving) return
        dispatch(saveDistrict(newProps,history))
    }
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getDistricts())
        }
    },[loading,loaded,dispatch])

    useEffect(() => {
        if (district && district._id === districtId) return
        if (districtId && loaded) {
            const loadedDistrict = districts.filter(v => v._id === districtId)[0]
            // TODO -- how to handle a district that does not match loaded districts?
            if (!loadedDistrict) return
            setDistrict(loadedDistrict)
        }
        else {
            setDistrict(BLANK_DISTRICT)
        }
    },[district,districtId,loaded,districts])

    if (loading) return <Spinner color="secondary" />

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <DistrictEditor district={district} onSave={onSave} saving={saving} action={action} />
        case 'show':
            return <DistrictDetail district={district} />
        default:
            return <DistrictsList districts={districts} />
    }
}
