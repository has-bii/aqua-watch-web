const deviceUptimeFormatter = (uptime: number | undefined): string => {
    if (!uptime)
        return "Offline";

    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = uptime % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default deviceUptimeFormatter;