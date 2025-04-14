export function getOrCreateDeviceId(): string {
    const key = 'deviceId';
    let id = localStorage.getItem(key);

    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }

    return id;
}

export function hasSentDeviceId(): boolean {
    return localStorage.getItem('deviceIdSent') === 'true';
}

export function markDeviceIdAsSent(): void {
    localStorage.setItem('deviceIdSent', 'true');
}
