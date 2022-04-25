exports.handler = async function(event) {
    console.log("Job Stared")
    console.log(event)
    console.log("Job Finished")
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ message: 'Cron Job success!' }),
    };
};