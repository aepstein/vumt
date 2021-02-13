import React, { useState, useCallback, useRef } from 'react'
import {
    FormGroup,
    Label
} from 'reactstrap'
import {
    AsyncTypeahead,
    Highlighter
} from 'react-bootstrap-typeahead'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const districtToSelection = (district) => {
    return { id: district._id, label: district.name }
}
const districtsToSelections = (districts) => {
    return districts.map(districtToSelection)
}
const selectionToDistrict = (selection) => {
    return { _id: selection.id, name: selection.label }
}
const selectionsToDistricts = (selections) => {
    return selections.map(selectionToDistrict)
}

export default function DistrictsSelect({districts,setDistricts}) {
    const { t } = useTranslation('advisory')
    const districtsRef = useRef()
    const [ districtOptions, setDistrictOptions ] = useState([])
    const [ districtsLoading, setDistrictsLoading ] = useState(false)
    const districtSearch = useCallback((q) => {
        setDistrictsLoading(true)
        axios
            .get('/api/districts',{params: {q}})
            .then((res) => {
                setDistrictOptions(districtsToSelections(res.data.data))
                setDistrictsLoading(false)
            })
    },[setDistrictsLoading,setDistrictOptions])
    const initDistrictSearch = useCallback(() => {
        if (districtOptions.length > 0) return
        districtSearch()
    },[districtOptions,districtSearch])
    const renderDistricts = (option, props, index) => {
        return [
            <Highlighter key="label" search={props.text}>
                {option.label}
            </Highlighter>
        ]
    }

    return <FormGroup>
        <Label for="districts">{t('districts')}</Label>
        <AsyncTypeahead
            id="districts"
            name="districts"
            multiple
            selected={districtsToSelections(districts)}
            placeholder={t('districtsPlaceholder')}
            options={districtOptions}
            isLoading={districtsLoading}
            onSearch={districtSearch}
            onChange={(selected) => setDistricts(selectionsToDistricts(selected))}
            onFocus={initDistrictSearch}
            renderMenuItemChildren={renderDistricts}
            ref={districtsRef}
            delay={200}
            minLength={0}
            clearButton={true}
        />
    </FormGroup>
}