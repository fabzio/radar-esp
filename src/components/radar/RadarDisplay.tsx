import { useEffect, useRef } from "react";
import type { RadarPoint } from "../../lib/radar/types";

interface RadarDisplayProps {
	points: RadarPoint[];
	currentPoint: RadarPoint | null;
	maxDistance?: number; // in cm
}

export function RadarDisplay({
	points,
	currentPoint,
	maxDistance = 400,
}: RadarDisplayProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const width = canvas.width;
		const height = canvas.height;
		const centerX = width / 2;
		const centerY = height / 2;
		const radius = Math.min(centerX, centerY) * 0.9;

		const draw = () => {
			ctx.clearRect(0, 0, width, height);

			// Background
			ctx.fillStyle = "#0a0a0a";
			ctx.fillRect(0, 0, width, height);

			// Grid
			ctx.strokeStyle = "#1a4a1a";
			ctx.lineWidth = 1;
			for (let i = 1; i <= 4; i++) {
				ctx.beginPath();
				ctx.arc(centerX, centerY, (radius / 4) * i, 0, Math.PI * 2);
				ctx.stroke();
			}

			// Lines every 30 degrees
			for (let i = 0; i < 360; i += 30) {
				const rad = (i * Math.PI) / 180;
				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.lineTo(
					centerX + Math.cos(rad) * radius,
					centerY + Math.sin(rad) * radius,
				);
				ctx.stroke();
			}

			// Surface Points
			ctx.fillStyle = "#00ff00";
			for (const p of points) {
				const rad = ((p.angle - 90) * Math.PI) / 180; // Offset by 90 to make 0 top
				const d = Math.min(p.distance, maxDistance);
				const distPx = (d / maxDistance) * radius;
				const x = centerX + Math.cos(rad) * distPx;
				const y = centerY + Math.sin(rad) * distPx;

				ctx.beginPath();
				ctx.arc(x, y, 2, 0, Math.PI * 2);
				ctx.fill();
			}

			// Sweeper Line
			if (currentPoint) {
				const rad = ((currentPoint.angle - 90) * Math.PI) / 180;
				ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.lineTo(
					centerX + Math.cos(rad) * radius,
					centerY + Math.sin(rad) * radius,
				);
				ctx.stroke();

				// Gradient for the sweep
				const grad = ctx.createConicGradient(rad, centerX, centerY);
				grad.addColorStop(0, "rgba(0, 255, 0, 0.3)");
				grad.addColorStop(0.1, "rgba(0, 255, 0, 0)");
				ctx.fillStyle = grad;
				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.arc(centerX, centerY, radius, rad, rad - 0.5, true);
				ctx.closePath();
				ctx.fill();
			}
		};

		draw();
	}, [points, currentPoint, maxDistance]);

	return (
		<div className="relative aspect-square w-full max-w-[600px] rounded-full border-4 border-green-900 overflow-hidden shadow-[0_0_50px_rgba(0,50,0,0.5)]">
			<canvas
				ref={canvasRef}
				width={600}
				height={600}
				className="w-full h-full"
			/>
			<div className="absolute top-4 left-4 text-green-500 font-mono text-xs">
				SISTEMA_RADAR_ACTIVO
			</div>
			{currentPoint && (
				<div className="absolute bottom-4 right-4 text-green-500 font-mono text-sm bg-black/50 p-2 rounded">
					GRADOS: {currentPoint.angle.toFixed(1)}°<br />
					DIST: {currentPoint.distance.toFixed(1)}cm
				</div>
			)}
		</div>
	);
}
