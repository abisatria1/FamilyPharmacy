const customError  = (message , status) => {
    const err = new Error(message)
    err.status = status
    return err
}

const response  = (res,type,result,message,code) => {
    let responseData = {}
    if (result === "" || result === null) responseData = {}
    else responseData = result

    let status
    switch (type) {
        case "fail":
            status = false
            break
        case "success" : 
            status = true
            break
        default:
            status = false
            break
    }
    res.status(code).json(
        {
            success : status,
            message,
            code,
            data : responseData
        }
    )
}

module.exports = {
    customError,
    response
}