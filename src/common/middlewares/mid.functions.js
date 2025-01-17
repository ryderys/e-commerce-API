const stringToArray = (...fields) => (req, res, next) => {
    try {
        fields.forEach(field => {
            let value = req.body[field];

            // Validate that the field is either a string, an array, or undefined
            if(value !== undefined && typeof value !== 'string' && !Array.isArray(value)){
                throw new Error(`Expected string or array for field '${field}', but received type '${typeof value}'.`)
            }

            // If the field is a string, convert it to an array
            if(typeof value === 'string'){
                req.body[field] = value
                    .split(/[#,\s]+/) // Split by #, comma, or whitespace
                    .map(item => item.trim()) // Trim whitespace
                    .filter(item => item) // Remove empty strings
            }

            // If the field is an array (including after conversion from a string)
            if(Array.isArray(req.body[field])){
                req.body[field] = req.body[field]
                    .map(item => (typeof item === 'string' ? item.trim(): item)) // Trim strings in the array
                    .filter(item => typeof item === 'string' && item.length > 0) // Filter out non-string or empty entries

                    //remove duplicates
                    req.body[field] = Array.from(new Set(req.body[field]))
            }


            // If the field doesn't exist, initialize it as an empty array
            if(req.body[field] === undefined){
                req.body[field] = []
            }
        })
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    stringToArray
}