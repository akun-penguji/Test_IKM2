import Chart from "@/Components/Chart";
import { Head } from "@inertiajs/react";

export default function GraphOnly({ auth, period }) {
    return (
        <>
            <Head title="Chart" />
            <Chart period={period} />
        </>
    );
}
