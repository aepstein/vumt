const { ObjectId } = require('mongoose').Types
// Using the pipeline, get the cursor record
const getCursor = async ({model,pipeline,_id}) => {
    const condition = [
        {$match:{_id: ObjectId(_id)}},
        ...pipeline
    ]
    return model.aggregate(condition)
}
// Get the match condition to filter from cursor in pipeline context
const getCursorCondition = ({cursor,pipeline}) => {
    const { $sort } = pipeline.find(c => c.$sort)
    const sort = Object.entries($sort) // e.g. [[name, 1], [_id, 1]]
    return {$match: {$or: sort.reduce((conditions,[field,order],i,sort) => {
        const criteria = {}
        sort.slice(0,i).forEach(([field]) => {
            criteria[field] = cursor[field]
        })
        criteria[field] = order > 0 ? {$gt: cursor[field]} : {$lt: cursor[field]}
        return conditions.concat([criteria])
    },[])}}
}
// Add match condition to pipeline at start or after $geoNear
const addCursorCondition = async({model,pipeline,_id}) => {
    const cursor = (await getCursor({model,pipeline,_id}))[0]
    const cursorCondition = getCursorCondition({cursor,pipeline})
    const i = pipeline.findIndex(condition => condition.$geoNear)
    pipeline.splice(i < 0 ? 0 : i +1,0,cursorCondition)
    return pipeline
}
module.exports = async ({req,res,model,criteria={},select={},pipeline=null}) => {
    const limit = 10
    const q = req.query
    const qs = Object.entries(q).length > 0 ? '?' +
        Object.entries(q)
        .map(([field,value]) => `${field}=${value}`)
        .join('&') :
        ''
    if ( req.params.afterId ) { criteria._id = { $gt: req.params.afterId } }
    if (pipeline) {
        if (req.params.afterId ) { pipeline = await addCursorCondition({model,pipeline,_id: req.params.afterId}) }
        pipeline.push({$limit: limit + 1})
    }
    const data = pipeline ? 
        await model
        .aggregate(pipeline) :
        await model
        .find(criteria)
        .select(select)
        .limit(limit + 1)
    const pageLink = (req,cursor) => {
        return req.baseUrl + "/after/" + cursor + qs
    }
    const next = data[limit] ? data[limit-1]._id : null
    return res.json({
        data: data.slice(0,limit),
        links: {
            next: next ? pageLink(req,next) : null
        }
    })
}