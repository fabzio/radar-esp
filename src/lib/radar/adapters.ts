import type { RadarAdapter, RadarPoint } from "./types";

export class WebSocketRadarAdapter implements RadarAdapter {
	private socket: WebSocket | null = null;

	connect(url: string, onData: (point: RadarPoint) => void): void {
		this.disconnect();
		this.socket = new WebSocket(url);

		this.socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				// Assuming data format: { angle: number, distance: number }
				if (
					typeof data.angle === "number" &&
					typeof data.distance === "number"
				) {
					onData({
						angle: data.angle,
						distance: data.distance,
						timestamp: Date.now(),
					});
				}
			} catch (e) {
				console.error("Failed to parse radar data", e);
			}
		};

		this.socket.onerror = (err) => {
			console.error("Radar WebSocket error", err);
		};
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
	}
}

export class MockRadarAdapter implements RadarAdapter {
	private interval: ReturnType<typeof setInterval> | null = null;
	private currentAngle = 0;

	connect(_url: string, onData: (point: RadarPoint) => void): void {
		this.disconnect();
		this.interval = setInterval(() => {
			this.currentAngle = (this.currentAngle + 2) % 360;
			// Generate some "surface" points
			const baseDistance = 150;
			const noise = Math.sin(this.currentAngle * (Math.PI / 180) * 5) * 50;
			onData({
				angle: this.currentAngle,
				distance: baseDistance + noise + Math.random() * 10,
				timestamp: Date.now(),
			});
		}, 50);
	}

	disconnect(): void {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
	}
}
