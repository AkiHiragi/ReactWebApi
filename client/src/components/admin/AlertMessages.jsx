const AlertMessages = ({error, success}) => {
    return (
        <>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
        </>
    )
}

export default AlertMessages;