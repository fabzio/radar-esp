import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { RadarDisplay } from "../components/radar/RadarDisplay";
import { useRadar } from "../hooks/useRadar";
import { MockRadarAdapter, WebSocketRadarAdapter } from "../lib/radar/adapters";
import type { RadarAdapter } from "../lib/radar/types";

export const Route = createFileRoute("/")({
	component: RadarPage,
});

function RadarPage() {
	const [config, setConfig] = useState<{ url: string; isMock: boolean } | null>(
		null,
	);

	useEffect(() => {
		const url = localStorage.getItem("radar_api_url") || "ws://localhost:81";
		const isMock = localStorage.getItem("radar_mock_mode") === "true";
		setConfig({ url, isMock });
	}, []);

	const adapter = useMemo(() => {
		if (!config) return null;
		return config.isMock ? new MockRadarAdapter() : new WebSocketRadarAdapter();
	}, [config]);

	if (!config || !adapter) {
		return (
			<div className="p-10 text-green-500 animate-pulse font-mono">
				INICIALIZANDO_SISTEMA...
			</div>
		);
	}

	return (
		<RadarDashboard adapter={adapter} url={config.url} isMock={config.isMock} />
	);
}

function RadarDashboard({
	adapter,
	url,
	isMock,
}: {
	adapter: RadarAdapter;
	url: string;
	isMock: boolean;
}) {
	const { points, currentPoint, clear } = useRadar(adapter, url);

	return (
		<div className="w-full flex flex-col items-center gap-8 py-6">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-black text-white tracking-widest uppercase">
					Reconstrucción de Superficie
				</h1>
				<div className="flex items-center justify-center gap-2">
					<span
						className={`w-2 h-2 rounded-full ${isMock ? "bg-yellow-500" : "bg-green-500"} animate-pulse`}
					/>
					<span className="text-xs font-mono text-neutral-500">
						{isMock ? "MODO_SIMULADO_ACTIVO" : `CONECTADO_A: ${url}`}
					</span>
				</div>
			</div>

			<RadarDisplay points={points} currentPoint={currentPoint} />

			<div className="flex gap-4">
				<button
					type="button"
					onClick={clear}
					className="px-6 py-2 border border-neutral-700 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
				>
					Limpiar Buffer
				</button>
			</div>

			<div className="grid grid-cols-2 gap-4 w-full max-w-md">
				<div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
					<div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">
						Muestras
					</div>
					<div className="text-2xl font-mono text-green-500">
						{points.length}
					</div>
				</div>
				<div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
					<div className="text-[10px] text-neutral-500 uppercase font-bold mb-1">
						Último Ángulo
					</div>
					<div className="text-2xl font-mono text-green-500">
						{currentPoint ? `${currentPoint.angle.toFixed(0)}°` : "--"}
					</div>
				</div>
			</div>
		</div>
	);
}
