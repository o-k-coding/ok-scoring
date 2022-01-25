export interface Score<T = number> {
    scores: T[];
    score: number;
    initialScore?: number;
    order: number;
}
