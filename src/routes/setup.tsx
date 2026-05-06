import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/setup")({
	component: SetupComponent,
});

function SetupComponent() {
	const [apiUrl, setApiUrl] = useState("");
	const [isMock, setIsMock] = useState(false);

	useEffect(() => {
		const savedUrl =
			localStorage.getItem("radar_api_url") || "ws://localhost:81";
		const savedMock = localStorage.getItem("radar_mock_mode") === "true";
		setApiUrl(savedUrl);
		setIsMock(savedMock);
	}, []);

	const handleSave = () => {
		localStorage.setItem("radar_api_url", apiUrl);
		localStorage.setItem("radar_mock_mode", String(isMock));
		alert("¡Ajustes guardados!");
	};

	return (
		<div className="w-full max-md space-y-8 p-6 bg-neutral-900 rounded-xl border border-neutral-800 mt-10">
			<div>
				<h2 className="text-2xl font-bold text-white mb-2">
					Ajustes del Radar
				</h2>
				<p className="text-neutral-400">Configura la conexión de tu ESP32</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="url" className="text-sm font-medium text-neutral-300">
						URL de la API WebSocket
					</label>
					<input
						id="url"
						type="text"
						value={apiUrl}
						onChange={(e) => setApiUrl(e.target.value)}
						className="w-full bg-black border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
						placeholder="ws://192.168.1.100:81"
					/>
				</div>

				<div className="flex items-center gap-3">
					<input
						id="mock"
						type="checkbox"
						checked={isMock}
						onChange={(e) => setIsMock(e.target.checked)}
						className="w-5 h-5 accent-green-500"
					/>
					<label
						htmlFor="mock"
						className="text-sm font-medium text-neutral-300"
					>
						Activar modo de datos simulados
					</label>
				</div>

				<button
					type="button"
					onClick={handleSave}
					className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-green-900/20"
				>
					Guardar Configuración
				</button>
			</div>

			<div className="p-4 bg-black/50 rounded-lg border border-neutral-800">
				<h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
					Ayuda
				</h3>
				<p className="text-xs text-neutral-400 leading-relaxed">
					Para ESP32, normalmente se usa un servidor WebSocket en el puerto 81.
					Asegúrate de que tu dispositivo esté en la misma red.
				</p>
			</div>
		</div>
	);
}
