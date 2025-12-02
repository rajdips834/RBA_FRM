import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const getActionColor = (action) => {
	switch (action) {
		case "Decline Request":
			return "#ef4444"; // red-500
		case "Review":
			return "#f59e0b"; // amber-500
		case "Require MFA":
			return "#06b6d4"; // cyan-500
		case "Bypass MFA":
			return "#3b82f6"; // blue-500
		case "NA":
			return "#64748b"; // slate-500
		default:
			return "#64748b";
	}
};

const ActionPieChart = ({ stats }) => {
	const chartData = useMemo(() => {
		return Object.entries(stats)
			.filter(([, value]) => value > 0) // Only show actions with a count > 0
			.map(([name, value]) => ({ name, value }));
	}, [stats]);

	if (chartData.length === 0) {
		return <div className="flex items-center justify-center h-full text-slate-400">No summary data to display.</div>;
	}

	return (
		<ResponsiveContainer width="100%" height={250}>
			<PieChart>
				<Tooltip
					contentStyle={{
						background: "rgba(30, 41, 59, 0.8)",
						borderColor: "#334155",
						borderRadius: "0.5rem",
					}}
					cursor={{ fill: "rgba(100, 116, 139, 0.1)" }}
				/>
				<Legend iconType="circle" />
				<Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
					{chartData.map((entry) => (
						<Cell key={`cell-${entry.name}`} fill={getActionColor(entry.name)} />
					))}
				</Pie>
			</PieChart>
		</ResponsiveContainer>
	);
};

export default ActionPieChart;
