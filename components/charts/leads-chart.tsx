"use client";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LeadsChartProps {
    data: Array<{ date: string; count: number }>;
}

export function LeadsOverTimeChart({ data }: LeadsChartProps) {
    const chartData = {
        labels: data.map((d) => d.date),
        datasets: [
            {
                label: "Leads",
                data: data.map((d) => d.count),
                borderColor: "#6BBE45",
                backgroundColor: "rgba(107, 190, 69, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <div className="h-[300px]">
            <Line data={chartData} options={options} />
        </div>
    );
}
