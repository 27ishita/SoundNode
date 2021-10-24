export interface StreamState {

    playing: boolean;
    readableCurrentTime: string;
    readableDuration: string;
    duration: number | undefined;
    currentTime: number | undefined;
    volume: number,
    canplay: boolean;
    error: boolean;
}
