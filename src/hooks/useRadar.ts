import { useCallback, useEffect, useRef, useState } from "react";
import type { RadarAdapter, RadarPoint } from "../lib/radar/types";

export function useRadar(adapter: RadarAdapter, url: string) {
	const [points, setPoints] = useState<RadarPoint[]>([]);
	const [currentPoint, setCurrentPoint] = useState<RadarPoint | null>(null);
	const pointsRef = useRef<Record<number, RadarPoint>>({});

	const handleData = useCallback((point: RadarPoint) => {
		// Round angle to nearest integer to avoid too many points
		const angle = Math.round(point.angle) % 360;
		pointsRef.current[angle] = point;
		setCurrentPoint(point);
		setPoints(Object.values(pointsRef.current));
	}, []);

	useEffect(() => {
		if (!url) return;
		adapter.connect(url, handleData);
		return () => adapter.disconnect();
	}, [adapter, url, handleData]);

	const clear = useCallback(() => {
		pointsRef.current = {};
		setPoints([]);
	}, []);

	return { points, currentPoint, clear };
}
