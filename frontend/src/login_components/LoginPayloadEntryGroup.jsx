import React, { useState, useEffect} from "react";
import LoginConfigPanel from "./LoginConfigPanel";
import CodePanel from "../components/CodePanel";
import { getISODateTime } from "../utils/dateUtils";
import { buildTempLoginPayload } from "../utils/login_utils/buildLoginPayload";

const LoginPayloadEntryGroup = ({ onSave, onCancel, maxAddableCount, initialData, isMultiRequest = false }) => {
	const isEditing = !!initialData;
	const [loginData, setLoginData] = useState(
		initialData && initialData.payload && initialData.payload.data
			? { ...initialData.payload.data }
			: {
					timestamp: getISODateTime(),
					time_taken_to_complete_login_min: 5,
					time_taken_to_complete_login_max: 15,
					timestamp_start: getISODateTime(),
					timestamp_end: getISODateTime(),
					city: "Mumbai",
					country: "India",
					vpn_check: "0",
					time_zone: "asia/calcutta",
			  }
	);
	const [tempPayload, setTempPayload] = useState({});
	useEffect(() => {
		async function updatePreview() {
			const payload = await buildTempLoginPayload(loginData);
			setTempPayload(payload);
		}
		updatePreview();
	}, [loginData]);
	const [count, setCount] = useState(initialData?.count || 1);

	useEffect(() => {
		if (maxAddableCount !== undefined && count > maxAddableCount) {
			setCount(maxAddableCount > 0 ? maxAddableCount : 1);
		}
	}, [maxAddableCount, count]);

	const handleSaveClick = () => {
		if (count > 0) {
			// Build the payload using the current loginData
			const payload = tempPayload;
			// Call onSave with the expected structure
			if (typeof onSave === "function") {
				onSave({ payload, count });
			}
		} else {
			alert("Request count must be greater than 0.");
		}
	};
	return (
		<div className="space-y-4 p-4 border border-slate-700 rounded-xl bg-slate-900/50">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="flex flex-col gap-8">
					<LoginConfigPanel loginData={loginData} setLoginData={setLoginData} isMultiRequest={isMultiRequest} />
				</div>
				<CodePanel title="Live Payload Preview" content={tempPayload} />
			</div>

			{/* Controls row: always at the bottom, full width */}
			<div className="flex flex-col md:flex-row items-end gap-4 pt-4 mt-4 border-t border-slate-700">
				<div className="flex-1">
					<label className="block text-xs font-medium text-slate-400 mb-1">How many requests should use this payload?</label>
					<div className="flex items-center gap-3">
						<input type="range" min={1} max={maxAddableCount > 0 ? maxAddableCount : 1} value={count} onChange={(e) => setCount(parseInt(e.target.value, 10))} className="w-full accent-cyan-500 bg-{slate-700/50}" style={{ accentColor: "#06b6d4" }} disabled={maxAddableCount <= 0 && !isEditing} />
						<span className="text-sm font-mono w-12 text-center">{count}</span>
					</div>
				</div>
				<div className="flex items-center gap-2 mt-4 md:mt-0">
					{isEditing && (
						<button onClick={onCancel} type="button" className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-all">
							Cancel
						</button>
					)}
					<button onClick={handleSaveClick} disabled={maxAddableCount <= 0 && !isEditing} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
						{isEditing ? "Update Batch" : "Add Batch"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginPayloadEntryGroup;
