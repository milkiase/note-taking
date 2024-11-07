export const getDateStringFromSeconds = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
    return formattedDate;
}