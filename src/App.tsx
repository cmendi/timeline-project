import { useState } from "react";
import { format, subDays } from "date-fns";

type Task = {
	name: string;
	offset: number;
	dependsOn: string | null;
};

type TimelineTask = Task & { date: Date };

const tasks: Task[] = [
	{ name: "Business Case", offset: 0, dependsOn: null },
	{ name: "Business Case Approval", offset: 7, dependsOn: "Business Case" },
	{ name: "Scope Created", offset: 2, dependsOn: "Business Case Approval" },
	{ name: "Concept Ideas", offset: 3, dependsOn: "Scope Created" },
	{ name: "Initial Design", offset: 21, dependsOn: "Concept Ideas" },
	{ name: "Design Review", offset: 14, dependsOn: "Initial Design" },
	{ name: "Name/Branding", offset: 11, dependsOn: "Design Review" },
	{ name: "Detailed Design", offset: 11, dependsOn: "Name/Branding" },
	{ name: "Prototype Created", offset: 14, dependsOn: "Detailed Design" },
	{ name: "Prototype Test", offset: 14, dependsOn: "Prototype Created" },
	{ name: "Design Finalized", offset: 7, dependsOn: "Prototype Test" },
	{ name: "RFQ(Quotes Received)", offset: 7, dependsOn: "Design Finalized" },
	// { name: "First Article (Received) (No tooling)", offset: 14, dependsOn: "RFQ(Quotes Received)" },
	{ name: "First Article (Received) (Tooling)", offset: 70, dependsOn: "RFQ(Quotes Received)" },
	{ name: "First Article(Approved)", offset: 14, dependsOn: "First Article (Received) (Tooling)" },
	{ name: "Final Docs", offset: 7, dependsOn: "First Article(Approved)" },
	{ name: "Production Parts Ordered", offset: 7, dependsOn: "First Article(Approved)" },
	{ name: "Provide Marketing first articles for photos", offset: 1, dependsOn: "First Article(Approved)" },
	{ name: "Website Product Photos", offset: 7, dependsOn: "Provide Marketing first articles for photos" },
	{ name: "Source Vehicle", offset: 7, dependsOn: "First Article (Received) (Tooling)" },
	{ name: "Install Kits", offset: 7, dependsOn: "Source Vehicle" },
	{ name: "Vehicle Photos", offset: 7, dependsOn: "Install Kits" },
	{ name: "Production run through", offset: 7, dependsOn: "First Article (Received) (Tooling)" },
	{ name: "Website Prep", offset: 7, dependsOn: "Final Docs" },
	{ name: "Sales/Customer Service Notice", offset: 3, dependsOn: "Website Prep" },
	{ name: "Dealer Notice", offset: 14, dependsOn: "Website Prep" },
	{ name: "Production Parts Received", offset: 60, dependsOn: "Production Parts Ordered" },
	{ name: "Website Live", offset: 30, dependsOn: "Dealer Notice" },
	{ name: "NPA Sent", offset: 30, dependsOn: "Dealer Notice" },
];

const App: React.FC = () => {
	const [launchDate, setLaunchDate] = useState<string>("");
	const [timeline, setTimeline] = useState<TimelineTask[]>([]);

	const generateTimeline = (): void => {
		if (!launchDate || isNaN(new Date(launchDate).getTime())) {
			alert("Please select a valid launch date.");
			return;
		}

		const map: Record<string, Date> = {};
		const result: TimelineTask[] = [];

		for (const task of tasks) {
			if (task.name === "Business Case") {
				const taskDate = new Date(launchDate + "T00:00:00");
				map[task.name] = taskDate;
				result.push({ ...task, date: taskDate });
				continue;
			}

			const baseDate = map[task.dependsOn!];
			if (!baseDate || isNaN(baseDate.getTime())) {
				console.warn(`Skipping task "${task.name}" due to missing or invalid dependency date.`);
				continue;
			}
			const taskDate = subDays(baseDate, -task.offset);
			map[task.name] = taskDate;
			result.push({ ...task, date: taskDate });
		}

		setTimeline(result);
	};

	const resetTime = () => {
		setLaunchDate("");
		setTimeline([]);
	};

	return (
		<div className="p-4 font-sans max-w-xl mx-auto">
			<h1 className="flex text-2xl font-bold mb-4 justify-center">Project Timeline Generator</h1>
			<input type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} className="border p-2 rounded mb-4 w-full" />
			<div className="flex space-x-4">
				<button onClick={generateTimeline} className="bg-black text-white py-2 px-4 rounded mb-4">
					Generate Timeline
				</button>
				<button onClick={resetTime} className="bg-red-600 text-white py-2 px-4 rounded mb-4">
					Reset
				</button>
			</div>

			<ul className="space-y-2">
				{timeline.map((task) => (
					<li key={task.name} className="border p-2 rounded shadow">
						<div className="font-semibold">{task.name}</div>
						<div>{task.date && !isNaN(task.date.getTime()) ? format(task.date, "PPP") : "Invalid date"}</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default App;
