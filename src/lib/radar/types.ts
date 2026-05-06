export interface RadarPoint {
	angle: number; // 0-359 degrees
	distance: number; // distance in cm
	timestamp: number;
}

export interface RadarAdapter {
	connect(url: string, onData: (point: RadarPoint) => void): void;
	disconnect(): void;
}
