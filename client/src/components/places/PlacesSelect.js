import React, { useState, useCallback, useEffect } from 'react'
import {
    FormFeedback,
    FormGroup,
    Input,
    Label
} from 'reactstrap'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'

const placeToChoice = (place) => {
    return { ...place, id: place._id, label: place.name }
}
const placeToChoices = (place) => {
    if (place) { return [placeToChoice(place)] }
    return []
}
const placesToChoices = (places) => places.map(placeToChoice)
const choiceToPlace = (choice) => {
    return {...choice, _id: choice.id, name: choice.label }
}
const choicesToPlaces = (choices) => choices.map(choiceToPlace)
const choicesToPlace = (choices) => choices.length > 0 ? choiceToPlace(choices[0]) : null

export default function PlacesSelect({multiple,label,name,places,setPlaces,placeholder,onSearch,render,errors}) {
    const [ placeOptions, setPlaceOptions ] = useState([])
    const [ query, setQuery ] = useState(-1)
    const [ loadedQuery, setLoadedQuery ] = useState(-1)
    const [ loadedOptions, setLoadedOptions ] = useState([])
    const [ loading, setLoading ] = useState(false)

    const loadPlaces = useCallback(async(q) => {
        setQuery(q)
        setLoading(true)
        setLoadedOptions(placesToChoices(await onSearch(q)))
        setLoadedQuery(q)
    },[setQuery,setLoadedOptions,setLoadedQuery,onSearch])
    useEffect(() => {
        if (query !== loadedQuery) return
        setPlaceOptions(loadedOptions)
        setLoading(false)
    },[query,loadedQuery,setPlaceOptions,loadedOptions])
    const getPlaces = useCallback(() => {
        if (multiple) {
            return placesToChoices(places)
        }
        else {
            return placeToChoices(places)
        }
    },[multiple,places])
    const doSetPlaces = useCallback((choices) => {
        if (multiple) {
            setPlaces(choicesToPlaces(choices))
        }
        else {
            setPlaces(choicesToPlace(choices))
        }
    },[multiple,setPlaces])
    console.log(errors)

    return <FormGroup>
        <Label for={name}>{label}</Label>
        <AsyncTypeahead 
            id={name}
            name={name}
            multiple={multiple}
            selected={getPlaces()}
            placeholder={placeholder}
            options={placeOptions}
            isLoading={loading}
            onSearch={loadPlaces}
            onChange={doSetPlaces}
            onFocus={() => loadPlaces('')}
            renderMenuItemChildren={render}
            delay={200}
            minLength={0}
            isInvalid={errors ? true : false}
            clearButton={true}
        />
        {errors && errors.message ?
            [<Input type="hidden" invalid />,<FormFeedback>{errors.message}</FormFeedback>] : '' }
   </FormGroup>
}