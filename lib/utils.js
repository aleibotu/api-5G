const isValidTimeString = function (timeString) {
    try {
        // Attempt to create a Date object from the time string
        const date = new Date(timeString);

        // Check if the Date object created is valid
        return !isNaN(date.getTime());
    } catch (error) {
        // If an error occurs during parsing, return false
        return false;
    }
}

const isStartTimeBeforeEndTime = function (startTime, endTime) {
    const startTimeMillis = new Date(startTime).getTime();
    const endTimeMillis = new Date(endTime).getTime();

    // Compare the millisecond values
    return startTimeMillis < endTimeMillis;
}

const isTimeScaleLessThan7Days = function (startTime, endTime) {
    // Parse the startTime and endTime strings into Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Calculate the difference in milliseconds between the two dates
    const differenceInMilliseconds = endDate - startDate;

    // Calculate the difference in days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    // Check if the difference is less than 7 days
    return differenceInDays < 7;
}

module.exports = {
    isValidTimeString,
    isStartTimeBeforeEndTime,
    isTimeScaleLessThan7Days
}
