export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'long'});
    const year = date.getFullYear();
    return `${month} ${day}${getDaySuffix(day)}, ${year}`;
}

export function formatMoney(cents) {
    const dollars = Math.floor(cents / 100);
    const centsPart = cents % 100;

    return (dollars + centsPart / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}
function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

export function underwriteDateFormat(inputDate: string) {
    try {
        const dateObj = new Date(inputDate);

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        const formattedDate = `${year}/${month}/${day}`;

        return formattedDate;
    } catch (error) {
        return "Invalid date format";
    }
}

