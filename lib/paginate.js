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

// Get paginated data using aggregation pipeline
const aggregate = async ({limit,model,pipeline,req}) => {
    if (req.params.afterId ) { pipeline = await addCursorCondition({model,pipeline,_id: req.params.afterId}) }
    pipeline.push({$limit: limit + 1})
    return model.aggregate(pipeline)
}

// Get paginated data using find
const find = async({criteria,limit,model,req,select,sort}) => {
    if ( req.params.afterId ) { criteria._id = { $gt: req.params.afterId } }
    return model
        .find(criteria)
        .select(select)
        .sort(sort)
        .limit(limit + 1)
}

// Generate link for page at specified cursor
const pageLink = (req,cursor) => {
    const q = Object.entries(req.query)
    const qs = q.length > 0 ? '?' + q.map(([f,v]) => `${f}=${v}`).join('&') : ''
    return req.baseUrl + "/after/" + cursor + qs
}

module.exports = async ({req,res,model,criteria={},select={},sort={_id: 1},pipeline=null}) => {
    const limit = 10
    const c = {limit,model,pipeline,req}
    const data = await (pipeline ? aggregate(c) : find({...c,criteria,select,sort}))
    const next = data[limit] ? data[limit-1]._id : null
    return res.json({
        data: data.slice(0,limit),
        links: {
            next: next ? pageLink(req,next) : null
        }
    })
}